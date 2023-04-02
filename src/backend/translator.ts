const axios = require("axios")
const {readFileSync, writeFileSync} = require('fs')

const CACHE_PATH = './cache/translations.txt'

function detectLanguage(text): Promise<string> {
    try {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'translo.p.rapidapi.com'
            }
        };

        return fetch('https://translo.p.rapidapi.com/api/v3/detect?text=' + text, options)
            .then(response => response.json())
            .then(json => {
                return json.lang
            })
    } catch (err) {
        throw "Translator error: Cannot detect language"
    }
}

async function translate(text, from, to): Promise<string> {
    if (from === to) {
        return text
    }

    // check the cache
    const fromCache = translateFromCache(text, from, to)
    if (fromCache) {
        return fromCache
    }

    try {
        // translate new sentence
        return translateFromApi(text, from, to)
            .then(translation => {
                // save new translation to cache
                if (translation)
                    saveToCache(text, from, to, translation)

                return translation
            })
    } catch (err) {
        throw `Translator error: Cannot translate from ${from} to ${to}`
    }
}

function translateFromCache(text, from, to): string {
    const translationsCache = readFileSync(CACHE_PATH).toString()
    if (!translationsCache.trim())
        return null
    const json = JSON.parse(translationsCache)
    return json && json[`${from}-${to}`] && json[`${from}-${to}`][text]
}


async function translateFromApi(text, from, to): Promise<string> {
    const encodedParams = new URLSearchParams();
    encodedParams.append("from", from);
    encodedParams.append("to", to);
    encodedParams.append("text", text);

    const options = {
        method: 'POST',
        url: 'https://translo.p.rapidapi.com/api/v3/translate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'translo.p.rapidapi.com'
        },
        data: encodedParams
    };

    return axios.request(options)
        .then(rawResponse => {
            return rawResponse.data["translated_text"]
        })
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

module.exports = {detectLanguage, translate}
