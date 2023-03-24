import {davinci, gpt_3_5} from "/src/backend/chatgpt"
import {detectLanguage, translate}  from "src/backend/translator";

export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {dialogue} = body
    console.log(dialogue)
    // const lang = await detectLanguage(dialogue)
    // const englishQuestion = await translate(dialogue, lang, 'en')
    // console.log(englishQuestion)
    // const englishAnswer = await  gpt_3_5(englishQuestion);
    // console.log(englishAnswer)
    // const nativeAnswer = await translate(englishAnswer, 'en', lang)
    // console.log(nativeAnswer)

    const englishAnswer = await gpt_3_5(dialogue);
    console.log(englishAnswer)

    res.status(200).json(englishAnswer)
}
