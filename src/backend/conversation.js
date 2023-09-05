import {detectLanguage, translate} from "@/backend/translator";
import {LocaleExpander, tts} from "@/backend/ttsfree";
import {gpt} from "/src/backend/chatgpt"

async function conversation(dialogue, beginning, ending) {
    try {
        const translations = await translateDialogue(dialogue)
        const englishDialogue = translations.map(message => {
            return {role: message.role, content: message.content}
        })
        englishDialogue.unshift(beginning)
        englishDialogue.push(ending)
        const lang = translations.pop()["lang"]
        const englishAnswer = await gpt(englishDialogue);
        const filteredAnswer = englishAnswer.content

        const nativeAnswer = await translate(filteredAnswer, 'en', lang)
        const expanded = LocaleExpander(lang);
        const response = await tts(nativeAnswer, expanded)
        return {text: {role: englishAnswer.role, content: nativeAnswer}, audio: response}


    } catch (translateError) {
        console.log(`TranslateDialogueError: ${translateError}`)
        try {
            dialogue.unshift(beginning)
            const answer = await gpt(dialogue);
            console.log({answer})
            return {text: {role: answer.role, content: answer.content}, audio: null}
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