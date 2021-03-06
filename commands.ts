import * as Discord from "discord.js";
import { default as JSONInterface, default as JSONParser } from "./json_parser";
import { duckSearch } from "./search"
import { Cat, Dog} from "./catdog"

export interface Command {
	onCall: (message: Discord.Message, args: string[]) => void;
}
export interface CommandCollection {
	[commandName: string]: Command;
}

export interface CustomCommand {
	response: string;
}
export interface CustomCommandCollection {
	[commandName: string]: CustomCommand;
}

export default class CommandManager {
	botID: string;
	/**
	 * The character that indicates the start of a command.
	 */
	commandToken = "!";
	commands: CommandCollection = {};
	customCommands: CustomCommandCollection = {};
	jsonParser: JSONInterface;
	cmdNameRegex = new RegExp('^[A-Za-z0-9]+$')
	constructor(botID: string, commandsFilename: string) {
		this.botID = botID;
		// Grab all commands
		// these are just test ones for now
		this.commands["addcommand"] = {
			onCall: this.addNewCommand.bind(this)
		};
		this.commands["removecommand"] = {
			onCall: (message, args) => this.removeCommand(message, args)
		};
		this.commands["s"] = {
			onCall: (message, args) => this.searchCommand(message, args)
		};
		this.commands["meow"] = {
			onCall: (message) => this.animalCommand("cat", message)
		};
		this.commands["woof"] = {
			onCall: (message) => this.animalCommand("dog", message)
		};
		this.jsonParser = new JSONParser(commandsFilename);
		// Grab commands from the JSON file, if any
		const commandJSON: any = this.jsonParser.ReadFromJSON();
		for (const [commandName, commandData] of Object.entries(commandJSON)) {
			const typedData = commandData as any;
			this.customCommands[commandName] = typedData;
		}
	}

	addNewCommand(
		message: Discord.Message,
		[cmdName, ...cmdResponse]: string[]
	) {
		if (
			!cmdName ||
			cmdName in this.customCommands ||
			cmdName in this.commands
		) {
			message.channel.send(`Failed to create command ${cmdName}`);
			return;
		} else if (!this.cmdNameRegex.test(cmdName)) {
			message.channel.send(`Command name must be alphanumeric`);
			return;
		}
		try {
			let cmdResponseString = cmdResponse.join(" ");
			this.customCommands[cmdName] = {
				response: cmdResponseString
			};
			this.jsonParser.WriteToJSON(this.customCommands);
		} catch (err) {
			message.channel.send(`Failed to create command ${cmdName}`);
			// DEBUG
			console.log(err);
			return;
		}
		message.channel.send(`Successfully created command ${cmdName}`);
	}

	removeCommand(message: Discord.Message, [cmdName]: string[]) {
		delete this.customCommands[cmdName];
		this.jsonParser.WriteToJSON(this.customCommands);
		message.channel.send(`Successfully deleted command ${cmdName}`);
	}

	searchCommand(message: Discord.Message, ...query) {
		const queryString = query[0].join(" ")
		duckSearch(queryString).then(result => {
			console.log("DuckDuckGo API result: ", result)
			// TODO add a formatted response that change based on the Type
			let response = "No results found"
			if (["D"].includes(result.Type)) {
				response = 
				`${result.RelatedTopics[0].Text}
${result.RelatedTopics[0].FirstURL}
				`;
			}
			if (["A", "C"].includes(result.Type)) {
				response = result.AbstractURL;
			}
			if (result.Redirect && result.Redirect != "") {
				response = result.Redirect;
			}
			console.log(response)
			message.channel.send(response);
		}).catch(err => {
			console.log("Error from API call: ", err)
			message.channel.send("There was an error in your search.")
		});	
	}

	animalCommand(animal: "cat" | "dog", message: Discord.Message) {
		const callback = result => {
			message.channel.send(result.message, { files: [ result.image_url ] } )
		}
		const err_func =  err => {
			console.log(err);
			message.channel.send(`There was a problem grabbing your ${animal}!`)
		};
		if (animal === "cat") {
			Cat.getPic(message.author.username).then(callback).catch(err_func)
		} else if (animal === "dog") {
			Dog.getPic(message.author.username).then(callback).catch(err_func)
		}
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
				command.onCall(message, commandArgs);
			} else if (commandName in this.customCommands) {
				const command = this.customCommands[commandName];
				message.channel.send(command.response);
			}
		}
	}
}
