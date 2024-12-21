import {
  GatewayIntentBits,
  Message,
  OmitPartialGroupDMChannel,
} from "discord.js";
import Client from "@/initializer/client";
import { logger } from "@/initializer/log";

import dotenv from "dotenv";
dotenv.config({ path: "env/.env.app" });

import slashCommandRefresh from "@/interactionCreate/slashCommandRefresh";
slashCommandRefresh();
import db, { asyncDBInitial } from "@/initializer/db"; // テスト用
db.getConnection().then((conn) => {
  conn.release();
});

//Discordのクライアントを作成
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  if (!client.user) return;

  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  logger.debug("AAA");
  try {
    client.commands.execInteraction(interaction);
  } catch (error) {
    logger.error("コマンドハンドラーの呼び出しに失敗", error);
  }
});

import actionType from "./isActions/index";
import adjustmentType from "./isAdjustments/index";
import insertData from "./db/insertData";
import getData from "./db/getData";
import pool from "@/initializer/db";

const messageEventFunc = async (
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const type = await actionType(message);
  if (!type) return;
  logger.info(`ActionType: ${type}`);
  const promiseLogID = insertData.insertActivityLog(
    message.author.id,
    message.guild.id,
    type,
  );
  const PromiseAdjustmentTypes = adjustmentType(message);
  const [logID, adjustmentTypes] = await Promise.all([
    promiseLogID,
    PromiseAdjustmentTypes,
  ]);
  if (!adjustmentTypes) return;
  insertData.insertActivityAdjustments(logID, adjustmentTypes);
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!(await getData.isUserRegistered(message.author.id))) {
    await insertData.insertUserOptOut(message.author.id);
  }
  messageEventFunc(message);
});

// DBの初期化が終わったらログイン
const main = async () => {
  await asyncDBInitial();
  client.login(process.env["TOKEN"]);
};

main();

process.on("unhandledRejection", (error) => {
  logger.fatal("Unhandled promise rejection:", error);
  try {
    logger.debug("Client destroy");
    client.destroy();
  } catch (e) {
    logger.error(e);
  }
  try {
    pool.end();
  } catch (e) {
    logger.error(e);
  }
});
