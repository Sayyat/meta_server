import useChatgpt from "@/pages/hooks/useChatgpt";
import useTranslate from "@/pages/hooks/useTranslate";

export default async function handler(req, res) {
    const {davinci } = useChatgpt()
    const {detectLanguage, translate} = useTranslate()

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
