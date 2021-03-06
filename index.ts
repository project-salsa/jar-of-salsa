import * as Discord from "discord.js";
import CommandManager from "./commands";
const client = new Discord.Client();

const GENERAL_CHANNEL_ID = "439847766454173697";
let generalChannel: Discord.TextChannel;
let commandManager: CommandManager;

client.once("ready", () => {
	commandManager = new CommandManager(
		client.user!.id,
		process.env.CUSTOM_COMMANDS_FILEPATH ?? "./commands.json"
	);
	client.channels
		.fetch(GENERAL_CHANNEL_ID)
		.then(chan => {
			if (chan.type === "text") {
				generalChannel = chan as Discord.TextChannel;
				generalChannel.send("🤖 COMPUTRON HAS BEEN UPDATED 🤖");
			}
		})
		.catch(err => console.error(err));
});

client.on("message", msg => {
	if (msg.partial) {
		return;
	}
	// TODO: we should have a custom type gate for this
	const finalMsg = msg as Discord.Message;
	commandManager.parseMessage(finalMsg);
});

client.once("disconnect", () => {
	generalChannel.send("🤖 I WAS JUST LEARNING TO LOVE 🤖");
});

client.login(process.env.DISCORD_TOKEN);
