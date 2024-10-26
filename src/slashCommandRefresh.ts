//import 群
import { REST, Routes } from "discord.js";
/* 環境変数の取得 */
import dotenv from "dotenv";
dotenv.config();

/* BIGIN ガード節 */
if (!process.env["TOKEN"]) {
  console.error("TOKENが設定されていません。");
  process.exit(1);
}
if (!process.env["CLIENT_ID"]) {
  console.error("CLIENT_IDが設定されていません。");
  process.exit(1);
}
if (!process.env["GUILD_ID"]) {
  console.error("GUILD_IDが設定されていません。");
  process.exit(1);
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
];

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"]);

(async () => {
  if (!process.env["CLIENT_ID"]) return;
  if (!process.env["GUILD_ID"]) return;
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env["CLIENT_ID"],
        process.env["GUILD_ID"],
      ),
      { body: commands },
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
