import fs from "fs";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function davinci(question) {
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

async function gpt_3_5(dialogue) {
    console.log("dialogue : ",dialogue)

    const rawAnswer = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: dialogue,
    });

    dialogue.push({role: "AI", content:  rawAnswer.data.choices[0].text})
    return dialogue
}

async function image(description) {
    console.log("description : ",description)

    return await openai.createImage({
        prompt: description,
        n: 9,
        size: "256x256",
    })
}

async function imageVariants(image) {
    fs.writeFileSync("image.png", image)
    return await openai.createImageVariation({
        image: fs.createReadStream("image.png"),
        n: 1,
        size: "256x256",
    })
}


export {davinci, gpt_3_5, image, imageVariants}

