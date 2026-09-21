import { questionsForToday } from "./questions.js";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!webhookUrl) {
  console.error("Missing environment variable: DISCORD_WEBHOOK_URL");
  process.exit(1);
}

const timeZone = process.env.TIME_ZONE || "America/New_York";
const siteUrl = process.env.SPARKIT_URL || "https://sparkit.bidoophi.chatgpt.site/#today";
const questions = questionsForToday(timeZone);

const payload = {
  username: "sparKIT",
  content: "Today's sparKIT is here. Answer one, then bring the conversation back here.",
  embeds: [{
    title: "Today's sparKIT",
    url: siteUrl,
    color: 0xc73434,
    fields: [
      {
        name: "Reflective",
        value: `**${questions.reflective.question}**\n${questions.reflective.followUp}`,
      },
      {
        name: "Fun",
        value: `**${questions.fun.question}**\n${questions.fun.followUp}`,
      },
    ],
    footer: { text: questions.date.key },
  }],
  components: [{
    type: 1,
    components: [{
      type: 2,
      style: 5,
      label: "Answer on sparKIT",
      url: siteUrl,
    }],
  }],
  allowed_mentions: { parse: [] },
};

const response = await fetch(`${webhookUrl}?wait=true`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  console.error(`Discord returned ${response.status}: ${await response.text()}`);
  process.exit(1);
}

console.log(`Posted the daily sparKIT questions for ${questions.date.key}.`);
