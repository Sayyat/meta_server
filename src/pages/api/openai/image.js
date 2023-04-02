import {image} from "/src/backend/chatgpt"
import {detectLanguage, translate}  from "@/backend/translator";

export default async function handler(req, res) {
    let body  = req.body

    if(typeof body === 'string') {
        console.log("body is string")
        body = JSON.parse(body)
    }
    let { description, count, size }= body

    // console.log(description)
    const lang = await detectLanguage(description)
    console.log(lang)
    if(lang !== "en") {
        console.log("translating")
        description = await translate(description, lang, 'en')
    }
    let answer = await image(description, parseInt(count), size)
    res.status(200).json(answer.data.data)
}
