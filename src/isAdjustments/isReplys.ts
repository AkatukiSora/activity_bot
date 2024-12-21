import { Message, OmitPartialGroupDMChannel } from "discord.js";
import getToReplyMessage from "@/utils/getMessage";
import { AdjustmentResponseType } from "@/config/adjustmentActionTypes";

const trueReply: AdjustmentResponseType = "reply";
const trueReplyToReply: AdjustmentResponseType = "reply_to_reply";

class isReplys {
  constructor() {}

  static async isReply(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<AdjustmentResponseType> {
    if (message.author.bot) return null;
    if (!message.reference?.messageId) return null;
    const client = message.client;

    const toReplyMessage = await getToReplyMessage(
      client,
      message.reference.channelId,
      message.reference.messageId,
    );

    if (!toReplyMessage) return null;
    if (toReplyMessage.author.bot) return null;
    if (toReplyMessage.author.id === message.author.id) return null;
    return trueReply;
  }

  static async isReplyToReply(
    message: Message,
  ): Promise<AdjustmentResponseType> {
    if (message.author.bot) return null;
    if (!message.reference?.messageId) return null;

    const client = message.client;

    //toReplyChannelは、返信先のチャンネルを取得します。
    const toReplyMessage = await getToReplyMessage(
      client,
      message.reference.channelId,
      message.reference.messageId,
    );
    if (!toReplyMessage) return null;
    if (toReplyMessage.author.bot) return null;

    //返信先のメッセージが自分ではないか確認
    if (toReplyMessage.author.id === message.author.id) return null;

    //返信先のメッセージが自分に返信しているか確認
    if (!toReplyMessage.reference?.messageId) return null;

    const toReplyToMessage = await getToReplyMessage(
      client,
      toReplyMessage.reference.channelId,
      toReplyMessage.reference.messageId,
    );
    if (!toReplyToMessage) return null;
    if (toReplyToMessage.author.bot) return null;

    if (toReplyToMessage.author.id === message.author.id) {
      return trueReplyToReply;
    }
    return null;
  }
}

export default isReplys;
