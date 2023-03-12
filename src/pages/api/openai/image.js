import {image} from "@/pages/backend/chatgpt";
import {detectLanguage, translate} from "@/pages/backend/translate";

export default async function handler(req, res) {
    let {description }= JSON.parse(req.body)

    const lang = await detectLanguage(description)
    const english = await translate(description, lang, 'en')
    let answer = await image(english)
    const result = answer.data
    console.log(result)
    res.status(200).json(result)
}
