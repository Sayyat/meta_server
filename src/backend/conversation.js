import {detectLanguage, translate} from "@/backend/translator";
import {LocaleExpander, tts} from "@/backend/ttsfree";
import {gpt_3_5} from "/src/backend/chatgpt"

async function conversation(dialogue, beginning, ending) {
    try {
        const translations = await translateDialogue(dialogue)
        const englishDialogue = translations.map(message => {
            return {role: message.role, content: message.content}
        })
        englishDialogue.unshift(beginning)
        englishDialogue.push(ending)
        const lang = translations.pop()["lang"]
        const englishAnswer = await gpt_3_5(englishDialogue);
        const filteredAnswer = englishAnswer.content

        const nativeAnswer = await translate(filteredAnswer, 'en', lang)
        const expanded = LocaleExpander(lang);
        const response = await tts(nativeAnswer, expanded)
        return {text: {role: englishAnswer.role, content: nativeAnswer}, audio: response}


    } catch (translateError) {
        console.log(`TranslateDialogueError: ${translateError}`)
        try {
            const answer = await gpt_3_5(dialogue);
            dialogue.unshift(CHAT_SETTINGS)
            console.log({answer})
            return {text: {role: answer.role, content: answer}, audio: null}
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

module.exports = {conversation}