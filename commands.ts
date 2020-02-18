import * as Discord from "discord.js";

export interface Command {
	onCall?: (message: Discord.Message, args: string[]) => void;
	response: string;
}
export interface CommandCollection {
	[commandName: string]: Command;
}

export default class CommandManager {
	botID: string;
	/**
	 * The character that indicates the start of a command.
	 */
	commandToken = "!";
	commands: CommandCollection = {};

	constructor(botID: string) {
		this.botID = botID;
		// Grab all commands
		// these are just test ones for now
		this.commands["ping"] = {
			response: "pong"
		};
		this.commands["addcommand"] = {
			response: "",
			onCall: this.addNewCommand.bind(this)
		};
	}

	addNewCommand(message: Discord.Message, [cmdName, ...cmdResponse]) {
		try {
			let cmdResponseString = cmdResponse.join(" ");
			this.commands[cmdName] = {
				response: cmdResponseString
			};
		} catch (err) {
			message.channel.send(`Failed to create command ${cmdName}`);
			// DEBUG
			console.log(err);
			return;
		}
		message.channel.send(`Successfully created command ${cmdName}`);
	}

	removeCommand(message: Discord.Message, [cmdName]) {
		delete this.commands[cmdName];
		message.channel.send(`Successfully deleted command ${cmdName}`);
	}

	/**
	 * Parses a message body and calls a command if one was issued.
	 * @param messageBody
	 */
	parseMessage(message: Discord.Message) {
		// TODO: return if the bot is the one sending the message
		if (message.author.id === this.botID) {
			return;
		}
		if (message.content.includes(this.commandToken)) {
			// Grab the command being called
			const commandInfo = message.content.substring(1).split(/ +/);
			const [commandName, ...commandArgs] = commandInfo;
			if (commandName in this.commands) {
				const command = this.commands[commandName];
				if (command.onCall) {
					command.onCall(message, commandArgs);
				}
				if (command.response) {
					message.channel.send(command.response);
				}
			}
		}
	}
}
