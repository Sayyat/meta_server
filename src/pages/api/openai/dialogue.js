import {gpt_3_5} from "/src/backend/chatgpt"
import {detectLanguage, translate} from "src/backend/translator";

export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {dialogue} = body
    translateDialogue(dialogue, (async (englishDialogue, languages) => {
        const lang = languages[languages.length - 1]
        const englishAnswer = await gpt_3_5(englishDialogue);
        const nativeAnswer = await translateSentence(englishAnswer.content, 'en', lang)
        dialogue.push({role: englishAnswer.role, content: nativeAnswer})
        res.status(200).json(dialogue)
    }))
}

function translateDialogue(dialogue = [], callback) {
    let translations = []
    let languages = []
    let count = dialogue.length
    for (let i = 0; i < dialogue.length; i++) {
        translateMessage(dialogue[i])
            .then(translation => {
                translations[i] = {role: translation.role, content: translation.content}
                languages.push(translation.lang)
                count--
                if (count === 0) {
                    callback(translations, languages)
                }
            })
    }
}

async function translateMessage(message = {role: '', content: ''}) {
    const lang = await detectLanguage(message.content)
    const translation = await translateSentence(message.content, lang)
    return {role: message.role, content: translation, lang: lang}
}

async function translateSentence(sentence = '', from, to = 'en') {
    return await translate(sentence, from, to)
}
