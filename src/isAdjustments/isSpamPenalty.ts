import { AdjustmentResponseType } from "@/config/adjustmentActionTypes";
import { GuildID, UserID } from "@/config/tsTypes";
import Counter from "@/utils/counter";

const trueSpamPenaltyL1: AdjustmentResponseType = "spam_penalty_l1";
const trueSpamPenaltyL2: AdjustmentResponseType = "spam_penalty_l2";
const trueSpamPenaltyL3: AdjustmentResponseType = "spam_penalty_l3";

const counter = new Counter("SpamCounter", 3);

class isSpamPenalty {
  constructor() {}

  static async spamCounter(
    UserID: UserID,
    GuildID: GuildID,
  ): Promise<AdjustmentResponseType> {
    const key = `${GuildID}:${UserID}`;
    const count = await counter.incrementCount(key);
    if (count < 3) {
      return null;
    } else if (count < 5) {
      return trueSpamPenaltyL1;
    } else if (count < 10) {
      return trueSpamPenaltyL2;
    } else {
      return trueSpamPenaltyL3;
    }
  }
}

export default isSpamPenalty;
