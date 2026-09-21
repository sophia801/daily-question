const form = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const answerLabel = document.querySelector("#answer-label");
const lockedState = document.querySelector("#locked-state");
const privateState = document.querySelector("#private-state");
const privateAnswerText = document.querySelector("#private-answer-text");
const sharePrivateAnswer = document.querySelector("#share-private-answer");
const revealedState = document.querySelector("#revealed-state");
const yourAnswer = document.querySelector("#your-answer");
const privacyInputs = document.querySelectorAll('input[name="privacy"]');
const privacyResult = document.querySelector("#privacy-result");
const circlePrivacyLabel = document.querySelector("#circle-privacy-label");
const circlePrivacyTitle = document.querySelector("#circle-privacy-title");
const circlePrivacyHint = document.querySelector("#circle-privacy-hint");
const answerCircleChoice = document.querySelector("#answer-circle-choice");
const answerCircleOptions = document.querySelector("#answer-circle-options");
const updateSharedCircles = document.querySelector("#update-shared-circles");
const sharedCircleLinks = document.querySelector("#shared-circle-links");
const refreshCircleAnswers = document.querySelector("#refresh-circle-answers");
const questionHeading = document.querySelector("#question-heading");
const dailyLabel = document.querySelector("#daily-label");
const dailyDate = document.querySelector("#daily-date");
const personalStreakCount = document.querySelector("#personal-streak-count");
const groupStreakMeter = document.querySelector("#group-streak-meter");
const circleStreakCopy = document.querySelector("#circle-streak-copy");
const circleStreakCount = document.querySelector("#circle-streak-count");
const circleStreakMeter = document.querySelector("#circle-streak-meter");
const circleStreakSafe = document.querySelector("#circle-streak-safe");
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
const submitView = document.querySelector("#submit-view");
const questionSubmissionForm = document.querySelector("#question-submission-form");
const circleDialog = document.querySelector("#circle-dialog");
const createCircleForm = document.querySelector("#create-circle-form");
const circleList = document.querySelector("#circle-list");
const roomName = document.querySelector("#circle-room-name");
const roomQuestion = document.querySelector("#circle-room-question");
const circleFollowup = document.querySelector("#circle-followup");
const circleModeButtons = document.querySelectorAll("[data-circle-mode]");
const friendSearchForm = document.querySelector("#friend-search-form");
const friendsGrid = document.querySelector("#friends-grid");
const viewCircleAnswers = document.querySelector("#view-circle-answers");
const answerGate = document.querySelector("#answer-gate");
const circleAnswersPanel = document.querySelector("#circle-answers-panel");
const circleAnswerList = document.querySelector("#circle-answer-list");
const closeCircleAnswers = document.querySelector("#close-circle-answers");
const circleAnswersHeading = document.querySelector("#circle-answers-heading");
const answerGateLink = document.querySelector("#answer-gate-link");
const profileForm = document.querySelector("#profile-form");
const profileUsername = document.querySelector("#profile-username");
const profilePhotoInput = document.querySelector("#profile-photo-input");
const profilePhotoAvatar = document.querySelector("#profile-photo-avatar");
const changePhotoButton = document.querySelector("#change-photo-button");
const removePhotoButton = document.querySelector("#remove-photo-button");
const yourFace = document.querySelector("#your-face");
const friendSetupNote = document.querySelector("#friend-setup-note");
const copyCircleInvite = document.querySelector("#copy-circle-invite");
const answerList = revealedState.querySelector(".answer-list");
const todayRoomMembers = document.querySelector("#today-room-members");

const privacyLabels = {
  private: "Just me",
};

const privacyClasses = {
  friends: "circle",
  private: "private",
};

function circleShareLabel(privacy) {
  if (privacy !== "friends") return privacyLabels[privacy];
  const circleIds = getSaved?.(activeMode).circleIds || (activeCircleId ? [activeCircleId] : []);
  const names = circleIds.map((id) => circleList.querySelector(`[data-circle="${CSS.escape(id)}"]`)?.dataset.name).filter(Boolean);
  if (!names.length) return "My circles";
  if (names.length === 1) return names[0];
  return `${names.length} circles`;
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
    label: "Fun",
    question: funToday.question,
    answerLabel: "Your answer",
    placeholder: "The more specific, the better...",
    followUp: funToday.followUp,
  },
  reflective: {
    shortLabel: "Reflective question",
    label: "Reflective",
    question: reflectiveToday.question,
    answerLabel: "Your reflection",
    placeholder: "A person, a habit, a place, a tiny moment...",
    followUp: reflectiveToday.followUp,
  },
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

let yourPhoto = localStorage.getItem("sparkit-pfp") || null;

function applyFace(el, fallbackText) {
  if (!el) return;
  if (yourPhoto) {
    el.replaceChildren(Object.assign(document.createElement("img"), { src: yourPhoto, alt: "" }));
  } else {
    el.textContent = fallbackText;
  }
}

function renderYourFaces() {
  applyFace(yourFace, "You");
  applyFace(profilePhotoAvatar, "You");
  document.querySelectorAll('[data-room-messages] .room-message.mine .face').forEach((el) => applyFace(el, "You"));
  removePhotoButton.hidden = !yourPhoto;
}

function setYourPhoto(dataUrl) {
  yourPhoto = dataUrl;
  if (dataUrl) localStorage.setItem("sparkit-pfp", dataUrl);
  else localStorage.removeItem("sparkit-pfp");
  renderYourFaces();
}

function readAndResizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read that image"));
      img.onload = () => {
        const size = 160;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(size / img.width, size / img.height);
        const dx = (size - img.width * scale) / 2;
        const dy = (size - img.height * scale) / 2;
        ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

let activeMode = "reflective";
let circleMode = "reflective";
let sharedBackendReady = false;
let circleStats = null;
let backendPersonalStreak = null;
let circleAnswersExpanded = false;

function storageKey(type, mode = activeMode) {
  return `sidequest-${type}-${todayKey}-${mode}`;
}

function getSaved(mode = activeMode) {
  let circleIds = [];
  try {
    circleIds = JSON.parse(localStorage.getItem(storageKey("circles", mode)) || "[]");
  } catch {
    circleIds = [];
  }
  const legacyCircleId = localStorage.getItem(storageKey("circle", mode));
  if (!circleIds.length && legacyCircleId) circleIds = [legacyCircleId];
  return {
    answer: localStorage.getItem(storageKey("answer", mode)),
    privacy: localStorage.getItem(storageKey("privacy", mode)) || "private",
    circleIds,
  };
}

function getSelectedCircleIds() {
  return [...answerCircleOptions.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
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

function renderStreaks() {
  let streak = 0;
  const cursor = new Date(`${todayKey}T12:00:00`);
  let checkingToday = true;
  while (true) {
    const key = [cursor.getFullYear(), String(cursor.getMonth() + 1).padStart(2, "0"), String(cursor.getDate()).padStart(2, "0")].join("-");
    const records = key === todayKey ? getTodayRecords() : (historyRecords[key] || []);
    if (!records.length && checkingToday) {
      checkingToday = false;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (!records.length) break;
    streak += 1;
    checkingToday = false;
    cursor.setDate(cursor.getDate() - 1);
  }

  const displayedStreak = backendPersonalStreak ?? streak;
  personalStreakCount.textContent = `${displayedStreak} ${displayedStreak === 1 ? "day" : "days"}`;
  renderCircleStats();
}

async function refreshPersonalStreak() {
  if (!sharedBackendReady || !window.sidequestBackend?.loadPersonalStreak) return;
  backendPersonalStreak = await window.sidequestBackend.loadPersonalStreak();
  renderStreaks();
}

function renderCircleStats() {
  if (!circleStats || !activeCircleId) {
    groupStreakMeter.style.width = "0%";
    circleStreakCopy.textContent = "Answers from either daily question count toward the group goal.";
    circleStreakCount.textContent = "Waiting for answers";
    circleStreakMeter.style.width = "0%";
    circleStreakSafe.hidden = true;
    todayRoomMembers.textContent = "Circle";
    return;
  }

  const { answeredCount, memberCount } = circleStats;
  const threshold = Math.ceil(memberCount * 0.5);
  const streakSecured = answeredCount >= threshold;
  const percent = memberCount ? Math.min(100, (answeredCount / memberCount) * 100) : 0;
  groupStreakMeter.style.width = `${percent}%`;
  circleStreakCopy.textContent = streakSecured
    ? "Half the circle answered, so today's streak is safe. Either question counts."
    : `${Math.max(0, threshold - answeredCount)} more needed to reach 50% today.`;
  circleStreakCount.textContent = `${answeredCount} / ${memberCount} · ${threshold} needed`;
  circleStreakMeter.style.width = `${percent}%`;
  circleStreakSafe.hidden = !streakSecured;
  todayRoomMembers.textContent = `${memberCount} ${memberCount === 1 ? "member" : "members"}`;
}

async function refreshCircleStats() {
  if (!sharedBackendReady || !activeCircleId) {
    circleStats = null;
    renderCircleStats();
    return;
  }
  circleStats = await window.sidequestBackend.loadCircleStats(todayKey);
  renderCircleStats();
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
  form.querySelector('button[type="submit"]').innerHTML = 'Lock in answer <span aria-hidden="true">→</span>';
  privacyInputs.forEach((input) => { input.checked = input.value === (activeCircleId ? "friends" : "private"); });
  setFormLocked(false);
  lockedState.hidden = false;
  privateState.hidden = true;
  revealedState.hidden = true;
  updateSharedCircles.hidden = true;
}

function showCompleted(answer, privacy) {
  answerInput.value = answer;
  form.querySelector('button[type="submit"]').textContent = "Completed today";
  privacyInputs.forEach((input) => { input.checked = input.value === privacy; });
  setFormLocked(true);
  lockedState.hidden = true;
  updateSharedCircles.hidden = true;
  sharedCircleLinks.replaceChildren();

  if (privacy === "private") {
    privateAnswerText.textContent = answer;
    privateState.hidden = false;
    revealedState.hidden = true;
    return;
  }

  yourAnswer.textContent = answer;
  privacyResult.textContent = circleShareLabel(privacy);
  updateSharedCircles.hidden = false;
  renderSharedCircleLinks();
  privateState.hidden = true;
  revealedState.hidden = false;
  refreshSharedAnswers().catch((error) => console.error("Shared answers failed", error));
}

async function refreshSharedAnswers() {
  const saved = getSaved(activeMode);
  answerList.querySelectorAll(".friend-answer:not(.yours)").forEach((item) => item.remove());
  if (!sharedBackendReady || !activeCircleId || saved.privacy !== "friends") return [];
  if (saved.circleIds.length && !saved.circleIds.includes(activeCircleId)) return [];
  const answers = await window.sidequestBackend.loadCircleAnswers(activeMode, todayKey);
  answers.filter((answer) => !answer.mine).forEach((answer, index) => {
    if (answerList.querySelector(`[data-answer-id="${CSS.escape(answer.id)}"]`)) return;
    const item = document.createElement("article");
    item.className = "friend-answer";
    item.dataset.answerId = answer.id;
    const avatar = document.createElement("span");
    avatar.className = `face ${["face-yellow", "face-blue", "face-pink"][index % 3]}`;
    avatar.textContent = answer.name.charAt(0).toUpperCase();
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = answer.name;
    const body = document.createElement("p");
    body.textContent = answer.body;
    copy.append(name, body);
    item.append(avatar, copy);
    answerList.append(item);
  });
  return answers;
}

async function refreshCircleRoomAnswers() {
  const saved = getSaved(circleMode);
  circleAnswerList.replaceChildren();
  if (!sharedBackendReady || !activeCircleId || saved.privacy !== "friends") return [];
  if (saved.circleIds.length && !saved.circleIds.includes(activeCircleId)) return [];
  const answers = await window.sidequestBackend.loadCircleAnswers(circleMode, todayKey);
  renderCircleAnswers(answers);
  return answers;
}

function renderCircleAnswers(answers) {
  if (!answers.length) {
    const empty = document.createElement("p");
    empty.className = "circle-answer-empty";
    empty.textContent = "No one else has shared an answer here yet.";
    circleAnswerList.replaceChildren(empty);
    return;
  }
  circleAnswerList.replaceChildren(...answers.map((answer, index) => {
    const item = document.createElement("article");
    item.className = `friend-answer${answer.mine ? " yours" : ""}`;
    const avatar = document.createElement("span");
    avatar.className = `face ${answer.mine ? "face-green" : ["face-yellow", "face-blue", "face-pink"][index % 3]}`;
    if (answer.mine) applyFace(avatar, "You");
    else avatar.textContent = answer.name.charAt(0).toUpperCase();
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = answer.mine ? "You" : answer.name;
    const body = document.createElement("p");
    body.textContent = answer.body;
    copy.append(name, body);
    item.append(avatar, copy);
    return item;
  }));
}

async function syncSavedAnswers() {
  if (!sharedBackendReady) return;
  for (const mode of ["reflective", "fun"]) {
    const saved = getSaved(mode);
    if (!saved.answer || (saved.privacy === "friends" && !saved.circleIds.length)) continue;
    await window.sidequestBackend.saveAnswer(
      mode,
      saved.answer,
      saved.privacy,
      dailyModes[mode].question,
      dailyModes[mode].followUp,
      todayKey,
      saved.circleIds,
    );
  }
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
  answerLabel.textContent = content.answerLabel;
  answerInput.placeholder = content.placeholder;
  conversationPrompt.textContent = content.followUp;
  renderStreaks();

  if (saved.answer) showCompleted(saved.answer, saved.privacy);
  else showLockedState();
  syncCirclePicker();
}

function renderCircleMode(mode) {
  circleMode = mode;
  const content = dailyModes[mode];
  roomQuestion.textContent = content.question;
  circleFollowup.textContent = content.followUp;
  circleModeButtons.forEach((button) => {
    const selected = button.dataset.circleMode === mode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

async function shareDailyResult() {
  const modeName = activeMode === "reflective" ? "reflective" : "fun";
  const shareUrl = `${window.location.origin}${window.location.pathname}#today`;
  const message = [
    `I answered today's ${modeName} sparKIT. What would you say?`,
    `“${dailyModes[activeMode].question}”`,
    "Your turn:",
  ].join("\n");

  if (navigator.share) {
    try {
      await navigator.share({ title: "sparKIT daily question", text: message, url: shareUrl });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  const clipboardMessage = `${message}\n${shareUrl}`;
  try {
    await navigator.clipboard.writeText(clipboardMessage);
    showToast("Result copied. Paste it into your group chat.");
  } catch {
    window.prompt("Copy your sparKIT result", clipboardMessage);
  }
}

function makeMessage(message) {
  const item = document.createElement("article");
  item.className = `room-message${message.author === "You" ? " mine" : ""}`;
  const avatar = document.createElement("span");
  avatar.className = `face ${message.color}`;
  if (message.author === "You") applyFace(avatar, message.initial);
  else avatar.textContent = message.initial;
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
    sharedBackendReady = true;
    try {
      const [reflectiveCommunity, funCommunity] = await Promise.all([
        window.sidequestBackend.loadCommunityQuestion("reflective", todayKey, reflectiveQuestions.length),
        window.sidequestBackend.loadCommunityQuestion("fun", todayKey, funQuestions.length),
      ]);
      if (reflectiveCommunity) {
        dailyModes.reflective.question = reflectiveCommunity.body;
        dailyModes.reflective.followUp = reflectiveCommunity.follow_up || "What makes you say that?";
      }
      if (funCommunity) {
        dailyModes.fun.question = funCommunity.body;
        dailyModes.fun.followUp = funCommunity.follow_up || "Defend your answer to the group.";
      }
      renderMode(activeMode);
      renderCircleMode(circleMode);
    } catch (error) {
      console.error("Community question load failed", error);
    }
    friendSearchForm.elements.username.disabled = false;
    friendSearchForm.querySelector('button[type="submit"]').disabled = false;
    friendSearchForm.elements.username.required = true;
    if (friendSetupNote) friendSetupNote.textContent = "Search for the exact sparKIT username. They can accept from their Friends page.";
    profileUsername.value = state.username;
    document.querySelector("#your-handle").textContent = `Your username: @${state.username}`;
    const sharedFriends = await window.sidequestBackend.loadFriends();
    friendsGrid.replaceChildren();
    createCircleForm.querySelector(".friend-picker").replaceChildren(createCircleForm.querySelector(".friend-picker legend"));
    sharedFriends.forEach(addFriendRow);
    state.circles.forEach((sharedCircle) => {
      if (circleList.querySelector(`[data-circle="${sharedCircle.id}"]`)) return;
      circleList.append(makeCircleListItem({
        id: sharedCircle.id,
        name: sharedCircle.name,
        members: [],
        inviteCode: sharedCircle.invite_code,
        shared: true,
      }));
    });
    if (state.circleId) {
      activeCircleId = state.circleId;
      circleMessages[activeCircleId] ||= [];
      if (!circleList.querySelector(`[data-circle="${state.circleId}"]`)) {
        const item = makeCircleListItem({ id: state.circleId, name: state.circleName || "Your circle", members: [], inviteCode: state.inviteCode, shared: true });
        circleList.append(item);
      }
      circleList.querySelector(`[data-circle="${state.circleId}"]`)?.click();
      await refreshSharedMessages();
      await refreshSharedAnswers();
      await refreshCircleStats();
      window.sidequestBackend.subscribeToMessages(() => refreshSharedMessages().catch(console.error));
    }
    try {
      await syncSavedAnswers();
      await refreshPersonalStreak();
    } catch (error) {
      console.error("Saved answer sync failed", error);
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
  button.dataset.inviteCode = circle.inviteCode || "";
  button.dataset.shared = circle.shared ? "true" : "false";
  const avatar = document.createElement("span");
  avatar.className = "circle-avatar coral";
  avatar.textContent = circle.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const copy = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = circle.name;
  const status = document.createElement("small");
  status.textContent = circle.shared && !circle.members.length
    ? "Shared circle"
    : `${circle.members.length + 1} members`;
  copy.append(name, status);
  button.append(avatar, copy);
  return button;
}

function syncCircleState() {
  const hasCircles = circleList.children.length > 0;
  document.querySelector("#circle-empty").hidden = hasCircles;
  document.querySelector("#circle-room").hidden = !hasCircles || !activeCircleId;
  document.querySelector("#today-circle-streak").hidden = !hasCircles;
  document.querySelector("#today-room").hidden = !hasCircles;
  const circlePrivacy = form.querySelector('input[value="friends"]');
  circlePrivacy.disabled = !hasCircles || answerInput.disabled;
  circlePrivacyTitle.textContent = circleShareLabel("friends");
  circlePrivacyHint.textContent = hasCircles
    ? "Choose one or more circles below."
    : "Create a circle to unlock this.";
  syncCirclePicker();
  if (getSaved(activeMode).privacy === "friends") renderSharedCircleLinks();
}

function syncCirclePicker() {
  const circles = [...circleList.querySelectorAll(".circle-list-item")];
  const saved = getSaved(activeMode);
  const selected = new Set(saved.answer ? saved.circleIds : getSelectedCircleIds());
  if (!saved.answer && !selected.size && activeCircleId) selected.add(activeCircleId);
  answerCircleOptions.replaceChildren(...circles.map((circle) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "sharedCircles";
    input.value = circle.dataset.circle;
    input.checked = selected.has(circle.dataset.circle);
    const name = document.createElement("span");
    name.textContent = circle.dataset.name || circle.querySelector("strong").textContent;
    label.append(input, name);
    return label;
  }));
  answerCircleChoice.hidden = circles.length === 0 || !form.elements.privacy.value || form.elements.privacy.value !== "friends";
  updateSharedCircles.hidden = !saved.answer || saved.privacy !== "friends";
}

function renderSharedCircleLinks() {
  const saved = getSaved(activeMode);
  sharedCircleLinks.replaceChildren(...saved.circleIds.map((circleId) => {
    const circle = circleList.querySelector(`[data-circle="${CSS.escape(circleId)}"]`);
    if (!circle) return null;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shared-circle-link";
    button.textContent = `Open ${circle.dataset.name} chat →`;
    button.addEventListener("click", async () => {
      circleAnswersExpanded = true;
      renderCircleMode(activeMode);
      await selectCircleItem(circle);
      window.location.hash = "#circles";
      window.setTimeout(() => document.querySelector(".circle-conversation")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    });
    return button;
  }).filter(Boolean));
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
  const route = ["#history", "#circles", "#friends", "#submit"].includes(window.location.hash)
    ? window.location.hash
    : "#today";
  todaySections.forEach((section) => { section.hidden = route !== "#today"; });
  historyView.hidden = route !== "#history";
  circlesView.hidden = route !== "#circles";
  friendsView.hidden = route !== "#friends";
  submitView.hidden = route !== "#submit";
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

document.querySelectorAll("[data-share-result]").forEach((button) => {
  button.addEventListener("click", shareDailyResult);
});

circleModeButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    renderCircleMode(button.dataset.circleMode);
    const canViewAnswers = canViewActiveCircleAnswers();
    circleAnswersPanel.hidden = !circleAnswersExpanded || !canViewAnswers;
    answerGate.hidden = !circleAnswersExpanded || canViewAnswers;
    viewCircleAnswers.textContent = circleAnswersExpanded && canViewAnswers ? "Hide answers" : "View answers";
    if (circleAnswersExpanded && canViewAnswers) await refreshCircleRoomAnswers();
  });
});

privacyInputs.forEach((input) => {
  input.addEventListener("change", syncCirclePicker);
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

async function selectCircleItem(item) {
  activeCircleId = item.dataset.circle;
  circleList.querySelectorAll(".circle-list-item").forEach((button) => button.classList.toggle("active", button === item));
  roomName.textContent = item.dataset.name || item.querySelector("strong").textContent;
  document.querySelector("#circle-message").placeholder = `Message ${roomName.textContent}...`;
  copyCircleInvite.hidden = !item.dataset.inviteCode;
  copyCircleInvite.dataset.inviteCode = item.dataset.inviteCode;
  if (item.dataset.shared === "true" && window.sidequestBackend?.enabled) {
    try {
      await window.sidequestBackend.selectCircle(activeCircleId);
      await refreshSharedMessages();
      await refreshSharedAnswers();
      if (circleAnswersExpanded && canViewActiveCircleAnswers()) await refreshCircleRoomAnswers();
      await refreshCircleStats();
      window.sidequestBackend.subscribeToMessages(() => refreshSharedMessages().catch(console.error));
    } catch (error) {
      console.error("Circle selection failed", error);
      renderMessages();
    }
  } else {
    renderMessages();
  }
  const canViewAnswers = canViewActiveCircleAnswers();
  circleAnswersPanel.hidden = !circleAnswersExpanded || !canViewAnswers;
  answerGate.hidden = !circleAnswersExpanded || canViewAnswers;
  viewCircleAnswers.textContent = circleAnswersExpanded && canViewAnswers ? "Hide answers" : "View answers";
  circleAnswersHeading.textContent = `Answers in ${roomName.textContent}`;
  syncCircleState();
}

circleList.addEventListener("click", async (event) => {
  const item = event.target.closest(".circle-list-item");
  if (!item) return;
  await selectCircleItem(item);
});

copyCircleInvite.addEventListener("click", async () => {
  const code = copyCircleInvite.dataset.inviteCode;
  if (!code) return;
  const inviteUrl = `${window.location.origin}${window.location.pathname}?circle=${encodeURIComponent(code)}#circles`;
  try {
    await navigator.clipboard.writeText(inviteUrl);
    showToast("Circle invite link copied");
  } catch {
    window.prompt("Copy this circle invite link", inviteUrl);
  }
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
  if (circleList.children.length) return;
  window.location.hash = "#circles";
  document.querySelector("#new-circle-button").click();
});

document.querySelector("#close-circle-dialog").addEventListener("click", () => circleDialog.close());

function canViewActiveCircleAnswers() {
  const saved = getSaved(circleMode);
  return Boolean(saved.answer && saved.privacy === "friends" && (!saved.circleIds.length || saved.circleIds.includes(activeCircleId)));
}

viewCircleAnswers.addEventListener("click", async () => {
  if (canViewActiveCircleAnswers()) {
    circleAnswersExpanded = !circleAnswersExpanded;
    answerGate.hidden = true;
    circleAnswersPanel.hidden = !circleAnswersExpanded;
    viewCircleAnswers.textContent = circleAnswersExpanded ? "Hide answers" : "View answers";
    if (circleAnswersExpanded) await refreshCircleRoomAnswers();
    return;
  }
  circleAnswersExpanded = true;
  circleAnswersPanel.hidden = true;
  answerGate.hidden = false;
  viewCircleAnswers.textContent = "View answers";
  const saved = getSaved(circleMode);
  showToast(saved.answer ? "Share today's answer with this circle to unlock its answers" : "Submit your own answer first to unlock the circle");
  answerGate.scrollIntoView({ behavior: "smooth", block: "center" });
});

closeCircleAnswers.addEventListener("click", () => {
  circleAnswersExpanded = false;
  circleAnswersPanel.hidden = true;
  viewCircleAnswers.textContent = "View answers";
});

answerGateLink.addEventListener("click", () => renderMode(circleMode));

refreshCircleAnswers.addEventListener("click", async () => {
  refreshCircleAnswers.disabled = true;
  try {
    await refreshSharedAnswers();
    showToast("Circle answers refreshed");
  } catch (error) {
    console.error("Shared answer refresh failed", error);
    showToast("Could not refresh answers right now");
  } finally {
    refreshCircleAnswers.disabled = false;
  }
});

sharePrivateAnswer.addEventListener("click", () => {
  if (!circleList.children.length) {
    window.location.hash = "#circles";
    document.querySelector("#new-circle-button").click();
    return;
  }
  form.querySelector('input[value="friends"]').checked = true;
  answerCircleChoice.hidden = false;
  syncCirclePicker();
  const preferredCircle = answerCircleOptions.querySelector(`input[value="${CSS.escape(activeCircleId)}"]`)
    || answerCircleOptions.querySelector('input[type="checkbox"]');
  if (preferredCircle) preferredCircle.checked = true;
  updateSharedCircles.hidden = false;
  updateSharedCircles.textContent = "Share with selected circles";
  answerCircleChoice.scrollIntoView({ behavior: "smooth", block: "center" });
});

updateSharedCircles.addEventListener("click", async () => {
  const circleIds = getSelectedCircleIds();
  if (!circleIds.length) {
    showToast("Choose at least one circle");
    return;
  }
  const saved = getSaved(activeMode);
  updateSharedCircles.disabled = true;
  try {
    if (window.sidequestBackend?.enabled) {
      await window.sidequestBackend.saveAnswer(
        activeMode,
        saved.answer,
        "friends",
        dailyModes[activeMode].question,
        dailyModes[activeMode].followUp,
        todayKey,
        circleIds,
      );
    }
    localStorage.setItem(storageKey("privacy"), "friends");
    localStorage.setItem(storageKey("circles"), JSON.stringify(circleIds));
    localStorage.setItem(storageKey("circle"), circleIds[0]);
    saveTodayToHistory();
    showCompleted(saved.answer, "friends");
    syncCirclePicker();
    updateSharedCircles.textContent = "Update shared circles";
    showToast(`Shared with ${circleIds.length} ${circleIds.length === 1 ? "circle" : "circles"}`);
  } catch (error) {
    console.error("Circle sharing update failed", error);
    showToast("Could not update shared circles");
  } finally {
    updateSharedCircles.disabled = false;
  }
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
      const created = await window.sidequestBackend.createCircle(name, members);
      circle = { ...circle, id: created.id, inviteCode: created.invite_code, shared: true };
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
  showToast(circle.inviteCode ? `${name} created. Copy its invite link to bring friends in.` : `${name} created`);
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

changePhotoButton.addEventListener("click", () => profilePhotoInput.click());
profilePhotoAvatar.addEventListener("click", () => profilePhotoInput.click());

profilePhotoInput.addEventListener("change", async () => {
  const file = profilePhotoInput.files[0];
  profilePhotoInput.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Choose an image file");
    return;
  }
  try {
    const dataUrl = await readAndResizeImage(file);
    setYourPhoto(dataUrl);
    showToast("Profile photo updated");
  } catch (error) {
    console.error("Photo update failed", error);
    showToast("Could not use that image");
  }
});

removePhotoButton.addEventListener("click", () => {
  setYourPhoto(null);
  showToast("Profile photo removed");
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

questionSubmissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = questionSubmissionForm.elements.question.value.trim();
  const followUp = questionSubmissionForm.elements.followUp.value.trim();
  const mode = questionSubmissionForm.elements.mode.value;
  if (question.length < 8) {
    showToast("Write a little more before submitting");
    return;
  }
  if (!window.sidequestBackend?.enabled || !sharedBackendReady) {
    showToast("Question submissions need shared mode");
    return;
  }
  const button = questionSubmissionForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await window.sidequestBackend.submitQuestion(mode, question, followUp);
    questionSubmissionForm.reset();
    showToast("Submitted for review. Thank you!");
  } catch (error) {
    console.error("Question submission failed", error);
    const setupNeeded = ["42P01", "PGRST202", "PGRST205"].includes(error.code);
    showToast(setupNeeded ? "Question submissions need Supabase migration 008" : "Could not submit that question");
  } finally {
    button.disabled = false;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();
  if (!answer) return;
  const privacy = form.elements.privacy.value;
  const circleIds = privacy === "friends" ? getSelectedCircleIds() : [];
  if (privacy === "friends" && !circleIds.length) {
    showToast("Choose at least one circle before sharing");
    return;
  }
  localStorage.setItem(storageKey("answer"), answer);
  localStorage.setItem(storageKey("privacy"), privacy);
  if (privacy === "friends") {
    localStorage.setItem(storageKey("circles"), JSON.stringify(circleIds));
    localStorage.setItem(storageKey("circle"), circleIds[0]);
  } else {
    localStorage.removeItem(storageKey("circles"));
    localStorage.removeItem(storageKey("circle"));
  }
  saveTodayToHistory();
  showCompleted(answer, privacy);
  renderStreaks();
  updateTodayCalendar();
  document.querySelector("#reveal-panel").scrollIntoView({ behavior: "smooth" });
  showToast(privacy === "private" ? "Saved just for you. Your streak is safe." : "Shared. Your streak is safe.");
  if (window.sidequestBackend?.enabled) {
    try {
      await window.sidequestBackend.saveAnswer(
        activeMode,
        answer,
        privacy,
        dailyModes[activeMode].question,
        dailyModes[activeMode].followUp,
        todayKey,
        circleIds,
      );
      await refreshSharedAnswers();
      await refreshCircleStats();
      await refreshPersonalStreak();
    } catch (error) {
      console.error("Supabase answer failed", error);
      showToast("Saved here, but the shared answer did not sync");
    }
  }
});

window.addEventListener("hashchange", renderRoute);

renderMode(activeMode);
renderCircleMode(circleMode);
updateTodayCalendar();
updateHistoryCalendar();
customCircles.forEach((circle) => circleList.append(makeCircleListItem(circle)));
addedFriends.forEach(addFriendRow);
if (circleList.firstElementChild) circleList.firstElementChild.click();
syncCircleState();
renderMessages();
renderYourFaces();
renderRoute();
startBackend();
