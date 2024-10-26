import * as mariadb from "mariadb";

//DB接続
const pool = mariadb.createPool({
  host: process.env["DB_HOST"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASS"],
  database: process.env["DB_NAME"],
  connectionLimit: 5,
});
