import "dotenv/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { questionsForToday } from "./questions.js";

const required = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "DISCORD_GUILD_ID"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  channelId: process.env.DISCORD_CHANNEL_ID || "",
  postTime: process.env.DAILY_POST_TIME || "09:00",
  timeZone: process.env.TIME_ZONE || "America/New_York",
  siteUrl: process.env.SPARKIT_URL || "https://sparkit.bidoophi.chatgpt.site/#today",
};

const command = new SlashCommandBuilder()
  .setName("sparkit")
  .setDescription("Post today's sparKIT question")
  .addStringOption((option) => option
    .setName("type")
    .setDescription("Which daily question to post")
    .setRequired(false)
    .addChoices(
      { name: "Both", value: "both" },
      { name: "Reflective", value: "reflective" },
      { name: "Fun", value: "fun" },
    ));

function dailyPost(type = "both") {
  const questions = questionsForToday(config.timeZone);
  const embed = new EmbedBuilder()
    .setColor(0xc73434)
    .setTitle("Today's sparKIT")
    .setDescription("Answer one, then bring the conversation back here.")
    .setFooter({ text: questions.date.key });

  if (type === "both" || type === "reflective") {
    embed.addFields({ name: "Reflective", value: `**${questions.reflective.question}**\n${questions.reflective.followUp}` });
  }
  if (type === "both" || type === "fun") {
    embed.addFields({ name: "Fun", value: `**${questions.fun.question}**\n${questions.fun.followUp}` });
  }

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("Answer on sparKIT").setStyle(ButtonStyle.Link).setURL(config.siteUrl),
  );
  return { embeds: [embed], components: [buttons] };
}

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [command.toJSON()] });
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let lastAutomaticPost = null;

client.once("ready", async () => {
  console.log(`sparKIT bot signed in as ${client.user.tag}`);
  try {
    await registerCommand();
    console.log("Registered /sparkit for the configured server.");
  } catch (error) {
    console.error("Could not register /sparkit:", error);
  }

  if (!config.channelId) return;
  setInterval(async () => {
    const { date } = questionsForToday(config.timeZone);
    if (date.time !== config.postTime || lastAutomaticPost === date.key) return;
    try {
      const channel = await client.channels.fetch(config.channelId);
      if (!channel?.isTextBased()) throw new Error("Configured channel is not text-based");
      await channel.send(dailyPost("both"));
      lastAutomaticPost = date.key;
      console.log(`Posted the daily questions for ${date.key}.`);
    } catch (error) {
      console.error("Automatic post failed:", error);
    }
  }, 30_000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "sparkit") return;
  const type = interaction.options.getString("type") || "both";
  await interaction.reply(dailyPost(type));
});

client.login(config.token);
