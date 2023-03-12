import useChatgpt from "@/pages/hooks/useChatgpt";
import useTranslate from "@/pages/hooks/useTranslate";

export default async function handler(req, res) {
    const {image } = useChatgpt()
    const {detectLanguage, translate} = useTranslate()

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
