# sparKIT Discord bot

The bot adds a `/sparkit` command to one Discord server. It posts today's
Reflective question, Fun question, or both, plus a button linking to sparKIT.
It can optionally post both questions to one channel every day.

## Discord setup

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create an application.
2. Open **Bot**, create the bot, and reset/copy its token.
3. Open **OAuth2 > URL Generator**. Select `bot` and `applications.commands`, then grant **View Channels**, **Send Messages**, and **Embed Links**.
4. Open the generated URL and add the bot to your server.
5. In Discord, enable Developer Mode under **User Settings > Advanced**. Right-click your server and choose **Copy Server ID**. For automatic posts, also copy the target channel ID.

## Run it

```bash
cd discord-bot
npm install
cp .env.example .env
```

Fill in `.env`:

- `DISCORD_TOKEN`: the private bot token. Never commit or share this.
- `DISCORD_CLIENT_ID`: the Application ID from **General Information**.
- `DISCORD_GUILD_ID`: the server ID.
- `DISCORD_CHANNEL_ID`: optional channel for automatic daily posts.
- `DAILY_POST_TIME`: optional 24-hour time, such as `09:00`.
- `TIME_ZONE`: timezone for the question date and automatic post.

Then start it:

```bash
npm start
```

The `/sparkit` command should appear in that server within a few seconds. The
bot must keep running for slash commands and automatic posts to work. Running
it on a laptop is fine for a demo; deploy this folder to an always-on Node host
for permanent use.
