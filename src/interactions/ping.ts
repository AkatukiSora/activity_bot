import { EmbedBuilder } from "@discordjs/builders";
import interactionReplyFunction from "./interactionFunction";

const pingEmbed = new EmbedBuilder({
  title: "Pong!",
  description: "Server is running!!!",
});

export default new interactionReplyFunction("ping", async () => {
  return {
    embeds: [pingEmbed],
  };
});
