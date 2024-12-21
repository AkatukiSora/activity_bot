import Discord from "discord.js";
import Commands from "@/interactionCreate/commandHandler";

class inCommandClient extends Discord.Client {
  public readonly commands: Commands;
  constructor(option: Discord.ClientOptions) {
    super(option);
    this.commands = new Commands();
  }
}

export default inCommandClient;
