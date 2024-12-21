import { ActionResponseType } from "@/config/adjustmentActionTypes";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

class Message_send {
  constructor() {}
  static async sendMessage(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<ActionResponseType> {
    if (message.author.bot) return null;
    return "send_message";
  }
}
export default Message_send;
