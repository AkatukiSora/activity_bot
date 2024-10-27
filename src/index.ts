import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";

//Discordのクライアントを作成
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  if (!client.user) return;

  console.log(`Logged in as ${client.user.tag}!`);
});

import interactionCommands from "./interactions/index";

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    interaction.reply(
      await interactionCommands.execCommand(interaction.commandName),
    );
  } catch (e) {
    console.error(e);
    interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: "コマンド実行エラー",
          description: "コマンド実行時にエラーが発生しました",
        }),
      ],
    });
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  console.log(message.author.id);
});

client.login(process.env["TOKEN"]);
