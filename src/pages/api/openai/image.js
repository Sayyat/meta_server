import {image} from "/src/backend/chatgpt"
import {detectLanguage, translate}  from "src/backend/translator";

export default async function handler(req, res) {
    let { description }= JSON.parse(req.body)

    console.log(description)
    const lang = await detectLanguage(description)
    console.log(lang)
    if(lang !== "en") {
        console.log("translating")
        description = await translate(description, lang, 'en')
    }
    let answer = await image(description)
    res.status(200).json(answer.data.data)
}
