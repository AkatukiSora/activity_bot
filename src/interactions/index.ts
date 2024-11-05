import interactionReplyFunction from "./interactionReplyFunction";
import ping from "./ping";
import time from "./time";
/**
 * IntractionCommandに返信するクラスをまとめるクラス
 * @param commands interactionReplyFunctionの配列
 */
class intractionCommands {
  static type = "intractionCommands" as const;
  private readonly commands: interactionReplyFunction[] = [];
  private readonly commandsMap: Map<string, interactionReplyFunction> =
    new Map();
  constructor(commands: interactionReplyFunction[]) {
    this.commands = commands;
    this.commands.forEach((command) => {
      this.commandsMap.set(command.commandName, command);
    });
    Object.freeze(this);
  }

  execCommand(commandName: string) {
    const command = this.commandsMap.get(commandName);
    if (!command) throw new Error("Command not found");
    return command.function();
  }

  /**
   * タイプを取得する
   * @return string
   */
  get type() {
    return intractionCommands.type;
  }
}

/**
 * InteractionCommandに返信するクラス
 * @method execCommand コマンドを実行する
 * @throws Error コマンドが見つからない場合
 */
export default new intractionCommands([ping, time]);
