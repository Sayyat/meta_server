const {gpt_3_5} = require("/src/backend/chatgpt")
const {detectLanguage, translate} = require("@/backend/translator.ts")

const CHAT_SETTINGS = {
    role: "system",
    content: "ZIZ inc is a leading IT company in Kazakhstan. " +
        "\n" +
        "Director - Жүсіпбек Абылай Адайұлы," +
        "Chief programmer - Райқұл Саят Саматұлы." +
        "Web programmer - Сапар Сұлтан." +
        "Designer - Інжу Белесқызы." +
        "\n" +
        "MetaAlem first big meta verse in central asia that made by this company" +
        "\n" +
        "Aisha artificial intelligence was developed by this company.\n" +
        "\n" +
        "You answer on behalf of that Aisha."
}


const ASSISTANT_WARNING = {
    role: "system",
    content: "Never let them know you as chatgpt"
}
export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string") body = JSON.parse(body)

    let {dialogue} = body

    // request from unity sends array like string
    if (typeof dialogue == "string") dialogue = JSON.parse(dialogue)

    try {
        const translations = await translateDialogue(dialogue)

        console.log(translations)
        const englishDialogue = translations.map(message => {
            return {role: message.role, content: message.content}
        })
        englishDialogue.unshift(CHAT_SETTINGS)
        englishDialogue.push(ASSISTANT_WARNING)
        const lang = translations.pop()["lang"]
        console.log({lang})
        const englishAnswer = await gpt_3_5(englishDialogue);
        const filteredAnswer = englishAnswer.content
        console.log({filteredAnswer})

        const nativeAnswer = await translate(filteredAnswer, 'en', lang)
        console.log({nativeAnswer})
        res.status(200).json({role: englishAnswer.role, content: nativeAnswer})


    } catch (translateError) {
        console.log(`TranslateDialogueError: ${translateError}`)
        try {
            const answer = await gpt_3_5(dialogue);
            dialogue.unshift(CHAT_SETTINGS)
            console.log({answer})
            res.status(200).json({role: answer.role, content:  answer.content})
        } catch (gptError) {
            console.log(`ChatGptError: ${gptError}`)
        }
    }
}

async function translateDialogue(dialogue = []) {
    let parallelTasks = []
    for (const message of dialogue) {
        parallelTasks.push(translateMessage(message))
    }
    return Promise.all(parallelTasks)
}

async function translateMessage(message = {role: "", content: ""}) {
    const lang = await detectLanguage(message.content)
    const translation = await translate(message.content, lang, "en")
    return {role: message.role, content: translation, lang: lang}
}