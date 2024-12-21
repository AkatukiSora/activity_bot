//import 群
import { REST, Routes } from "discord.js";
import { logger } from "@/initializer/log";

/* 環境変数の取得 */
import dotenv from "dotenv";
dotenv.config();

/* BIGIN ガード節 */
if (!process.env["TOKEN"]) {
  logger.fatal("TOKENが設定されていません。");
  throw new Error("TOKENが設定されていません。");
}
if (!process.env["CLIENT_ID"]) {
  logger.fatal("CLIENT_IDが設定されていません。");
  throw new Error("CLIENT_IDが設定されていません。");
}
if (!process.env["GUILD_ID"] && process.env["NODE_ENV"] === "development") {
  logger.fatal("GUILD_IDが設定されていません。");
  throw new Error("GUILD_IDが設定されていません。");
}
/* END ガード節 */

import CommandHandler from "./commandHandler";
const commandDatas = new CommandHandler().listCommands.map(
  (command) => command.data,
);

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"]);

const slashCommandRefresh = async () => {
  if (!process.env["CLIENT_ID"]) return;
  if (!process.env["GUILD_ID"]) return;
  try {
    logger.info("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationCommands(
        process.env["CLIENT_ID"],
        //process.env["GUILD_ID"],
      ),
      { body: commandDatas },
    );

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);
  }
};

export default slashCommandRefresh;
