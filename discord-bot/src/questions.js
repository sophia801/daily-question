const reflectiveQuestions = [
  ["If you met yourself from five years ago, what would you tell them?", "What would your younger self be proud to see?"],
  ["Would you rather be good and misunderstood, or admired for someone you are not?", "How much should other people's perception matter?"],
  ["What is a regret that still teaches you something?", "Would you make the same choice with what you knew then?"],
  ["Would you rather be a jack of many trades or the master of one?", "Which path feels more like the life you want?"],
  ["What has been on your mind recently?", "Is there a way your friends could help carry it?"],
  ["Do you think you are a good person?", "What action makes you believe that most?"],
  ["What is your greatest strength?", "When did that strength last help someone else?"],
  ["In a room of 100 people, what could you do that nobody else could?", "How did you get unexpectedly good at it?"],
  ["What was the biggest turning point in your life?", "Did you recognize it as a turning point at the time?"],
  ["What do you see yourself doing during retirement?", "What part of that life could you begin now?"],
  ["Are you comfortable with who you are as a person?", "What part of yourself took the longest to accept?"],
  ["What quote best represents your view on life?", "Has that view changed over time?"],
  ["Who has had the biggest impact on who you are?", "What part of them do you carry with you?"],
  ["What would you do with one extra hour every day?", "What currently keeps you from making time for it?"],
  ["What are you most proud of becoming better at?", "Who noticed the change before you did?"],
  ["Why did you last cry?", "Did anything feel different afterward?"],
  ["Who has had the biggest impact on you in the past year?", "What did they change for you?"],
  ["How do you think AI will affect your life going forward?", "What part feels exciting, and what part worries you?"],
  ["What is an app you wish existed in your life?", "What is the one thing it would do perfectly?"],
  ["What book, show, or movie has impacted you the most?", "Did it change what you believe or how you behave?"],
  ["How have your parents or guardians shaped who you are today?", "What did you keep, and what did you choose differently?"],
  ["What is one thing you would change about yourself?", "What might you lose if it changed?"],
  ["What is something you changed about yourself that you wish you had not?", "Is there a part of it you could reclaim?"],
];

const funQuestions = [
  ["Would you rather be a beef cow or a dairy cow?", "Defend your choice like your life depends on it."],
  ["Would you rather be a human with strawberry thoughts or a strawberry with human thoughts?", "What is the strawberry thinking about?"],
  ["Would you rather visit 50 years in the past or 50 years in the future?", "What is the first thing you would investigate?"],
  ["What unpopular book, movie, or show did you secretly love?", "Give the group your best defense of it."],
  ["What is your most vivid very-early childhood memory?", "How sure are you that the memory is real?"],
  ["Which cat are you today?", "Describe the cat's pose, mood, and exact location."],
  ["A trolley is headed toward five strangers. Would you redirect it if it permanently deleted your camera roll?", "What changes if the camera roll belongs to someone else?"],
  ["What is your go-to midnight snack?", "What drink completes the combination?"],
  ["If you could wake up anywhere you have never been, where would it be?", "Who from this group are you bringing?"],
  ["What was your favorite plushie as a kid?", "What was its name and personality?"],
  ["Give up your favorite food for a month, or eat only that food for a month?", "How many days before you regret your choice?"],
  ["Would you rather learn a new language or master a new skill?", "Which language or skill are you choosing?"],
  ["What are you genuinely in the top 1% at?", "What would the competition look like?"],
  ["Would you rather sneeze glitter or hiccup bubbles?", "Which one becomes more annoying after a week?"],
  ["Who is winning the next Super Bowl?", "Give one completely serious reason and one ridiculous reason."],
];

function zonedDate(timeZone, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return {
    key: `${parts.year}-${parts.month}-${parts.day}`,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    time: `${parts.hour}:${parts.minute}`,
  };
}

function questionForDate(bank, mode, date) {
  const lastDay = new Date(Date.UTC(date.year, date.month, 0)).getUTCDate();
  if (mode === "reflective" && date.day === 1) return ["What are your goals for this month?", "Which one would feel most meaningful to finish?"];
  if (mode === "reflective" && date.day === lastDay) return ["What are you most proud of this month?", "What do you want to carry into next month?"];
  if (mode === "fun" && date.month === 12 && date.day >= 20 && date.day <= 25) return ["What is the best Christmas movie?", "Which movie is absolutely not a Christmas movie?"];
  const dayIndex = Math.floor(Date.UTC(date.year, date.month - 1, date.day) / 86400000);
  return bank[((dayIndex % bank.length) + bank.length) % bank.length];
}

export function questionsForToday(timeZone, now = new Date()) {
  const date = zonedDate(timeZone, now);
  const [reflective, reflectiveFollowUp] = questionForDate(reflectiveQuestions, "reflective", date);
  const [fun, funFollowUp] = questionForDate(funQuestions, "fun", date);
  return {
    date,
    reflective: { question: reflective, followUp: reflectiveFollowUp },
    fun: { question: fun, followUp: funFollowUp },
  };
}
