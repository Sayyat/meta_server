const {readFileSync, writeFileSync} = require('fs')

const CACHE_PATH_TRANSLATIONS = './cache/translations.txt'
const CACHE_PATH_DETECTIONS = './cache/detections.txt'

async function detectLanguage(text): Promise<string> {
    // check the cache
    const fromCache = detectFromCache(text)
    if (fromCache) {
        console.log("Detected from cache")
        return fromCache
    }

    try {
        const detection = await detectFromApi(text)

        console.log("Detected from api")
        if (detection)
            saveDetectionToCache(text, detection)
        return detection
    } catch (err) {
        throw `Detection error: ${err}`
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
            saveTranslationToCache(text, from, to, translation)
        return translation

    } catch (err) {
        throw `Translator error: ${err}`
    }
}

function detectFromCache(text): string {
    const detectionsCache = readFileSync(CACHE_PATH_DETECTIONS).toString()
    if (!detectionsCache.trim())
        return null
    const json = JSON.parse(detectionsCache)

    for (let lang in json) {
        if (Array.isArray(json[lang]) && json[lang].includes(text))
            return lang
    }
    return null
}


function translateFromCache(text, from, to): string {
    const translationsCache = readFileSync(CACHE_PATH_TRANSLATIONS).toString()
    if (!translationsCache.trim())
        return null
    const json = JSON.parse(translationsCache)
    return json && json[`${from}-${to}`] && json[`${from}-${to}`][text]
}


async function detectFromApi(text) {
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
        .catch(error => {
            throw "Detect from api failed"
        })

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
        const result = await fetch('https://translate-plus.p.rapidapi.com/translate', options)
        const json = await result.json()
        return json.translations.translation
    } catch (err) {
        throw `Translate from api failed from ${from} to ${to}`
    }
}

function saveDetectionToCache(text, lang) {
    const detectionsCache = readFileSync(CACHE_PATH_DETECTIONS).toString()
    let json = {}
    if (detectionsCache.trim())
        json = JSON.parse(detectionsCache)

    if (!json[lang])
        json[lang] = []
    json[lang].push(text)
    const str = JSON.stringify(json)
    writeFileSync(CACHE_PATH_DETECTIONS, Buffer.from(str))
}

function saveTranslationToCache(text, from, to, translation) {
    const translationsCache = readFileSync(CACHE_PATH_TRANSLATIONS).toString()
    let json = {}
    if (translationsCache.trim())
        json = JSON.parse(translationsCache)

    let fromTo = `${from}-${to}`
    if (!json[fromTo])
        json[fromTo] = {}

    json[fromTo][text] = translation
    const str = JSON.stringify(json)
    writeFileSync(CACHE_PATH_TRANSLATIONS, Buffer.from(str))
}

module.exports = {detectLanguage, translate}
