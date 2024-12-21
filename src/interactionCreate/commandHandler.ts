import { logger } from "@/initializer/log";
import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

/* コマンドデータをインポート */
import ping from "@/interactionCreate/commands/ping";
import time from "@/interactionCreate/commands/time";
import score from "@/interactionCreate/commands/score";
import { reportErrorLog } from "@/db/insertErrorLog";

const commands = ((): Commands => {
  const commandRowDatas = [ping, time, score];
  const commands: Commands = new Collection<string, Command>();
  for (const commandRowData of commandRowDatas) {
    commands.set(commandRowData.data.name, commandRowData);
  }
  return commands;
})();

type Command = {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
type Commands = Collection<string, Command>;

class CommandHandler {
  #commands: Commands;
  constructor() {
    this.#commands = commands;
  }
  execInteraction(interaction: ChatInputCommandInteraction) {
    logger.debug("BBB");
    const command = this.#commands.get(interaction.commandName);
    if (!command) return;
    const execPromise = command.execute(interaction);
    execPromise.then(() => {
      logger.debug("CCC");
    });
    execPromise.catch((error: unknown) => {
      errorReply(interaction, error);
    });
  }
  get listCommands(): Commands {
    return this.#commands;
  }
}

const errorReply = (
  interaction: ChatInputCommandInteraction,
  error: unknown,
) => {
  logger.error(error);
  const errorLogId = reportErrorLog.insertErrorLog(
    "error",
    `コマンド実行に失敗: ${error}`,
    interaction.user.id,
    interaction.guild?.id,
  );
  const message = {
    embeds: [
      new EmbedBuilder({
        title: "コマンド実行エラー",
        description: "コマンド実行時にエラーが発生しました",
        footer: {
          text: `ErrorLogID: ${errorLogId}`,
        },
      }),
    ],
  };
  if (interaction.replied || interaction.deferred) {
    interaction.followUp(message);
  } else {
    interaction.reply(message);
  }
};

export default CommandHandler;
