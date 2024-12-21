// @/config/dbTypes.ts

export const actionTypesData = {
  send_message: 10,
} as const;

export const adjustmentTypesData = {
  reply: 1.05,
  reply_to_reply: 1.1,
  attachment: 1.05,
  media_attachment: 1.1,
  to_new_member: 1.2,
  from_new_member: 1.3,
  spam_penalty_l1: 0.5,
  spam_penalty_l2: 0.2,
  spam_penalty_l3: 0,
  // 必要な補正タイプをここに追加
} as const;

type ActionTypes = keyof typeof actionTypesData;
type AdjustmentTypes = keyof typeof adjustmentTypesData;

export type { ActionTypes, AdjustmentTypes };
