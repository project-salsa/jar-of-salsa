import * as fs from "fs";

export default class JSONParser {
	filename = "default.json";
	data: any = {};
	constructor(filename = "default.json") {
		this.filename = filename;
	}

	WriteToJSON(obj: any) {
		const descriptor = fs.openSync(this.filename, "w");
		fs.writeSync(descriptor, JSON.stringify(obj));
		fs.closeSync(descriptor);
	}

	ReadFromJSON() {
		if (!fs.existsSync(this.filename)) {
			return this.data;
		}
		const fileObject = fs.readFileSync(this.filename, "utf-8");
		this.data = JSON.parse(fileObject);
		return this.data;
	}
}
