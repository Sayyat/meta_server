import {retail} from "googleapis/build/src/apis/retail";

const axios = require("axios")
const {readFileSync, writeFileSync} = require('fs')

const CACHE_PATH = './cache/translations.txt'

function detectLanguage(text): Promise<string> {
    try {
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_API_HOST
            },
            body: JSON.stringify({
                text: text
            })
        };

        return fetch('https://translate-plus.p.rapidapi.com/language_detect', options)
            .then(response => response.json())
            .then(json => {
                return json.language_detection.language
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
        const translation = await translateFromApi(text, from, to)

        if (translation)
            saveToCache(text, from, to, translation)

        return translation

    } catch (err) {
        throw `Translator error: ${err}`
    }
}

function translateFromCache(text, from, to): string {
    const translationsCache = readFileSync(CACHE_PATH).toString()
    if (!translationsCache.trim())
        return null
    const json = JSON.parse(translationsCache)
    return json && json[`${from}-${to}`] && json[`${from}-${to}`][text]
}


async function translateFromApi(text, from, to) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST
        },
        body: JSON.stringify({
            "source": from,
            "target": to,
            "text": text
        })
    };
    try {
        const result = await fetch('https://translate-plus.p.rapidapi.com/translate',options)
        const json = await result.json()
        return json.translations.translation
    } catch (err) {
        throw `Translate from api failed from ${from} to ${to}`
    }
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
