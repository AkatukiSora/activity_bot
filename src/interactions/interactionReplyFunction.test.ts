import interactionReplyFunction from "./interactionReplyFunction";

describe("interactionReplyFunction", () => {
  it.each([
    ["", interactionReplyFunction],
    [undefined, interactionReplyFunction],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      interactionReplyFunction,
    ],
    [
      "11111111111111111111111111111111111111111111111111111111111111111",
      interactionReplyFunction,
    ],
    ["@[:;", interactionReplyFunction],
  ])("コンストラクタに異常値を設定 - %i", (input, interactionReplyFunction) => {
    expect(
      () =>
        //@ts-expect-error
        new interactionReplyFunction(input, async () => {
          return;
        }),
    ).toThrow("Invalid command name");
  });
});
