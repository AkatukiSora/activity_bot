import { logger } from "@/initializer/log";
import { Client, ChannelType, Message } from "discord.js";

/**
 * 指定チャンネル指定IDのメッセージを取得します。
 * @param client Discordのクライアント
 * @param channelId 取得したいメッセージのチャンネルID
 * @param messageId 取得したいメッセージのID
 * @returns DiscordのMessageオブジェクト
 * @throws チャンネルが見つからない場合
 */
const getToReplyMessage = async (
  client: Client,
  channelId: string,
  messageId: string,
): Promise<Message> => {
  const toReplyChannel = await client.channels.fetch(channelId);
  if (!toReplyChannel) {
    const error = new Error(
      `チャンネルが見つかりませんでした。 channelId: ${channelId}`,
    );
    logger.error(error);
    throw error;
  }
  if (!(toReplyChannel.type === ChannelType.GuildText)) {
    const error = new Error(
      `テキストチャンネルではありません。 channelId: ${channelId}`,
    );
    logger.error(error);
    throw error;
  }

  // toReplyMessageは、返信先のメッセージを取得します。
  const toReplyMessage = await toReplyChannel.messages.fetch(messageId);
  return toReplyMessage;
};

export default getToReplyMessage;
