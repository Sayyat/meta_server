import {davinci} from "/src/backend/chatgpt"
import {detectLanguage, translate}  from "@/backend/translator";

export default async function handler(req, res) {
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {question} = body
    console.log(question)
    const lang = await detectLanguage(question)
    const englishQuestion = await translate(question, lang, 'en')
    console.log(englishQuestion)
    const englishAnswer = await  davinci(englishQuestion);
    console.log(englishAnswer)
    const nativeAnswer = await translate(englishAnswer, 'en', lang)
    console.log(nativeAnswer)

    res.status(200).json({answer: nativeAnswer})
}
