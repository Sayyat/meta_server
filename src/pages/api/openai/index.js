const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    let body = req.body

    if(typeof body == "string")
        body = JSON.parse(body)

    let {question} = body

    console.log(question)
    console.log(req.query)
    const lang = await detectLanguage(question)
    const englishQuestion = await translate(question, lang, 'en')
    const englishAnswer = await chatGpt(englishQuestion);
    const nativeAnswer = await translate(englishAnswer, 'en', lang)
    res.status(200).json({answer: nativeAnswer})
}


async function detectLanguage(text){
    const options = {
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': '831893c4c3msh1321dc4593186e6p1825eejsnccf63a00daa2',
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        },

        body: JSON.stringify({
            q: text
        })
    };

    const response = await fetch('https://deep-translate1.p.rapidapi.com/language/translate/v2/detect', options)
    const json = await response.json()
    return json['data']['detections'][0]['language']
}
async function translate(text, from, to){

    const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '831893c4c3msh1321dc4593186e6p1825eejsnccf63a00daa2',
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        },
        body: JSON.stringify({
            q: text,
            source: from,
            target: to
        })

    };

    const response = await fetch(url, options)
    const json = await response.json()
    return json['data']['translations']['translatedText']
}


async function chatGpt(question) {
    const rawAnswer = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.9,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6
    });

    return rawAnswer.data.choices[0].text
}