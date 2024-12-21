import { ActionResponseType } from "@/config/adjustmentActionTypes";
import { ActionTypes, actionTypesData } from "@/config/dbTypes";

const isActionType = (value: ActionResponseType): value is ActionTypes => {
  if (!value) return false;
  return value in actionTypesData;
};

export default isActionType;
