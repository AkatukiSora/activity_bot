import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { GuildID, UserID } from "@/config/tsTypes";
import getData from "@/db/getData";

const mataData = new SlashCommandBuilder();
mataData.setName("score").setDescription("スコア関連のコマンド");

mataData.addSubcommand((subcommand) =>
  subcommand
    .setName("get")
    .setDescription("スコアを取得します")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("スコアを取得するユーザー")
        .setRequired(false),
    ),
);

mataData.addSubcommand((subcommand) =>
  subcommand
    .setName("public_access")
    .setDescription("スコアの公開設定を変更します")
    .addBooleanOption((option) =>
      option
        .setName("public")
        .setDescription("スコアを公開するかどうか")
        .setRequired(true),
    ),
);

mataData.addSubcommand((subcommand) =>
  subcommand
    .setName("ranking_global_opt_out")
    .setDescription("すべてのサーバーランキングに参加しないようにします")
    .addBooleanOption((option) =>
      option
        .setName("opt_out")
        .setDescription("サーバーランキングに参加しないかどうか")
        .setRequired(true),
    ),
);

mataData.addSubcommand((subcommand) =>
  subcommand
    .setName("ranking_server_opt_out")
    .setDescription("このサーバーのランキングに参加しないようにします")
    .addBooleanOption((option) =>
      option
        .setName("opt_out")
        .setDescription("このサーバーのランキングに参加しないかどうか")
        .setRequired(true),
    ),
);

const getUserScore = async (
  userID: UserID,
  guildID: GuildID,
): Promise<number> => {
  const result = await getData.getUserScore(userID, guildID);
  return result;
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) return;
  switch (interaction.options.getSubcommand()) {
    case "get": {
      const targetUser =
        interaction.options.getUser("user") ?? interaction.user;
      const Score = await getUserScore(targetUser.id, interaction.guildId);
      const replyMessage = new EmbedBuilder();
      replyMessage.setTitle(`${targetUser.displayName} さんのスコア`);
      replyMessage.setDescription(`スコア: ${Score.toFixed(0)}`);
      interaction.reply({ embeds: [replyMessage.toJSON()] });
    }
  }
};

const exportData = {
  data: mataData.toJSON(),
  execute,
};

export default exportData;
