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
    console.log("dialogue : ", dialogue)

    const rawAnswer = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: dialogue,
    });

    dialogue.push({role: "AI", content: rawAnswer.data.choices[0].text})
    return dialogue
}

async function image(description, count, size) {
    size = fixSizes(size)
    console.log({description,count,size})
    return await openai.createImage({
        prompt: description,
        n: Math.min(10,count),
        size: size,
    })
}

async function imageVariants(image) {
    return await openai.createImageVariation({
        image: image,
        n: 1,
        size: "256x256",
    })
}


function fixSizes(size){
    const sizes = {
        "0": "256x256",
        "256": "256x256",
        "256x256": "256x256",
        "1": "512x512",
        "512": "512x512",
        "512x512": "512x512",
        "2": "1024x1024",
        "1024": "1024x1024",
        "1024x1024": "1024x1024",
    }
    return sizes[size]
}

export {davinci, gpt_3_5, image, imageVariants}



