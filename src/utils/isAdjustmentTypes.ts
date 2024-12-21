import { AdjustmentResponseType } from "@/config/adjustmentActionTypes";
import { AdjustmentTypes, adjustmentTypesData } from "@/config/dbTypes";

const isAdjustmentType = (
  value: AdjustmentResponseType,
): value is AdjustmentTypes => {
  if (!value) return false;
  return value in adjustmentTypesData;
};

export default isAdjustmentType;
