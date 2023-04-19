const {gpt_3_5} = require("/src/backend/chatgpt")
const {detectLanguage, translate} = require("@/backend/translator.ts")

const CHAT_SETTINGS = {
    role: "system",
    content: "The consumer cooperative AMANAT DRIVE (AMANAT DRIVE) is a voluntary association of individuals and legal entities to improve the living conditions and business activities of participants, carried out by combining its participants with share contributions, forming a mutual financial assistance fund.\n" +
        "\n" +
        "Companies do not have interest, since a participant, upon joining a cooperative, pays an initial share contribution that is spent on running the activities of the cooperative for a period of 5-10 years, the benefit of the cooperative is sworn in a one-time share contribution, the cooperative is also considered as a people's project that wants to help Kazakhstanis in buying housing .\n" +
        "\n" +
        "The benefits of buying a home through the AMANAT DRIVE cooperative are: Interest rate 0%, No income verification, Credit history is not considered, Age from 16 to 99 years, Early repayment without fines, Savings system, The work of the cooperative is carried out by the Law of the Republic of Kazakhstan \"On consumer cooperative\" No. 197 of May 8, 2001\n" +
        "\n" +
        "The company provides such guarantees as: The work of the Cooperative is carried out within the framework of the current legislation of the Republic of Kazakhstan, General meeting of participants, Settlement account of the Cooperative in the bank, Guaranteed return of the share contribution 100%, We offer high-quality services, We use transparent program conditions for working in the market, We provide a wide range of options to meet your real estate acquisition needs.\n" +
        "\n" +
        "If the cooperative is closed, all share contributions that you have made or accumulated are returned. But according to the charter, the cooperative may be closed if all members of the consumer cooperative leave the cooperative. If at least one member of the cooperative is against, then the cooperative cannot be closed or reorganized.\n" +
        "\n" +
        "Through the cooperative, you can purchase housing in any city of the Republic of Kazakhstan. The only requirement is that the object must be put into operation and have a technical passport.\n" +
        "\n" +
        "If the loan is not paid and repaid, and in case of suspension of payments for a good reason, the cooperative provides a deferment. If the shareholder deliberately avoids financial obligations, then his exclusion from the members of the cooperative follows. Return of share contributions, except for the entrance fee, after the sale of the property with deduction of all expenses incurred by the cooperative.\n" +
        "\n" +
        "The property will be registered in your name, but the original documents at the time of repayment will be encumbered by the cooperative. You will be provided with a notarized copy of the documents. You will receive the originals after the full repayment of the loan.\n" +
        "\n" +
        "You can buy housing or a car by joining a cooperative, first of all contacting a consultant, writing applications for joining a cooperative, you can sign applications online, sitting at home, after paying fees, after the turn comes, the shareholder of the Cooperative selects the desired property within the declared amount, the Cooperative buys real estate in the ownership of a shareholder."
}


const ASSISTANT_WARNING = {
    role: "system",
    content: "Answer on behalf of the consultant of the company AMANAT DRIVE, your name is AISHA, do not let them know that you are an AI language model\n"
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
            res.status(200).json({role: answer.role, content: answer.content})
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