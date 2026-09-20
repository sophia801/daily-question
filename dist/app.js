const form = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const answerLabel = document.querySelector("#answer-label");
const answerCount = document.querySelector("#answer-count");
const lockedState = document.querySelector("#locked-state");
const privateState = document.querySelector("#private-state");
const privateAnswerText = document.querySelector("#private-answer-text");
const revealedState = document.querySelector("#revealed-state");
const yourAnswer = document.querySelector("#your-answer");
const privacyInputs = document.querySelectorAll('input[name="privacy"]');
const privacyResult = document.querySelector("#privacy-result");
const circlePrivacyLabel = document.querySelector("#circle-privacy-label");
const circlePrivacyTitle = document.querySelector("#circle-privacy-title");
const circlePrivacyHint = document.querySelector("#circle-privacy-hint");
const questionHeading = document.querySelector("#question-heading");
const dailyLabel = document.querySelector("#daily-label");
const worldNote = document.querySelector("#world-note");
const dailyDate = document.querySelector("#daily-date");
const personalStreakStatus = document.querySelector("#personal-streak-status");
const personalStreakMeter = document.querySelector("#personal-streak-meter");
const groupStreakStatus = document.querySelector("#group-streak-status");
const groupStreakMeter = document.querySelector("#group-streak-meter");
const circleStreakCopy = document.querySelector("#circle-streak-copy");
const circleStreakCount = document.querySelector("#circle-streak-count");
const circleStreakMeter = document.querySelector("#circle-streak-meter");
const conversationPrompt = document.querySelector("#conversation-prompt");
const modeButtons = document.querySelectorAll(".choice-button");
const questionColumn = document.querySelector(".question-column");
const toast = document.querySelector("#toast");
const todaySections = document.querySelectorAll(".today-only");
const historyView = document.querySelector("#history-view");
const historyDetail = document.querySelector("#history-detail");
const calendarDays = document.querySelectorAll(".calendar-day[data-date]");
const routeLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a[href^="#"]');
const circlesView = document.querySelector("#circles-view");
const friendsView = document.querySelector("#friends-view");
const circleDialog = document.querySelector("#circle-dialog");
const createCircleForm = document.querySelector("#create-circle-form");
const circleList = document.querySelector("#circle-list");
const roomName = document.querySelector("#circle-room-name");
const roomQuestion = document.querySelector("#circle-room-question");
const circleFollowup = document.querySelector("#circle-followup");
const friendSearchForm = document.querySelector("#friend-search-form");
const friendsGrid = document.querySelector("#friends-grid");
const viewCircleAnswers = document.querySelector("#view-circle-answers");
const answerGate = document.querySelector("#answer-gate");
const profileForm = document.querySelector("#profile-form");
const profileUsername = document.querySelector("#profile-username");
const friendSetupNote = document.querySelector("#friend-setup-note");

const privacyLabels = {
  private: "Just me",
};

const privacyClasses = {
  friends: "circle",
  private: "private",
};

function circleShareLabel(privacy) {
  if (privacy !== "friends") return privacyLabels[privacy];
  const activeItem = activeCircleId ? circleList.querySelector(`[data-circle="${activeCircleId}"]`) : null;
  return activeItem ? `Share to ${activeItem.dataset.name}` : "My circle";
}

const reflectiveQuestions = [
  { question: "If you met yourself from five years ago, what would you tell them?", followUp: "What would your younger self be proud to see?" },
  { question: "Would you rather be good and misunderstood, or admired for someone you are not?", followUp: "How much should other people's perception matter?" },
  { question: "What is a regret that still teaches you something?", followUp: "Would you make the same choice with what you knew then?" },
  { question: "Would you rather be a jack of many trades or the master of one?", followUp: "Which path feels more like the life you want?" },
  { question: "What has been on your mind recently?", followUp: "Is there a way your friends could help carry it?" },
  { question: "Do you think you are a good person?", followUp: "What action makes you believe that most?" },
  { question: "What is your greatest strength?", followUp: "When did that strength last help someone else?" },
  { question: "In a room of 100 people, what could you do that nobody else could?", followUp: "How did you get unexpectedly good at it?" },
  { question: "What was the biggest turning point in your life?", followUp: "Did you recognize it as a turning point at the time?" },
  { question: "What do you see yourself doing during retirement?", followUp: "What part of that life could you begin now?" },
  { question: "Are you comfortable with who you are as a person?", followUp: "What part of yourself took the longest to accept?" },
  { question: "What quote best represents your view on life?", followUp: "Has that view changed over time?" },
  { question: "Who has had the biggest impact on who you are?", followUp: "What part of them do you carry with you?" },
  { question: "What would you do with one extra hour every day?", followUp: "What currently keeps you from making time for it?" },
  { question: "What are you most proud of becoming better at?", followUp: "Who noticed the change before you did?" },
  { question: "Why did you last cry?", followUp: "Did anything feel different afterward?" },
  { question: "Who has had the biggest impact on you in the past year?", followUp: "What did they change for you?" },
  { question: "How do you think AI will affect your life going forward?", followUp: "What part feels exciting, and what part worries you?" },
  { question: "What is an app you wish existed in your life?", followUp: "What is the one thing it would do perfectly?" },
  { question: "What book, show, or movie has impacted you the most?", followUp: "Did it change what you believe or how you behave?" },
  { question: "How have your parents or guardians shaped who you are today?", followUp: "What did you keep, and what did you choose differently?" },
  { question: "What is one thing you would change about yourself?", followUp: "What might you lose if it changed?" },
  { question: "What is something you changed about yourself that you wish you had not?", followUp: "Is there a part of it you could reclaim?" },
];

const funQuestions = [
  { question: "Would you rather be a beef cow or a dairy cow?", followUp: "Defend your choice like your life depends on it." },
  { question: "Would you rather be a human with strawberry thoughts or a strawberry with human thoughts?", followUp: "What is the strawberry thinking about?" },
  { question: "Would you rather visit 50 years in the past or 50 years in the future?", followUp: "What is the first thing you would investigate?" },
  { question: "What unpopular book, movie, or show did you secretly love?", followUp: "Give the group your best defense of it." },
  { question: "What is your most vivid very-early childhood memory?", followUp: "How sure are you that the memory is real?" },
  { question: "Which cat are you today?", followUp: "Describe the cat's pose, mood, and exact location." },
  { question: "A trolley is headed toward five strangers. Would you redirect it if it permanently deleted your camera roll?", followUp: "What changes if the camera roll belongs to someone else?" },
  { question: "What is your go-to midnight snack?", followUp: "What drink completes the combination?" },
  { question: "If you could wake up anywhere you have never been, where would it be?", followUp: "Who from this group are you bringing?" },
  { question: "What was your favorite plushie as a kid?", followUp: "What was its name and personality?" },
  { question: "Give up your favorite food for a month, or eat only that food for a month?", followUp: "How many days before you regret your choice?" },
  { question: "Would you rather learn a new language or master a new skill?", followUp: "Which language or skill are you choosing?" },
  { question: "What are you genuinely in the top 1% at?", followUp: "What would the competition look like?" },
  { question: "Would you rather sneeze glitter or hiccup bubbles?", followUp: "Which one becomes more annoying after a week?" },
  { question: "Who is winning the next Super Bowl?", followUp: "Give one completely serious reason and one ridiculous reason." },
];

const today = new Date();
const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

function questionForToday(bank, mode) {
  if (todayKey === "2026-09-19") {
    return mode === "reflective"
      ? { question: "If you met yourself from five years ago, what would you tell them?", followUp: "What would your younger self be proud to see?" }
      : { question: "What was your favorite plushie as a kid?", followUp: "What was its name and personality?" };
  }
  if (mode === "reflective" && today.getDate() === 1) {
    return { question: "What are your goals for this month?", followUp: "Which one would feel most meaningful to finish?" };
  }
  if (mode === "reflective" && today.getDate() === lastDayOfMonth) {
    return { question: "What are you most proud of this month?", followUp: "What do you want to carry into next month?" };
  }
  if (mode === "fun" && today.getMonth() === 11 && today.getDate() >= 20 && today.getDate() <= 25) {
    return { question: "What is the best Christmas movie?", followUp: "Which movie is absolutely not a Christmas movie?" };
  }
  return bank[((dayIndex % bank.length) + bank.length) % bank.length];
}

const reflectiveToday = questionForToday(reflectiveQuestions, "reflective");
const funToday = questionForToday(funQuestions, "fun");

const dailyModes = {
  fun: {
    shortLabel: "Fun question",
    label: "Today's worldwide fun question",
    question: funToday.question,
    note: "A playful prompt everyone gets today. Go with your first instinct.",
    answerLabel: "Your answer",
    placeholder: "The more specific, the better...",
    followUp: funToday.followUp,
  },
  reflective: {
    shortLabel: "Reflective question",
    label: "Today's worldwide reflective question",
    question: reflectiveToday.question,
    note: "Take a moment with it. A specific, honest answer is enough.",
    answerLabel: "Your reflection",
    placeholder: "A person, a habit, a place, a tiny moment...",
    followUp: reflectiveToday.followUp,
  },
};

const demoHistoryRecords = {
  "2026-09-18": [
    { mode: "fun", privacy: "friends", question: "What tiny inconvenience would you permanently delete from the world?", answer: "Fitted sheets. No object should be that smug and that hard to fold.", shared: "Shared with friends · 3 replies" },
  ],
  "2026-09-16": [
    { mode: "reflective", privacy: "private", question: "What is something you are learning to be more patient with?", answer: "Not having every part of my future figured out at once.", shared: "Saved just for you" },
  ],
  "2026-09-15": [
    { mode: "fun", privacy: "friends", question: "What would your extremely specific superpower be?", answer: "Always choosing the fastest grocery-store line.", shared: "Shared with friends" },
    { mode: "reflective", privacy: "friends", question: "Where have you felt most like yourself recently?", answer: "Cooking with everyone in the kitchen, even when nobody is helping.", shared: "Shared with friends · 4 replies" },
  ],
  "2026-09-13": [
    { mode: "reflective", privacy: "friends", question: "What do you wish your friends asked you about more often?", answer: "The little creative projects I keep almost starting.", shared: "Shared with friends · 2 replies" },
  ],
  "2026-09-12": [
    { mode: "fun", privacy: "friends", question: "Which fictional home would be the worst place to have roommates?", answer: "The Batcave. Damp, loud, and Bruce would label everything.", shared: "Shared with friends · 5 replies" },
  ],
  "2026-09-11": [
    { mode: "fun", privacy: "friends", question: "What food opinion would get you voted out of the group?", answer: "Cold pizza is better than fresh pizza.", shared: "Shared with friends · 7 replies" },
  ],
  "2026-09-10": [
    { mode: "reflective", privacy: "private", question: "What has been taking more energy than you expected?", answer: "Keeping up with everyone when I actually need one quiet night.", shared: "Saved just for you" },
  ],
  "2026-09-08": [
    { mode: "fun", privacy: "friends", question: "What should our group be banned from doing unsupervised?", answer: "Planning trips after midnight.", shared: "Shared with friends · 6 replies" },
    { mode: "reflective", privacy: "friends", question: "What makes you feel cared for without anyone saying anything?", answer: "When someone remembers the snack I like.", shared: "Shared with friends · 4 replies" },
  ],
  "2026-09-07": [
    { mode: "fun", privacy: "friends", question: "What is our group chat's unofficial emergency?", answer: "Someone spotting a chair left on the sidewalk.", shared: "Shared with friends · 4 replies" },
  ],
  "2026-09-06": [
    { mode: "fun", privacy: "private", question: "What is the most dramatic way to leave a boring party?", answer: "Receive a fake call from the moon.", shared: "Saved just for you" },
  ],
  "2026-09-05": [
    { mode: "reflective", privacy: "friends", question: "What is one part of your week you want to protect?", answer: "Sunday mornings with nowhere to be.", shared: "Shared with friends · 3 replies" },
  ],
  "2026-09-03": [
    { mode: "fun", privacy: "friends", question: "What would your warning label say?", answer: "Will reorganize your bookshelf without permission.", shared: "Shared with friends · 4 replies" },
  ],
};

let historyRecords;
try {
  historyRecords = JSON.parse(localStorage.getItem("sparkit-answer-history-v1") || "{}") || {};
} catch {
  historyRecords = {};
}

let circleMessages;
try {
  circleMessages = JSON.parse(localStorage.getItem("sidequest-circle-messages-v2") || "{}") || {};
} catch {
  circleMessages = {};
}
let activeCircleId = null;

let customCircles;
try {
  customCircles = JSON.parse(localStorage.getItem("sidequest-custom-circles") || "[]");
} catch {
  customCircles = [];
}

let addedFriends;
try {
  addedFriends = JSON.parse(localStorage.getItem("sparkit-added-friends") || "[]");
} catch {
  addedFriends = [];
}

let activeMode = "reflective";

function storageKey(type, mode = activeMode) {
  return `sidequest-${type}-${todayKey}-${mode}`;
}

function getSaved(mode = activeMode) {
  return {
    answer: localStorage.getItem(storageKey("answer", mode)),
    privacy: localStorage.getItem(storageKey("privacy", mode)) || "private",
  };
}

function getTodayRecords() {
  return ["fun", "reflective"].flatMap((mode) => {
    const saved = getSaved(mode);
    if (!saved.answer) return [];
    return [{
      mode,
      privacy: saved.privacy,
      question: dailyModes[mode].question,
      answer: saved.answer,
      shared: saved.privacy === "private" ? "Saved just for you" : "Shared with your circle",
    }];
  });
}

function saveTodayToHistory() {
  historyRecords[todayKey] = getTodayRecords();
  localStorage.setItem("sparkit-answer-history-v1", JSON.stringify(historyRecords));
}

function hasCompletedToday() {
  return getTodayRecords().length > 0;
}

function renderStreaks() {
  const completed = hasCompletedToday();
  const groupAnswers = completed ? 3 : 2;
  const groupTotal = 4;
  const threshold = Math.ceil(groupTotal * 0.5);
  const streakSecured = groupAnswers >= threshold;

  personalStreakStatus.textContent = completed
    ? "Kept for today. One answer was enough."
    : "Answer either question to keep it going.";
  personalStreakMeter.style.width = completed ? "100%" : "72%";

  groupStreakStatus.textContent = streakSecured
    ? `Streak secured · ${groupAnswers} of ${groupTotal} answered today.`
    : `${groupAnswers} of ${threshold} needed to secure the streak.`;
  groupStreakMeter.style.width = `${(groupAnswers / groupTotal) * 100}%`;
  circleStreakCopy.textContent = streakSecured
    ? "Half the circle answered, so today's streak is safe. Either question counts."
    : `${threshold - groupAnswers} more answer needed to keep the circle streak.`;
  circleStreakCount.textContent = `${groupAnswers} / ${groupTotal} · 50% needed`;
  circleStreakMeter.style.width = `${(groupAnswers / groupTotal) * 100}%`;
}

function setFormLocked(locked) {
  answerInput.disabled = locked;
  form.querySelector('button[type="submit"]').disabled = locked;
  privacyInputs.forEach((input) => {
    input.disabled = locked || (input.value === "friends" && !activeCircleId);
  });
}

function showLockedState() {
  answerInput.value = "";
  answerCount.textContent = "2 of 4";
  form.querySelector('button[type="submit"]').innerHTML = 'Lock in answer <span aria-hidden="true">→</span>';
  privacyInputs.forEach((input) => { input.checked = input.value === (activeCircleId ? "friends" : "private"); });
  setFormLocked(false);
  lockedState.hidden = false;
  privateState.hidden = true;
  revealedState.hidden = true;
}

function showCompleted(answer, privacy) {
  answerInput.value = answer;
  form.querySelector('button[type="submit"]').textContent = "Completed today";
  privacyInputs.forEach((input) => { input.checked = input.value === privacy; });
  setFormLocked(true);
  lockedState.hidden = true;

  if (privacy === "private") {
    answerCount.textContent = "2 of 4";
    privateAnswerText.textContent = answer;
    privateState.hidden = false;
    revealedState.hidden = true;
    return;
  }

  answerCount.textContent = "3 of 4";
  yourAnswer.textContent = answer;
  privacyResult.textContent = circleShareLabel(privacy);
  privateState.hidden = true;
  revealedState.hidden = false;
}

function renderMode(mode) {
  activeMode = mode;
  const content = dailyModes[mode];
  const saved = getSaved(mode);
  dailyDate.textContent = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  questionColumn.classList.toggle("mode-fun", mode === "fun");
  questionColumn.classList.toggle("mode-reflective", mode === "reflective");

  dailyLabel.textContent = content.label;
  questionHeading.textContent = content.question;
  worldNote.textContent = content.note;
  answerLabel.textContent = content.answerLabel;
  answerInput.placeholder = content.placeholder;
  conversationPrompt.textContent = content.followUp;
  roomQuestion.textContent = content.question;
  circleFollowup.textContent = content.followUp;

  renderStreaks();

  if (saved.answer) showCompleted(saved.answer, saved.privacy);
  else showLockedState();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function makeMessage(message) {
  const item = document.createElement("article");
  item.className = `room-message${message.author === "You" ? " mine" : ""}`;
  const avatar = document.createElement("span");
  avatar.className = `face ${message.color}`;
  avatar.textContent = message.initial;
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  const author = document.createElement("strong");
  author.textContent = message.author;
  const time = document.createElement("time");
  time.textContent = message.time || "Now";
  const text = document.createElement("p");
  text.textContent = message.text;
  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.append(author, time);
  bubble.append(meta, text);
  item.append(avatar, bubble);
  return item;
}

function renderMessages() {
  document.querySelectorAll("[data-room-messages]").forEach((container) => {
    const circleId = container.dataset.roomMessages === "active" ? activeCircleId : container.dataset.roomMessages;
    const messages = circleMessages[circleId] || [];
    if (!messages.length) {
      const empty = document.createElement("p");
      empty.className = "empty-room";
      empty.textContent = "No replies yet. Answer today's question to start this room.";
      container.replaceChildren(empty);
    } else {
      container.replaceChildren(...messages.map(makeMessage));
    }
  });
}

async function postMessage(text, circleId) {
  if (!circleId) return;
  if (!circleMessages[circleId]) circleMessages[circleId] = [];
  circleMessages[circleId].push({ author: "You", initial: "You", color: "face-green", text, time: "Now" });
  localStorage.setItem("sidequest-circle-messages-v2", JSON.stringify(circleMessages));
  renderMessages();
  showToast(`Message sent to ${roomName.textContent}`);
  if (window.sidequestBackend?.enabled) {
    try {
      await window.sidequestBackend.sendMessage(text);
    } catch (error) {
      console.error("Supabase message failed", error);
      showToast("Saved here, but the shared message did not send");
    }
  }
}

async function refreshSharedMessages() {
  if (!window.sidequestBackend?.enabled) return;
  const messages = await window.sidequestBackend.loadMessages();
  circleMessages[activeCircleId] = messages;
  renderMessages();
}

async function startBackend() {
  const localUsername = localStorage.getItem("sparkit-username")
    || `spark_${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}`;
  localStorage.setItem("sparkit-username", localUsername);
  profileUsername.value = localUsername;
  document.querySelector("#your-handle").textContent = `Your username: @${localUsername}`;
  if (!window.sidequestBackend?.enabled) {
    friendSetupNote.textContent = "Demo mode: friends added here stay on this device until Supabase is connected.";
    return;
  }
  try {
    const state = await window.sidequestBackend.init();
    profileUsername.value = state.username;
    document.querySelector("#your-handle").textContent = `Your username: @${state.username}`;
    const sharedFriends = await window.sidequestBackend.loadFriends();
    friendsGrid.replaceChildren();
    createCircleForm.querySelector(".friend-picker").replaceChildren(createCircleForm.querySelector(".friend-picker legend"));
    sharedFriends.forEach(addFriendRow);
    if (state.circleId) {
      activeCircleId = state.circleId;
      circleMessages[activeCircleId] ||= [];
      if (!circleList.querySelector(`[data-circle="${state.circleId}"]`)) {
        const item = makeCircleListItem({ id: state.circleId, name: state.circleName || "Your circle", members: [] });
        circleList.append(item);
        item.click();
      }
      await refreshSharedMessages();
      window.sidequestBackend.subscribeToMessages(() => refreshSharedMessages().catch(console.error));
    }
  } catch (error) {
    console.error("Supabase startup failed", error);
    showToast("Shared mode is unavailable. Continuing locally.");
  }
}

function makeCircleListItem(circle) {
  const button = document.createElement("button");
  button.className = "circle-list-item";
  button.type = "button";
  button.dataset.circle = circle.id;
  button.dataset.name = circle.name;
  const avatar = document.createElement("span");
  avatar.className = "circle-avatar coral";
  avatar.textContent = circle.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = circle.name;
  const status = document.createElement("small");
  status.textContent = `New circle · ${circle.members.length + 1} members`;
  copy.append(name, status);
  button.append(avatar, copy);
  return button;
}

function syncCircleState() {
  const hasCircles = circleList.children.length > 0;
  document.querySelector("#circle-empty").hidden = hasCircles;
  document.querySelector("#circle-room").hidden = !hasCircles || !activeCircleId;
  document.querySelector("#circle-shortcut").hidden = !hasCircles;
  document.querySelector("#today-circle-streak").hidden = !hasCircles;
  document.querySelector("#today-circle-status").hidden = !hasCircles;
  document.querySelector("#today-room").hidden = !hasCircles;
  const circlePrivacy = form.querySelector('input[value="friends"]');
  circlePrivacy.disabled = !hasCircles || answerInput.disabled;
  circlePrivacyTitle.textContent = circleShareLabel("friends");
  circlePrivacyHint.textContent = hasCircles
    ? "Mutual reveal with this friend group."
    : "Create a circle to unlock this.";
}

function addFriendRow(friend) {
  const cleanName = friend.username.replace(/^@/, "");
  if (friendsGrid.querySelector(`[data-username="${CSS.escape(cleanName)}"]`)) return;
  const row = document.createElement("article");
  row.className = "friend-row";
  row.dataset.username = cleanName;
  const avatar = document.createElement("span");
  avatar.className = "face face-green";
  avatar.textContent = cleanName.charAt(0).toUpperCase();
  const copy = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = friend.displayName || cleanName;
  const handle = document.createElement("small");
  handle.textContent = `@${cleanName}`;
  copy.append(name, handle);
  const status = document.createElement("span");
  status.className = "friend-status";
  const isIncoming = friend.status === "pending" && friend.incoming;
  status.textContent = friend.status === "accepted" ? "Friend" : (isIncoming ? "Wants to add you" : (friend.status || "Added"));
  const more = document.createElement("button");
  more.className = "more-button";
  more.type = "button";
  more.setAttribute("aria-label", `More options for ${cleanName}`);
  more.textContent = "•••";
  if (isIncoming && window.sidequestBackend?.enabled) {
    more.className = "friend-accept-button";
    more.setAttribute("aria-label", `Accept @${cleanName}`);
    more.textContent = "Accept";
    more.addEventListener("click", async () => {
      try {
        await window.sidequestBackend.acceptFriendRequest(friend.requestId);
        friend.status = "accepted";
        friend.incoming = false;
        row.remove();
        addFriendRow(friend);
        showToast(`You and @${cleanName} are now friends`);
      } catch (error) {
        console.error("Accept friend failed", error);
        showToast("Could not accept that request");
      }
    });
  }
  row.append(avatar, copy, status, more);
  friendsGrid.prepend(row);

  const picker = createCircleForm.querySelector(".friend-picker");
  if ((friend.status === "accepted" || !window.sidequestBackend?.enabled) && !picker.querySelector(`input[value="${CSS.escape(cleanName)}"]`)) {
    const option = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "members";
    checkbox.value = cleanName;
    const face = avatar.cloneNode(true);
    const optionCopy = document.createElement("span");
    const optionName = document.createElement("strong");
    optionName.textContent = friend.displayName || cleanName;
    const optionHandle = document.createElement("small");
    optionHandle.textContent = `@${cleanName}`;
    optionCopy.append(optionName, optionHandle);
    option.append(checkbox, face, optionCopy);
    picker.append(option);
  }
}

function badge(text, className) {
  const item = document.createElement("span");
  item.className = `history-badge ${className}`;
  item.textContent = text;
  return item;
}

function renderHistory(date) {
  const records = date === todayKey ? getTodayRecords() : (historyRecords[date] || []);
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const fragment = document.createDocumentFragment();
  const dateLabel = document.createElement("p");
  dateLabel.className = "eyebrow";
  dateLabel.textContent = formattedDate;
  fragment.append(dateLabel);

  if (!records.length) {
    const heading = document.createElement("h2");
    heading.textContent = date === todayKey ? "Nothing chosen yet today." : "A quiet day.";
    const message = document.createElement("p");
    message.className = "history-empty";
    message.textContent = date === "2026-09-19" ? "Choose either question to keep your streak going." : "You did not answer a sparKIT question on this date.";
    fragment.append(heading, message);
  } else {
    records.forEach((record, index) => {
      const entry = document.createElement("article");
      if (index > 0) entry.className = "history-entry-extra";
      const badges = document.createElement("div");
      badges.className = "history-badges";
      badges.append(
        badge(dailyModes[record.mode].shortLabel, record.mode),
        badge(circleShareLabel(record.privacy), privacyClasses[record.privacy]),
      );
      const question = document.createElement("h2");
      question.textContent = record.question;
      const answer = document.createElement("blockquote");
      answer.textContent = `“${record.answer}”`;
      const shared = document.createElement("p");
      shared.className = "history-shared";
      shared.textContent = record.shared;
      entry.append(badges, question, answer, shared);
      fragment.append(entry);
    });
  }

  historyDetail.replaceChildren(fragment);
  calendarDays.forEach((day) => day.classList.toggle("selected", day.dataset.date === date));
}

function updateTodayCalendar() {
  const today = document.querySelector(`[data-date="${todayKey}"]`);
  if (!today) return;
  const records = getTodayRecords();
  today.classList.remove("has-fun", "has-reflective", "has-both");
  if (records.length === 2) today.classList.add("has-both");
  else if (records[0]) today.classList.add(`has-${records[0].mode}`);
}

function updateHistoryCalendar() {
  calendarDays.forEach((day) => {
    const records = day.dataset.date === todayKey ? getTodayRecords() : (historyRecords[day.dataset.date] || []);
    day.classList.remove("has-fun", "has-reflective", "has-both");
    if (records.length > 1) day.classList.add("has-both");
    else if (records[0]) day.classList.add(`has-${records[0].mode}`);
  });
}

function renderRoute() {
  const route = ["#history", "#circles", "#friends"].includes(window.location.hash)
    ? window.location.hash
    : "#today";
  todaySections.forEach((section) => { section.hidden = route !== "#today"; });
  historyView.hidden = route !== "#history";
  circlesView.hidden = route !== "#circles";
  friendsView.hidden = route !== "#friends";
  routeLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === route);
  });
  if (route === "#history") {
    updateHistoryCalendar();
    renderHistory(document.querySelector(".calendar-day.selected")?.dataset.date || todayKey);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => renderMode(button.dataset.mode));
});

calendarDays.forEach((day) => {
  day.addEventListener("click", () => renderHistory(day.dataset.date));
});

document.querySelectorAll("[data-message-form]").forEach((messageForm) => {
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.elements.message;
    const text = input.value.trim();
    if (!text) return;
    const circleId = messageForm.dataset.messageForm === "active" ? activeCircleId : messageForm.dataset.messageForm;
    postMessage(text, circleId);
    input.value = "";
  });
});

circleList.addEventListener("click", (event) => {
  const item = event.target.closest(".circle-list-item");
  if (!item) return;
  activeCircleId = item.dataset.circle;
  circleList.querySelectorAll(".circle-list-item").forEach((button) => button.classList.toggle("active", button === item));
  roomName.textContent = item.dataset.name || item.querySelector("strong").textContent;
  document.querySelector("#circle-shortcut-name").textContent = roomName.textContent;
  document.querySelector("#circle-message").placeholder = `Message ${roomName.textContent}...`;
  renderMessages();
  syncCircleState();
});

document.querySelector("#circle-shortcut").addEventListener("click", () => {
  window.location.hash = "#circles";
});

document.querySelector("#new-circle-button").addEventListener("click", () => {
  document.querySelector("#circle-form-error").hidden = true;
  circleDialog.showModal();
});

document.querySelector("#empty-create-circle").addEventListener("click", () => {
  document.querySelector("#new-circle-button").click();
});

circlePrivacyLabel.addEventListener("click", (event) => {
  if (!circlePrivacyLabel.querySelector('input[name="privacy"]').disabled) return;
  event.preventDefault();
  window.location.hash = "#circles";
  document.querySelector("#new-circle-button").click();
});

document.querySelector("#close-circle-dialog").addEventListener("click", () => circleDialog.close());

viewCircleAnswers.addEventListener("click", () => {
  if (getSaved(activeMode).answer) {
    answerGate.hidden = true;
    window.location.hash = "#today";
    return;
  }
  answerGate.hidden = false;
  showToast("Submit your own answer first to unlock the circle");
  answerGate.scrollIntoView({ behavior: "smooth", block: "center" });
});

createCircleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = createCircleForm.elements.circleName.value.trim();
  const members = [...createCircleForm.querySelectorAll('input[name="members"]:checked')].map((input) => input.value);
  if (!name || !members.length) {
    document.querySelector("#circle-form-error").hidden = false;
    return;
  }
  let circle = { id: `circle-${Date.now()}`, name, members };
  if (window.sidequestBackend?.enabled) {
    try {
      const created = await window.sidequestBackend.createCircle(name);
      circle = { ...circle, id: created.id };
    } catch (error) {
      console.error("Supabase circle creation failed", error);
      showToast("Created on this device, but live sync is unavailable");
    }
  }
  circleMessages[circle.id] = [];
  localStorage.setItem("sidequest-circle-messages-v2", JSON.stringify(circleMessages));
  customCircles.push(circle);
  localStorage.setItem("sidequest-custom-circles", JSON.stringify(customCircles));
  const item = makeCircleListItem(circle);
  circleList.append(item);
  createCircleForm.reset();
  circleDialog.close();
  item.click();
  showToast(`${name} created`);
});

document.querySelector("#add-friend-button").addEventListener("click", () => {
  friendSearchForm.hidden = !friendSearchForm.hidden;
  if (!friendSearchForm.hidden) document.querySelector("#friend-username").focus();
});

friendSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = friendSearchForm.elements.username;
  const username = input.value.trim().replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    showToast("Use 3–24 letters, numbers, or underscores");
    return;
  }

  let friend = { username, displayName: username, status: "Added on this device" };
  if (window.sidequestBackend?.enabled) {
    try {
      const sharedFriend = await window.sidequestBackend.sendFriendRequest(username);
      friend = {
        username: sharedFriend.username,
        displayName: sharedFriend.display_name,
        status: sharedFriend.status === "accepted" ? "accepted" : "Request sent",
      };
    } catch (error) {
      console.error("Friend request failed", error);
      showToast(error.message?.includes("not found") ? "No sparKIT user has that username" : "Could not send that request");
      return;
    }
  }

  addFriendRow(friend);
  if (!addedFriends.some((item) => item.username === friend.username)) {
    addedFriends.push(friend);
    localStorage.setItem("sparkit-added-friends", JSON.stringify(addedFriends));
  }
  input.value = "";
  friendSearchForm.hidden = true;
  showToast(window.sidequestBackend?.enabled ? `Request sent to @${username}` : `@${username} added on this device`);
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = profileUsername.value.trim().replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    showToast("Use 3–24 letters, numbers, or underscores");
    return;
  }
  try {
    const savedUsername = window.sidequestBackend?.enabled
      ? await window.sidequestBackend.updateUsername(username)
      : username;
    localStorage.setItem("sparkit-username", savedUsername);
    profileUsername.value = savedUsername;
    document.querySelector("#your-handle").textContent = `Your username: @${savedUsername}`;
    showToast(`Username saved as @${savedUsername}`);
  } catch (error) {
    console.error("Username update failed", error);
    showToast(error.code === "23505" ? "That username is already taken" : "Could not save that username");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();
  if (!answer) return;
  const privacy = form.elements.privacy.value;
  localStorage.setItem(storageKey("answer"), answer);
  localStorage.setItem(storageKey("privacy"), privacy);
  saveTodayToHistory();
  showCompleted(answer, privacy);
  renderStreaks();
  updateTodayCalendar();
  document.querySelector("#reveal-panel").scrollIntoView({ behavior: "smooth" });
  showToast(privacy === "private" ? "Saved just for you. Your streak is safe." : "Shared. Your streak is safe.");
  if (window.sidequestBackend?.enabled) {
    try {
      await window.sidequestBackend.saveAnswer(activeMode, answer, privacy);
    } catch (error) {
      console.error("Supabase answer failed", error);
      showToast("Saved here, but the shared answer did not sync");
    }
  }
});

window.addEventListener("hashchange", renderRoute);

renderMode(activeMode);
updateTodayCalendar();
updateHistoryCalendar();
customCircles.forEach((circle) => circleList.append(makeCircleListItem(circle)));
addedFriends.forEach(addFriendRow);
if (circleList.firstElementChild) circleList.firstElementChild.click();
syncCircleState();
renderMessages();
renderRoute();
startBackend();
