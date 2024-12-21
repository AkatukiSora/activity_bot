import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

const mataData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("ping pong");

const pingEmbed = new EmbedBuilder({
  title: "Pong!",
  description: "Server is running!!!",
});

const execute = async (interaction: ChatInputCommandInteraction) => {
  interaction.reply({
    embeds: [pingEmbed],
  });
};

const exportData = {
  data: mataData.toJSON(),
  execute,
};

export default exportData;
