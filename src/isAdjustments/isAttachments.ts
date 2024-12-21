import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { AdjustmentTypes } from "@/config/dbTypes";

const isMedia = (contentType: string) => {
  if (
    contentType.startsWith("image") ||
    contentType.startsWith("video") ||
    contentType.startsWith("audio")
  ) {
    return true;
  } else {
    return false;
  }
};

const TrueAttachment: AdjustmentTypes = "attachment";
const TrueMedia: AdjustmentTypes = "media_attachment";

class isAttachment {
  constructor() {}
  static async isAttachment(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<AdjustmentTypes | null> {
    if (message.attachments.size > 0) {
      return TrueAttachment;
    }
    return null;
  }

  static async isMedias(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
  ): Promise<AdjustmentTypes | null> {
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first()?.contentType;
      if (!attachment) return null;
      if (isMedia(attachment)) {
        return TrueMedia;
      }
    }
    return null;
  }
}

export default isAttachment;
