const axios = require("axios")
const {readFileSync, writeFileSync} = require('fs')

const CACHE_PATH = './cache/translations.txt'

function detectLanguage(text, callback, error) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'translo.p.rapidapi.com'
        }
    };

    fetch('https://translo.p.rapidapi.com/api/v3/detect?text=' + text, options)
        .then(response => response.json())
        .then(json => {
            callback(json.lang)
        })
        .catch(err => {
            error("Translator error: Cannot detect language")
        })
}

function translate({text, from, to}, callback, error) {
    if (from === to) {
        callback(text)
        return
    }

    // check the cache
    const fromCache = translateFromCache(text, from, to)
    if (fromCache) {
        console.log("Translated from cache")
        callback(fromCache)
        return
    }

    // translate new sentence
    translateFromApi(text, from, to)
        .then(translation => {
            // save new translation to cache
            if (translation)
                saveToCache(text, from, to, translation)

            callback(translation)
        })
        .catch(err => {
            error(`Translator error: Cannot translate from ${from} to ${to}`)
        })
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
    console.log("Saved to cache")
}
module .exports = {detectLanguage, translate}
