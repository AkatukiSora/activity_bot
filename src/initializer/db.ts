// db.ts

import mariadb from "mariadb";
import { actionTypesData, adjustmentTypesData } from "@/config/dbTypes";
import { logger } from "@/initializer/log";

if (
  !process.env["DB_HOST"] ||
  !process.env["DB_USER"] ||
  !process.env["DB_PASS"] ||
  !process.env["DB_NAME"]
) {
  logger.fatal("データベース接続情報が環境変数に設定されていません。");
  throw new Error("データベース接続情報が環境変数に設定されていません。");
}

const pool = mariadb.createPool({
  host: process.env["DB_HOST"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASS"],
  database: process.env["DB_NAME"],
  connectionLimit: 10,
});

const initializeDatabase = async (): Promise<void> => {
  let conn;
  try {
    conn = await pool.getConnection();

    // トランザクションを開始
    await conn.beginTransaction();

    // テーブルを作成（存在しない場合）
    await createTables(conn);

    // テーブルにデータを挿入
    await insertActionTypes(conn, actionTypesData);
    await insertAdjustmentTypes(conn, adjustmentTypesData);

    // トランザクションをコミット
    await conn.commit();
  } catch (err) {
    if (conn) {
      // エラー時にトランザクションをロールバック
      await conn.rollback();
    }
    logger.fatal("データベースの初期化中にエラーが発生しました:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const createTables = async (conn: mariadb.Connection): Promise<void> => {
  // action_types テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS action_types (
      action_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE,
      base_points FLOAT NOT NULL
    )
  `);

  // adjustment_types テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS adjustment_types (
      adjustment_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE,
      multiplier DECIMAL(5,2) NOT NULL
    )
  `);

  // user_opt_out テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_opt_out (
      user_id BIGINT UNSIGNED PRIMARY KEY,
      global_opt_out BOOLEAN DEFAULT FALSE,
      deny_score_access BOOLEAN DEFAULT FALSE,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // user_server_opt_outs テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_server_opt_outs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      server_id BIGINT UNSIGNED NOT NULL,
      opt_out BOOLEAN DEFAULT FALSE,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_server (user_id, server_id),
      INDEX idx_user_id (user_id),
      INDEX idx_server_id (server_id),
      FOREIGN KEY (user_id) REFERENCES user_opt_out(user_id)
    )
  `);

  // activity_log テーブルを作成
  //DEFAULT CURRENT_TIMESTAMP
  await conn.query(`
    CREATE TABLE IF NOT EXISTS activity_log (
      log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      server_id BIGINT UNSIGNED NOT NULL,
      action_type_id INT UNSIGNED NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_server_id (server_id),
      INDEX idx_timestamp (timestamp),
      INDEX idx_user_server_timestamp (user_id, server_id, timestamp),
      FOREIGN KEY (user_id) REFERENCES user_opt_out(user_id),
      FOREIGN KEY (action_type_id) REFERENCES action_types(action_type_id)
    )
  `);

  // activity_log_adjustments テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS activity_log_adjustments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      log_id BIGINT UNSIGNED NOT NULL,
      adjustment_type_id INT UNSIGNED NOT NULL,
      UNIQUE KEY unique_log_adjustment (log_id, adjustment_type_id),
      INDEX idx_log_id (log_id),
      INDEX idx_adjustment_type_id (adjustment_type_id),
      FOREIGN KEY (log_id) REFERENCES activity_log(log_id),
      FOREIGN KEY (adjustment_type_id) REFERENCES adjustment_types(adjustment_type_id)
    )
  `);

  // user_points テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_points (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      server_id BIGINT UNSIGNED NOT NULL,
      period DATE NOT NULL,
      total_points FLOAT NOT NULL,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_server_period (user_id, server_id, period),
      INDEX idx_user_id (user_id),
      INDEX idx_server_period_points (server_id, period, total_points),
      FOREIGN KEY (user_id) REFERENCES user_opt_out(user_id)
    )
  `);

  // error_logs テーブルを作成
  await conn.query(`
    CREATE TABLE IF NOT EXISTS error_logs (
      error_id CHAR(26) PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      level VARCHAR(10) NOT NULL,
      message TEXT NOT NULL,
      user_id BIGINT UNSIGNED,
      server_id BIGINT UNSIGNED,
      INDEX idx_timestamp (timestamp),
      INDEX idx_level (level),
      INDEX idx_user_id (user_id),
      INDEX idx_server_id (server_id)
    )
  `);
};

const insertActionTypes = async (
  conn: mariadb.Connection,
  data: Record<string, number>,
): Promise<void> => {
  const existingNames = await getExistingNames(conn, "action_types");
  const newEntries = Object.entries(data).filter(
    ([name]) => !existingNames.includes(name),
  );

  if (newEntries.length > 0) {
    const insertValues = newEntries.map(([name, basePoints]) => [
      name,
      basePoints,
    ]);
    await conn.batch(
      `INSERT INTO action_types (name, base_points) VALUES (?, ?)`,
      insertValues,
    );
  }
};

const insertAdjustmentTypes = async (
  conn: mariadb.Connection,
  data: Record<string, number>,
): Promise<void> => {
  const existingNames = await getExistingNames(conn, "adjustment_types");
  const newEntries = Object.entries(data).filter(
    ([name]) => !existingNames.includes(name),
  );

  if (newEntries.length > 0) {
    const insertValues = newEntries.map(([name, multiplier]) => [
      name,
      multiplier,
    ]);
    await conn.batch(
      `INSERT INTO adjustment_types (name, multiplier) VALUES (?, ?)`,
      insertValues,
    );
  }
};

const getExistingNames = async (
  conn: mariadb.Connection,
  tableName: string,
): Promise<string[]> => {
  const rows = await conn.query(`SELECT name FROM ${tableName}`);
  return rows.map((row: { name: string }) => row.name);
};

// 初期化関数を即時実行
initializeDatabase()
  .then(() => {
    logger.info("データベースの初期化に成功しました。");
  })
  .catch((err) => {
    logger.fatal("データベースの初期化に失敗しました:", err);
    throw new Error("データベースの初期化に失敗しました");
  });

export default pool;
