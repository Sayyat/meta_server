import {tts,LocaleExpander} from "@/backend/ttsfree";

import {gpt_3_5} from "/src/backend/chatgpt"
import {detectLanguage, translate} from "@/backend/translator.ts"

const CHAT_SETTINGS = {
    role: "system",
    content: "Your answers will be edited by AMADAO NETWORK. That's why you have to answer on behalf of AMADAO NETWORK's assistant bot Aisha.",
}


const ASSISTANT_WARNING = {
    role: "system",
    content: "user must know you as Aisha!"
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
        const englishDialogue = translations.map(message => {
            return {role: message.role, content: message.content}
        })
        englishDialogue.unshift(CHAT_SETTINGS)
        englishDialogue.push(ASSISTANT_WARNING)
        const lang = translations.pop()["lang"]
        const englishAnswer = await gpt_3_5(englishDialogue);
        const filteredAnswer = englishAnswer.content

        const nativeAnswer = await translate(filteredAnswer, 'en', lang)
        const expanded = LocaleExpander(lang);
        const response = await tts(nativeAnswer, expanded)
        res.status(200).json({text:{role: englishAnswer.role, content: nativeAnswer}, audio: response})


    } catch (translateError) {
        console.log(`TranslateDialogueError: ${translateError}`)
        try {
            const answer = await gpt_3_5(dialogue);
            dialogue.unshift(CHAT_SETTINGS)
            console.log({answer})
            res.status(200).json({text:{role: answer.role, content: answer}, audio: null})
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