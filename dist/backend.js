(function () {
  const config = window.SIDEQUEST_CONFIG || {};
  const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
  let client = null;
  let user = null;
  let username = null;
  let circleId = null;
  let inviteCode = null;
  let channel = null;

  function colorForName(name) {
    const colors = ["face-yellow", "face-blue", "face-pink", "face-green"];
    const total = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return colors[total % colors.length];
  }

  function mapMessage(row) {
    const name = row.profiles?.display_name || (row.user_id === user?.id ? "You" : "Friend");
    return {
      id: row.id,
      author: row.user_id === user?.id ? "You" : name,
      initial: row.user_id === user?.id ? "You" : name.charAt(0).toUpperCase(),
      color: colorForName(name),
      text: row.body,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
  }

  async function ensureProfile() {
    const displayName = localStorage.getItem("sidequest-display-name") || config.displayName || "You";
    username = localStorage.getItem("sparkit-username")
      || config.username
      || `spark_${user.id.replaceAll("-", "").slice(0, 8)}`;
    const { error } = await client.from("profiles").upsert({ id: user.id, display_name: displayName, username });
    if (error) throw error;
    localStorage.setItem("sparkit-username", username);
  }

  async function findCircle() {
    const inviteFromUrl = new URLSearchParams(window.location.search).get("circle");
    if (inviteFromUrl) {
      await joinCircle(inviteFromUrl);
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash || "#today"}`);
      return;
    }

    const savedCircle = localStorage.getItem("sidequest-supabase-circle-id");
    if (savedCircle) {
      circleId = savedCircle;
      return;
    }

    const { data: memberships, error } = await client.from("circle_members").select("circle_id").limit(1);
    if (error) throw error;
    if (memberships?.length) {
      circleId = memberships[0].circle_id;
      localStorage.setItem("sidequest-supabase-circle-id", circleId);
      return;
    }
  }

  async function init() {
    if (!configured) return { enabled: false };
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    let { data: { session } } = await client.auth.getSession();
    if (!session) {
      const result = await client.auth.signInAnonymously();
      if (result.error) throw result.error;
      session = result.data.session;
    }
    user = session.user;
    await ensureProfile();
    await findCircle();
    let circleName = null;
    if (circleId) {
      const { data } = await client.from("circles").select("name,invite_code").eq("id", circleId).single();
      circleName = data?.name || null;
      inviteCode = data?.invite_code || inviteCode;
    }
    const circles = await loadCircles();
    return { enabled: true, userId: user.id, username, circleId, circleName, inviteCode, circles };
  }

  async function loadCircles() {
    if (!configured) return [];
    const { data, error } = await client.from("circle_members")
      .select("circle_id,circles(id,name,invite_code)").order("joined_at");
    if (error) throw error;
    return data.map((membership) => membership.circles).filter(Boolean);
  }

  async function sendFriendRequest(targetUsername) {
    if (!configured) return null;
    const { data: target, error: targetError } = await client.from("profiles")
      .select("id,username,display_name").ilike("username", targetUsername).single();
    if (targetError || !target) throw new Error("User not found");
    if (target.id === user.id) throw new Error("You cannot add yourself");

    const { data: existing } = await client.from("friend_requests")
      .select("id,sender_id,recipient_id,status")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${target.id}),and(sender_id.eq.${target.id},recipient_id.eq.${user.id})`)
      .maybeSingle();
    if (existing) {
      if (existing.status === "pending" && existing.recipient_id === user.id) {
        await acceptFriendRequest(existing.id);
        return { ...target, status: "accepted" };
      }
      return { ...target, status: existing.status };
    }

    const { error } = await client.from("friend_requests")
      .insert({ sender_id: user.id, recipient_id: target.id });
    if (error) throw error;
    return { ...target, status: "pending" };
  }

  async function updateUsername(nextUsername) {
    if (!configured) return nextUsername;
    const { data, error } = await client.from("profiles")
      .update({ username: nextUsername }).eq("id", user.id).select("username").single();
    if (error) throw error;
    username = data.username;
    localStorage.setItem("sparkit-username", username);
    return username;
  }

  async function loadFriends() {
    if (!configured) return [];
    const { data: requests, error } = await client.from("friend_requests")
      .select("id,sender_id,recipient_id,status")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at");
    if (error) throw error;
    const ids = [...new Set(requests.map((request) => request.sender_id === user.id ? request.recipient_id : request.sender_id))];
    if (!ids.length) return [];
    const { data: profiles, error: profilesError } = await client.from("profiles")
      .select("id,username,display_name").in("id", ids);
    if (profilesError) throw profilesError;
    const profileById = Object.fromEntries(profiles.map((profile) => [profile.id, profile]));
    return requests.map((request) => {
      const otherId = request.sender_id === user.id ? request.recipient_id : request.sender_id;
      return {
        ...profileById[otherId],
        requestId: request.id,
        status: request.status,
        incoming: request.recipient_id === user.id,
      };
    }).filter((friend) => friend.username);
  }

  async function acceptFriendRequest(requestId) {
    if (!configured) return null;
    const { data, error } = await client.from("friend_requests")
      .update({ status: "accepted" }).eq("id", requestId).eq("recipient_id", user.id).select().single();
    if (error) throw error;
    return data;
  }

  async function createCircle(name, members = []) {
    if (!configured) return null;
    let { data, error } = await client.rpc("create_circle_with_members", {
      circle_name: name,
      member_usernames: members,
    });
    if (error?.code === "PGRST202") {
      ({ data, error } = await client.rpc("create_circle", { circle_name: name }));
    }
    if (error) throw error;
    const created = data[0];
    circleId = created.id;
    inviteCode = created.invite_code;
    localStorage.setItem("sidequest-supabase-circle-id", circleId);
    localStorage.setItem("sidequest-invite-code", inviteCode);
    return created;
  }

  async function joinCircle(code) {
    if (!configured) return null;
    const { data, error } = await client.rpc("join_circle_by_code", { code });
    if (error) throw error;
    circleId = data;
    localStorage.setItem("sidequest-supabase-circle-id", circleId);
    return circleId;
  }

  async function selectCircle(id) {
    if (!configured) return null;
    circleId = id;
    localStorage.setItem("sidequest-supabase-circle-id", circleId);
    const { data, error } = await client.from("circles")
      .select("invite_code").eq("id", circleId).single();
    if (error) throw error;
    inviteCode = data.invite_code;
    return { id: circleId, inviteCode };
  }

  async function saveAnswer(mode, body, visibility, question, followUp, answerDate, circleIds = []) {
    if (!configured) return null;
    const targetCircles = visibility === "friends" ? [...new Set(circleIds.length ? circleIds : [circleId].filter(Boolean))] : [];
    let { data, error } = await client.rpc("save_daily_answer_to_circles", {
      answer_date: answerDate,
      answer_mode: mode,
      question_body: question,
      question_follow_up: followUp,
      answer_body: body,
      answer_visibility: visibility,
      target_circles: targetCircles,
    });
    if (error?.code === "PGRST202" && targetCircles.length <= 1) {
      ({ data, error } = await client.rpc("save_daily_answer", {
        answer_date: answerDate,
        answer_mode: mode,
        question_body: question,
        question_follow_up: followUp,
        answer_body: body,
        answer_visibility: visibility,
        target_circle: visibility === "friends" ? targetCircles[0] : null,
      }));
    }
    if (error) throw error;
    return data;
  }

  async function loadCircleAnswers(mode, answerDate) {
    if (!configured || !circleId) return [];
    const { data: sharedAnswers, error: sharedError } = await client.rpc("load_circle_answers", {
      target_circle: circleId,
      answer_mode: mode,
      answer_date: answerDate,
    });
    if (!sharedError) {
      return sharedAnswers.map((answer) => ({
        id: answer.id,
        body: answer.body,
        mine: answer.mine,
        name: answer.mine ? "You" : (answer.display_name || answer.username || "Friend"),
      }));
    }
    if (sharedError.code !== "PGRST202") throw sharedError;
    const { data: question, error: questionError } = await client.from("questions")
      .select("id").eq("question_date", answerDate).eq("mode", mode).maybeSingle();
    if (questionError) throw questionError;
    if (!question) return [];
    const { data, error } = await client.from("answers")
      .select("id,user_id,body,profiles(display_name,username)")
      .eq("question_id", question.id).eq("circle_id", circleId).order("created_at");
    if (error) throw error;
    return data.map((answer) => ({
      id: answer.id,
      body: answer.body,
      mine: answer.user_id === user.id,
      name: answer.user_id === user.id ? "You" : (answer.profiles?.display_name || answer.profiles?.username || "Friend"),
    }));
  }

  async function loadCircleStats(answerDate) {
    if (!configured || !circleId) return null;
    const { data, error } = await client.rpc("get_circle_daily_stats", {
      target_circle: circleId,
      target_date: answerDate,
    });
    if (error?.code === "PGRST202") return null;
    if (error) throw error;
    const stats = data?.[0];
    return stats ? {
      memberCount: Number(stats.member_count),
      answeredCount: Number(stats.answered_count),
    } : null;
  }

  async function loadMessages() {
    if (!configured || !circleId) return [];
    const { data, error } = await client
      .from("messages")
      .select("id,user_id,body,created_at,profiles(display_name)")
      .eq("circle_id", circleId).order("created_at").limit(100);
    if (error) throw error;
    return data.map(mapMessage);
  }

  async function sendMessage(body) {
    if (!configured || !circleId) return null;
    const { data, error } = await client.from("messages")
      .insert({ circle_id: circleId, user_id: user.id, body }).select().single();
    if (error) throw error;
    return data;
  }

  function subscribeToMessages(onChange) {
    if (!configured || !circleId) return;
    if (channel) client.removeChannel(channel);
    channel = client.channel(`circle:${circleId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `circle_id=eq.${circleId}` }, onChange)
      .subscribe();
  }

  window.sidequestBackend = {
    enabled: configured,
    init,
    loadCircles,
    createCircle,
    joinCircle,
    selectCircle,
    sendFriendRequest,
    updateUsername,
    loadFriends,
    acceptFriendRequest,
    saveAnswer,
    loadCircleAnswers,
    loadCircleStats,
    loadMessages,
    sendMessage,
    subscribeToMessages,
  };
})();
