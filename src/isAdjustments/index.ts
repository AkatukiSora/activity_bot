import { AdjustmentTypes } from "@/config/dbTypes";

import isAttachment from "./isAttachments";
import isNewMembers from "./isNewMembers";
import isReplys from "./isReplys";
import isSpamPenalty from "./isSpamPenalty";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { AdjustmentResponseType } from "@/config/adjustmentActionTypes";

import isAdjustmentType from "@/utils/isAdjustmentTypes";

const adjustmentType = async (
  message: OmitPartialGroupDMChannel<Message<boolean>>,
): Promise<AdjustmentTypes[] | null> => {
  if (message.author.bot) return null;
  if (!message.guild) return null;

  const nullableResult: AdjustmentResponseType[] = await Promise.all([
    isReplys.isReply(message),
    isReplys.isReplyToReply(message),
    isAttachment.isAttachment(message),
    isAttachment.isMedias(message),
    isNewMembers.fromNewMember(message),
    isNewMembers.toNewMember(message),
    isSpamPenalty.spamCounter(message.author.id, message.guild.id),
  ]);
  const result: AdjustmentTypes[] = nullableResult.filter((v) =>
    isAdjustmentType(v),
  );
  return result;
};

export default adjustmentType;
