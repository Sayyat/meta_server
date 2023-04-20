const fs = require("fs")

async function tts(text, lang) {
    const response = await fetch("https://ttsfree.com/api/v1/tts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.TTSFREE_API_KEY
        },
        body: JSON.stringify({
            "text": text,
            "voiceService": "servicebin",
            "voiceID": lang,
        })
    })

    return await response.json()
}


module .exports = {tts}