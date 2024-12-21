import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const mataData = new SlashCommandBuilder()
  .setName("time")
  .setDescription("現在の時刻を表示します");

const execute = async (interaction: ChatInputCommandInteraction) => {
  interaction.reply({
    embeds: [
      new EmbedBuilder({
        title: "Time",
        description: new Date().toLocaleString(),
      }),
    ],
  });
};

const exportData = {
  data: mataData.toJSON(),
  execute,
};

export default exportData;
