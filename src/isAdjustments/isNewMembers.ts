import { AdjustmentResponseType } from "@/config/adjustmentActionTypes";
import getToReplyMessage from "@/utils/getMessage";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

const trueToNewmember: AdjustmentResponseType = "to_new_member";
const trueFromNewmember: AdjustmentResponseType = "from_new_member";
const mouth = 60 * 60 * 24 * 30 * 1000;

const isNewMember = (joinTime: Date): boolean => {
  const nowDate = new Date();
  const diffData = nowDate.getTime() - joinTime.getTime();
  if (diffData < mouth) return true;
  return false;
};

class isNewMembers {
  constructor() {}

  static async fromNewMember(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<AdjustmentResponseType> {
    if (!message.member?.joinedAt) return null;
    if (isNewMember(message.member?.joinedAt)) {
      return trueFromNewmember;
    }
    return null;
  }

  static async toNewMember(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<AdjustmentResponseType> {
    if (!message.reference) return null;
    if (!message.reference.messageId) return null;
    if (!message.reference.channelId) return null;

    const client = message.client;

    const toMessage = await getToReplyMessage(
      client,
      message.channelId,
      message.reference.messageId,
    );

    if (!toMessage.member?.joinedAt) return null;
    if (isNewMember(toMessage.member.joinedAt)) {
      return trueToNewmember;
    }

    return null;
  }
}

export default isNewMembers;
