import db from "@/initializer/db";
import { logger } from "@/initializer/log";
import { ActionTypes, AdjustmentTypes } from "@/config/dbTypes";

class getTypesID {
  constructor() {}
  static async getActionTypes(tartgetType: ActionTypes): Promise<number> {
    const conn = await db.getConnection();
    try {
      const result: unknown = await conn.query(
        "SELECT action_type_id FROM action_types WHERE name = ?",
        [tartgetType],
      );
      if (
        !result ||
        !(typeof result === "object") ||
        !("action_type_id" in result) ||
        !(typeof result.action_type_id === "number")
      )
        throw new Error(tartgetType + "の取得に失敗しました。");

      return result.action_type_id;
    } catch (err) {
      logger.error("actionTypesの取得に失敗しました。", err);
      throw err;
    } finally {
      conn.release();
    }
  }
  static async getAdjustmentTypes(
    tartgetType: AdjustmentTypes,
  ): Promise<number> {
    const conn = await db.getConnection();
    try {
      const result: unknown = await conn.query(
        "SELECT adjustment_type_id FROM adjustment_types WHERE name = ?",
        [tartgetType],
      );
      if (
        !result ||
        !(typeof result === "object") ||
        !("adjustment_type_id" in result) ||
        !(typeof result?.adjustment_type_id === "number")
      )
        throw new Error(tartgetType + "の取得に失敗しました。");

      return result.adjustment_type_id;
    } catch (err) {
      logger.error("adjustmentTypesの取得に失敗しました。", err);
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default getTypesID;
