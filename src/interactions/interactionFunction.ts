import { InteractionReplyOptions } from "discord.js";

export type InteractionFunction = {
  commandName: string;
  function: Promise<InteractionReplyOptions>;
};
/**
 * InteractionCommandに対する返信を作成する関数のクラス
 * @param commandName コマンド名
 * @param func IntractionPeplyOprionsを返すPromiseオブジェクト
 *
 * @throws Error コマンド名が不正な場合
 * @throws Error funcが設定されていない場合
 *
 */
class interactionReplyFunction {
  static type = "interactionReplyFunction" as const;

  readonly #commandName: string;
  readonly #function: () => Promise<InteractionReplyOptions>;

  constructor(
    commandName: string,
    func: () => Promise<InteractionReplyOptions>,
  ) {
    const discordCommandNameRegex = /^[a-z0-9]{1,32}$/;

    if (
      !(
        commandName.length === 0 ||
        commandName.length < 32 ||
        discordCommandNameRegex.test(commandName)
      )
    )
      throw new Error("Invalid command name");
    if (!func) throw new Error("Function is not set");

    this.#function = func;
    this.#commandName = commandName;
    Object.freeze(this);
  }

  /**
   * コマンドの名前を取得する
   * @returns string
   */
  get commandName() {
    return this.#commandName;
  }

  /**
   * コマンドの返信を取得する
   * @returns InteractionReplyOptions
   */
  function() {
    return this.#function();
  }
}

export default interactionReplyFunction;
