import { EmbedBuilder } from "discord.js";
import target from "./index";

const embedTest = (expectFun: jest.Expect, targetResult: any) => {
  expectFun(targetResult).not.toBeUndefined();
  expectFun(targetResult).toHaveProperty("embeds");
  expectFun(targetResult.embeds).toHaveLength(1);
};

test("it should return a string", async () => {
  expect(target.type).toBe("intractionCommands");

  const [resultPing, resultTime] = await Promise.all([
    target.execCommand("ping"),
    target.execCommand("time"),
  ]);

  const commandError = new Error("Command not found");
  //@ts-expect-error
  expect(() => target.execCommand()).toThrow(commandError);
  expect(() => target.execCommand("")).toThrow(commandError);
  expect(() => target.execCommand("noFoundCommand-asdfghjkl")).toThrow(
    commandError,
  );

  embedTest(expect, resultPing);
  embedTest(expect, resultTime);

  //@ts-ignore
  expect(resultPing?.embeds[0]?.data?.title).toBe("Pong!");
});
