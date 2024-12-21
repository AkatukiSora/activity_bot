import pool from "@/initializer/db";
import { logger } from "@/initializer/log";
import { ActionTypes, AdjustmentTypes } from "@/config/dbTypes";
import { GuildID, UserID } from "@/config/tsTypes";

class insertData {
  constructor() {}

  static async insertUserOptOut(userID: UserID) {
    const db = await pool.getConnection();

    try {
      await db.beginTransaction();
      await db.query(
        `INSERT INTO user_opt_out (user_id)
        SELECT ?
        FROM DUAL
        WHERE NOT EXISTS (
          SELECT 1 FROM user_opt_out WHERE user_id = ?
        );
        `,
        [userID, userID],
      );
      await db.commit();
    } catch (err) {
      logger.error("userOptOutの挿入に失敗しました。", err);
      db.rollback();
    } finally {
      db.release();
    }
  }

  static async insertActivityLog(
    userID: UserID,
    guildID: GuildID,
    actionType: ActionTypes,
  ): Promise<number> {
    const db = await pool.getConnection();
    try {
      await db.beginTransaction();
      const result: unknown = await db.query(
        "INSERT INTO activity_log (user_id, server_id, action_type_id) VALUES (?, ?, (SELECT action_type_id FROM action_types WHERE name = ? LIMIT 1))",
        [userID, guildID, actionType],
      );
      if (
        !result ||
        !(typeof result === "object") ||
        !("insertId" in result) ||
        !(typeof result.insertId === "bigint")
      ) {
        logger.debug(result);
        throw new Error("Insertの返り値が異常です");
      }
      await db.commit();
      return Number(result.insertId);
    } catch (err) {
      logger.error("activityLogの挿入に失敗しました。", err);
      db.rollback();
      throw err;
    } finally {
      db.release();
    }
  }

  static async insertActivityAdjustments(
    logID: number | string,
    adjustmentType: AdjustmentTypes[],
  ) {
    const db = await pool.getConnection();
    try {
      await db.beginTransaction();
      const inserValues = adjustmentType.map((type) => [logID, type]);
      for (const value of inserValues) {
        db.batch(
          "INSERT INTO activity_log_adjustments (log_id, adjustment_type_id) VALUES (?, (SELECT adjustment_type_id FROM adjustment_types WHERE name = ?))",
          value,
        );
      }
      await db.commit();
    } catch (err) {
      logger.error("activity_adjustmentsの挿入に失敗しました。", err);
      db.rollback();
      throw err;
    } finally {
      db.release();
    }
  }
}

export default insertData;
