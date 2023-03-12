import axios from "axios";
import {raw} from "mysql";

export default function useTranslate() {
    async function detectLanguage(text) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '831893c4c3msh1321dc4593186e6p1825eejsnccf63a00daa2',
                'X-RapidAPI-Host': 'translo.p.rapidapi.com'
            }
        };

        const response = await fetch('https://translo.p.rapidapi.com/api/v3/detect?text=' + text, options)
        const json = await response.json()
        console.log(json)
        return json.lang
    }

    async function translate(text, from, to) {
        if(from === to)
            return text

        const encodedParams = new URLSearchParams();
        encodedParams.append("from", from);
        encodedParams.append("to", to);
        encodedParams.append("text", text);

        const options = {
            method: 'POST',
            url: 'https://translo.p.rapidapi.com/api/v3/translate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '831893c4c3msh1321dc4593186e6p1825eejsnccf63a00daa2',
                'X-RapidAPI-Host': 'translo.p.rapidapi.com'
            },
            data: encodedParams
        };

        const rawResponse = await axios.request(options)
        return rawResponse.data["translated_text"]

    }
    return {detectLanguage, translate}
}