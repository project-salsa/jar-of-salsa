import * as Discord from 'discord.js';
import CommandManager from './commands';
const client = new Discord.Client();

const GENERAL_CHANNEL_ID = "679113759188582478";

const commandManager = new CommandManager();

client.once('ready', () => {
    const generalChannel = client.channels
});

client.on('message', (msg) => {
    commandManager.parseMessage(msg.content);
})

client.login(process.env.DISCORD_TOKEN);