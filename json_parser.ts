import fs from "fs";

export default class JSONInterface
{
    filename = "default.json"
    data = ""
    constructor (filename = "default.json") {
        this.filename = filename;
    }

    WriteToJSON(obj)
    {
        var descriptor = fs.openSync(this.filename, 'w')

        fs.writeSync(descriptor, JSON.stringify(obj))

        fs.closeSync(descriptor)
    }

    ReadFromJSON()
    {
        JSON.parse(fs.readFileSync(this.filename, 'utf-8'))
        return this.data
    }
}