const {gpt_3_5} = require("./chatgpt")
const {detectLanguage, translate} = require("./translator")

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

/// testing
function test(){
    let hasError = false
    let dialogue = [
        {role: "user", content: "Сәлем"},
        {role: "assistant", content: "Сәлем, бүгін сізге қалай көмектесе аламын?"},
        {role: "user", content: "Сенің атың кім"}
    ]
    translateDialogue(dialogue, (async (englishDialogue, languages) => {
        if (hasError) return
        const lang = languages[languages.length - 1]
        console.log("lang: ", lang)
        const englishAnswer = await gpt_3_5(englishDialogue);
        console.log(englishAnswer)
        translateSentence({sentence: englishAnswer.content, from: 'en', to: lang}, nativeAnswer => {
            console.log({nativeAnswer})
            if (hasError) return
            console.log({role: englishAnswer.role, content: nativeAnswer})
        }, error => {
            console.log(error)
        })
    }), async (error) => {
        if (hasError) return
        hasError = true
        console.log("error: ", error)
        const answer = await gpt_3_5(dialogue);
        console.log({role: answer.role, content: answer.content})
    })
}

test()