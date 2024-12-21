import { GuildID, UserID } from "@/config/tsTypes";
import pool from "@/initializer/db";
import { logger } from "@/initializer/log";

class getData {
  cosntructor() {}

  static isUserRegistered(userID: UserID): Promise<boolean> {
    return isUserRegistered(userID);
  }
  static getUserScore(userID: UserID, guildID: GuildID): Promise<number> {
    return getUserScore(userID, guildID);
  }
  static getAllScore(guildID: GuildID): Promise<number> {
    return getGuildScore(guildID);
  }
}

const isUserRegistered = async (userID: UserID) => {
  const db = await pool.getConnection();
  try {
    const result: unknown = await db.query(
      "SELECT EXISTS(SELECT user_id FROM user_opt_out WHERE user_id = ?) AS registered",
      [userID],
    );
    if (
      !result ||
      !(typeof result === "object") ||
      !("registered" in result) ||
      !(typeof result.registered === "number")
    ) {
      return false;
    }
    return result.registered === 1;
  } catch (err) {
    logger.error("userOptOutの取得に失敗しました。", `UserID: ${userID}`, err);
    throw err;
  } finally {
    db.release();
  }
};

const getGuildScore = async (guildID: GuildID) => {
  const db = await pool.getConnection();
  try {
    const result: unknown = await db.query(
      `
      SELECT
        al.server_id,
        al.user_id,
        SUM(
          at.base_points * COALESCE(adj_multiplier.multiplier_product, 1)
        ) AS total_points
      FROM activity_log al
      JOIN action_types at
      ON al.action_type_id = at.action_type_id 
      AND al.server_id = ?
      LEFT JOIN (
        SELECT
          ala.log_id,
          CASE
            WHEN SUM(CASE WHEN adj.multiplier = 0 THEN 1 ELSE 0 END) > 0 THEN 0
            ELSE POWER(-1, COUNT(CASE WHEN adj.multiplier < 0 THEN 1 END)) * EXP(SUM(LOG(ABS(adj.multiplier))))
          END AS multiplier_product
        FROM activity_log_adjustments ala
        JOIN adjustment_types adj ON ala.adjustment_type_id = adj.adjustment_type_id
        GROUP BY ala.log_id
      ) adj_multiplier ON al.log_id = adj_multiplier.log_id
      WHERE al.timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
      GROUP BY al.user_id, al.server_id;
      `,
      [guildID],
    );
    if (
      !result ||
      !(typeof result === "object") ||
      !Array.isArray(result) ||
      result.length === 0
    ) {
      return 0;
    }
    return result[0].total_points;
  } catch (err) {
    logger.error(
      "GuildScoreの取得に失敗しました。",
      `GuildID: ${guildID}`,
      err,
    );
    throw err;
  } finally {
    db.release();
  }
};
const getUserScore = async (userID: UserID, guildID: GuildID) => {
  const db = await pool.getConnection();
  try {
    const result: unknown = await db.query(
      `
      SELECT
        al.server_id,
        al.user_id,
        SUM(
          at.base_points * COALESCE(adj_multiplier.multiplier_product, 1)
        ) AS total_points
      FROM activity_log al
      JOIN action_types at
      ON al.action_type_id = at.action_type_id 
      AND al.server_id = ?
      AND al.user_id = ?
      LEFT JOIN (
        SELECT
          ala.log_id,
          CASE
            WHEN SUM(CASE WHEN adj.multiplier = 0 THEN 1 ELSE 0 END) > 0 THEN 0
            ELSE POWER(-1, COUNT(CASE WHEN adj.multiplier < 0 THEN 1 END)) * EXP(SUM(LOG(ABS(adj.multiplier))))
          END AS multiplier_product
        FROM activity_log_adjustments ala
        JOIN adjustment_types adj ON ala.adjustment_type_id = adj.adjustment_type_id
        GROUP BY ala.log_id
      ) adj_multiplier ON al.log_id = adj_multiplier.log_id
      WHERE al.timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
      GROUP BY al.user_id, al.server_id;
      `,
      [guildID, userID],
    );
    if (
      !result ||
      !(typeof result === "object") ||
      !Array.isArray(result) ||
      result.length === 0
    ) {
      logger.error(`返り値が異常です。`, result, new Error());
      return 0;
    }
    return result[0].total_points;
  } catch (err) {
    logger.error(
      "UserScoreの取得に失敗しました。",
      `UserID: ${userID}`,
      `GuildID: ${guildID}`,
      err,
    );
    throw err;
  } finally {
    db.release();
  }
};
export default getData;
