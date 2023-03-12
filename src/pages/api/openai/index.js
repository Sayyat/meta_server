import {davinci} from "/src/backend/chatgpt"
import {detectLanguage, translate}  from "src/backend/translator";

export default async function handler(req, res) {
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {question} = body
    console.log(question)
    console.log(req.query)
    const lang = await detectLanguage(question)
    const englishQuestion = await translate(question, lang, 'en')
    const englishAnswer = await  davinci(englishQuestion);
    const nativeAnswer = await translate(englishAnswer, 'en', lang)
    res.status(200).json({answer: nativeAnswer})
}
