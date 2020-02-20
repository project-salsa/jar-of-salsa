import { duckIt } from 'node-duckduckgo'
import { URL } from 'url';

export interface Result {
    Abstract: string;
    AbstractText: string;
    AbstractSource: string;
    AbstractURL: string;
    Image: string;
    Heading: string;

    Answer: string;
    AnswerType: "calc" | "color" | "digest" | "info" | "ip" | "iploc" | "phone" | "pw" | "rand" | "regexp" | "unicode" | "upc" | "zip";

    Definition: string;
    DefinitionSource: string;
    DefinitionURL: string;

    RelatedTopics: [
        {
            Result: string;
            FirstURL: string;
            Icon: {
                URL: string;
                Height: number;
                Width: number;
            }
            Text: string;
        }
    ]
    Results: [
        {
            Result: string;
            FirstURL: string;
            Icon: {
                URL: string;
                Height: number;
                Width: number;
            }
            Text: string;
        }
    ]
    // A (article), D (disambiguation), C (category), N (name), E (exclusive), or nothing
    Type: "A" | "D" | "C" | "N" | "E" | "";
    Redirect: string;
}

export async function duckSearch(query: string) {
      console.log(query)
      const result = await duckIt(query, {noHtml: true, noRedirect: true});
      return <Result> result.data;
      console.log(result.data);
  }

