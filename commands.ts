export interface Command {
	name: string,
	response: string
}

export default class CommandManager {
	/**
	 * The character that indicates the start of a command.
	 */
	commandToken = "!";
	commands: Command[] = [];

	constructor () {
		// Grab all commands
		// these are just test ones for now
		this.commands.push({
			name: "ping",
			response: "pong"
		});
	}

	/**
	 * Parses a message body and calls a command if one was issued.
	 * @param messageBody 
	 */
	parseMessage(messageBody: string) {
		if (messageBody.includes(this.commandToken)) {
			// Grab the command being called
			const searchResult = messageBody.match(/\!(\w+)/)
			if (searchResult && searchResult.length > 1) {
				const commandName = searchResult[1];
				console.log(commandName);
			}
		}
	}
}