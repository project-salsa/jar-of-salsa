import * as Discord from 'discord.js';
import CommandManager from './commands';
const client = new Discord.Client();

const GENERAL_CHANNEL_ID = "679113759188582478";

const commandManager = new CommandManager();

client.once('ready', () => {
	client.channels.fetch(GENERAL_CHANNEL_ID).then((chan) => {
		if (chan.type === "text") {
			const textChannel = chan as Discord.TextChannel;
			textChannel.send("bot is booting up or something");
		}
	}).catch(err => console.error(err));
});

client.on('message', (msg) => {
	commandManager.parseMessage(msg.content);
	msg.channel
})

client.login(process.env.DISCORD_TOKEN);