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
if (!process.env["GUILD_ID"]) {
  logger.fatal("GUILD_IDが設定されていません。");
  throw new Error("GUILD_IDが設定されていません。");
}
/* END ガード節 */

type Command = {
  name: string;
  description: string;
};

const commands: Command[] = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "time",
    description: "Replies with the current time",
  },
  {
    name: "test",
    description: "test command",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"]);

(async () => {
  if (!process.env["CLIENT_ID"]) return;
  if (!process.env["GUILD_ID"]) return;
  try {
    logger.info("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env["CLIENT_ID"],
        process.env["GUILD_ID"],
      ),
      { body: commands },
    );

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);

  }
})();
