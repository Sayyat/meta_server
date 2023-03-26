import axios from "axios";
import {readFileSync, writeFileSync} from 'fs'

const CACHE_PATH = './cache/translations.txt'

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
    return json.lang
}

async function translate(text, from, to) {
    if (from === to)
        return text

    // check the cache
    const fromCache = translateFromCache(text, from, to)
    if (fromCache) {
        return fromCache
    }

    // translate new sentence
    const translation = await translateFromApi(text, from, to);

    // save new translation to cache
    saveToCache(text, from, to, translation)

    return translation
}

function translateFromCache(text, from, to) {
    const translationsCache = readFileSync(CACHE_PATH).toString()
    if (!translationsCache.trim())
        return null
    const json = JSON.parse(translationsCache)
    return json && json[`${from}-${to}`] && json[`${from}-${to}`][text]
}


async function translateFromApi(text, from, to) {
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

function saveToCache(text, from, to, translation) {
    const translationsCache = readFileSync(CACHE_PATH).toString()
    let json = {}
    if (translationsCache.trim())
        json = JSON.parse(translationsCache)

    let fromTo = `${from}-${to}`
    if (!json[fromTo])
        json[fromTo] = {}

    json[fromTo][text] = translation
    const str = JSON.stringify(json)
    writeFileSync(CACHE_PATH, Buffer.from(str))
}


export {detectLanguage, translate}
