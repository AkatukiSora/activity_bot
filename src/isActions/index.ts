import { ActionTypes } from "@/config/dbTypes";
import Message_send from "./message";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { ActionResponseType } from "@/config/adjustmentActionTypes";

import isActionType from "@/utils/isActionTypes";

const actionType = async (
  message: OmitPartialGroupDMChannel<Message<boolean>>,
): Promise<ActionTypes | null> => {
  if (message.author.bot) return null;
  if (!message.guild) return null;

  const nullableResult: ActionResponseType[] = await Promise.all([
    Message_send.sendMessage(message),
  ]);
  const firstResult = nullableResult.filter((v) => isActionType(v)).shift();

  if (!firstResult) return null;

  const result: ActionTypes = firstResult;
  return result;
};

export default actionType;
