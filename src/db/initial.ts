import * as mariadb from "mariadb";

//DB接続
export default new class DB {
  #pool;

  constructor() {
    if (
      !process.env["DB_HOST"] ||
      !process.env["DB_USER"] ||
      !process.env["DB_PASS"] ||
      !process.env["DB_NAME"]
    ) {
      throw new Error("DB_HOST, DB_USER, DB_PASS, DB_NAME must be set in env");
    }

    this.#pool = mariadb.createPool({
      host: process.env["DB_HOST"],
      user: process.env["DB_USER"],
      password: process.env["DB_PASS"],
      database: process.env["DB_NAME"],
      connectionLimit: 5,
    });

    console.log("DB connected");
  }
}
