import { EmbedBuilder } from "discord.js";
import interactionReplyFunction from "./interactionFunction";

export default new interactionReplyFunction("time", async () => {
  return {
    embeds: [new EmbedBuilder({title: "Time", description: new Date().toLocaleString()})],
  };
});