import { Client, GatewayIntentBits } from "discord.js";
import * as mariadb from "mariadb";

import dotenv from "dotenv";
dotenv.config();

//Discordのクライアントを作成
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  if (!client.user) return;

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }

  if (interaction.commandName === "time") {
    interaction.reply(new Date().toTimeString());
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  console.log(message.author.id);
});

client.login(process.env["TOKEN"]);
