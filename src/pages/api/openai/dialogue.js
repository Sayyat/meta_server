const {gpt_3_5} = require("/src/backend/chatgpt")
const {detectLanguage, translate} = require("src/backend/translator")

export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string") body = JSON.parse(body)

    let hasError = false
    let {dialogue} = body
    translateDialogue(dialogue, (async (englishDialogue, languages) => {
        if (hasError) return
        const lang = languages[languages.length - 1]
        console.log("lang: ", lang)
        const englishAnswer = await gpt_3_5(englishDialogue);
        console.log(englishAnswer)
        translateSentence({sentence: englishAnswer.content, from: 'en', to: lang}, nativeAnswer => {
            console.log({nativeAnswer})
            if (hasError) return
            res.status(200).json({role: englishAnswer.role, content: nativeAnswer})
        }, error => {
            console.log(error)
        })
    }), async (error) => {
        if (hasError) return
        hasError = true
        console.log("error: ", error)
        const answer = await gpt_3_5(dialogue);
        res.status(200).json({role: answer.role, content: answer.content})
    })
}

function translateDialogue(dialogue = [], callback, error) {
    let translations = []
    let languages = []
    let count = dialogue.length


    dialogue.forEach((message, i) => {
        translateMessage(message, (translation) => {
            console.log({translation})
            translations[i] = {role: translation?.role, content: translation?.content}
            languages[i] = translation?.lang
            count--
            if (count === 0) {
                callback(translations, languages)
            }
        }, (err) => {
            error("simple error: ", err)
        })
    })
}

function translateMessage(message = {role: '', content: ''}, callback, error) {
    console.log("TranslateMessage: ", message)
    detectLanguage(message.content, (lang) => {
        translateSentence({sentence: message.content, from: lang}, (translation) => {
            callback({role: message.role, content: translation, lang: lang})
        }, err => {
            error(err)
        })
    }, (err) => {
        error(err)
    })
}

function translateSentence({sentence = '', from, to = 'en'}, callback, error) {
    translate(sentence, from, to, (translation) => callback(translation), (err) => error(err))
}