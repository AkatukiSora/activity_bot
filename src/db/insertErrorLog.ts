import { GuildID, UserID } from "@/config/tsTypes";
import pool from "@/initializer/db";
import { logger } from "@/initializer/log";
import { ulid } from "ulidx";

class InsertErrorLog {
  constructor() {}

  static async insertErrorLog(
    level: "warn" | "error" | "critical" | "fatal",
    message: string,
    userId?: UserID,
    serverId?: GuildID,
  ) {
    const db = await pool.getConnection();
    const errorLogID = ulid().toLowerCase();

    try {
      await db.beginTransaction();
      await db.query(
        `INSERT INTO error_logs (error_id, level, message, user_id, server_id)
        VALUES (?, ?, ?, ?, ?)`,
        [errorLogID, level, message, userId, serverId],
      );
      await db.commit();
      return errorLogID;
    } catch (err) {
      logger.error(
        "errorLogの挿入に失敗しました。",
        err,
        `level: ${level}, message: ${message}, userId: ${userId}, serverId: ${serverId}`,
      );
      db.rollback();
      throw err;
    } finally {
      db.release();
    }
  }
}

export { InsertErrorLog as reportErrorLog };
