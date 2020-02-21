import * as querystring from 'querystring';
import * as r2 from 'r2';


const DOG_API_URL = "https://api.thedogapi.com/";
const DOG_API_KEY = process.env.DOG_API_KEY;

const CAT_API_URL = "https://api.thecatapi.com/";
const CAT_API_KEY = process.env.CAT_API_KEY;

const MAX_IMAGE_HEIGHT = 2000;
const MAX_IMAGE_WIDTH = 2000;
const RETRY_LIMIT = 3;

interface Dog {
    url: string;
}

class Animal {
    
    API_URL: string;
    API_KEY: string;


    constructor(api_url, api_key) {
        this.API_URL = api_url;
        this.API_KEY = api_key;
    }

    async loadImage(sub_id: string) {
        const headers = {
            'X-API-KEY': this.API_KEY,
        }
        const query_params = {
            // 'has_breeds': true, // if we only want images with at least one breed data object - name, temperament etc
            'mime_types':'jpg,png,gif', // to limit what types to get
            'size':'full',   // can specify small images if the image size becomes a problem
            'sub_id': sub_id, // pass the message senders username to see how many images each user has asked for in the API stats
            'limit' : 1       // only need one
        }
        // convert this obejc to query string 
        let queryString = querystring.stringify(query_params);

        try {
        // construct the API Get request url
        let _url = this.API_URL + `v1/images/search?${queryString}`;
        // make the request passing the url, and headers object which contains the API_KEY
        var response = await r2.get(_url , {headers} ).json
        } catch (err) {
            console.log(err)
        }
        console.log("Animal API response: ", response)
        return response[0];
    }

    async getPic(author: string) {
        // Pass the name of the user who sent the message for stats later, expect an array of images to be returned.
        let image = await this.loadImage(author);
        let retry_counter = 0
        
        // If the image is too big try again
        while (image.width > MAX_IMAGE_WIDTH || image.height > MAX_IMAGE_HEIGHT) {
            retry_counter++;
            console.log("Encountered a large image, fetching another one...")
            if (retry_counter > RETRY_LIMIT) {
                throw Error("Reached retry limit due to large images")
            }
            image = await this.loadImage(author); 

        }
        // Get the image from the returned object.
        let response = {
            image_url: image.url,
            message: ""
        };
        if (image.breeds.length > 0) {
            // If there is a breed, print some info about it
            const breed = image.breeds[0];
            response["message"] = "***" + breed.name + "*** \r *" + breed.temperament + "*";
        }

        return response;
    }
}

export const Cat: Animal = new Animal(CAT_API_URL, CAT_API_KEY)
export const Dog: Animal = new Animal(DOG_API_URL, DOG_API_KEY)
