const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    organization: "org-7GtNQk34xB3sCx9JjJ1IfqMn",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res){

    const {question} = req.query
    const rawAnswer = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.9,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6
    });

    const answer = rawAnswer.data.choices[0].text
    console.log(rawAnswer.data.choices[0])
    res.status(200).json({answer: answer})
}
