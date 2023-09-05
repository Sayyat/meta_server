import {OpenAI} from "openai"

const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

async function davinci(question) {
    try {
        const rawAnswer = await openai.completions.create({
            model: "text-davinci-003",
            prompt: question,
            temperature: 0.9,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6
        });

        return rawAnswer.choices[0].text
    }
    catch (error){
        throw `ChatGPT error: ${error.response.statusText}`
    }
}

async function gpt(dialogue = []) {
    try {
        const rawAnswer = await openai.chat.completions.create({
            model: "gpt-4",
            messages: dialogue,
        });
        return rawAnswer.choices[0].message
    }
    catch (error){
        throw `ChatGPT error: ${error.response.statusText}`
    }
}

async function image(description, count, size) {
    try {

    size = fixSizes(size)
    console.log({description, count, size})
    return await openai.images.generate({
        prompt: description,
        n: Math.min(10, count),
        size: size,
    })
    }
    catch (error){
        throw `ChatGPT error: ${error.response.statusText}`
    }
}

async function imageVariants(image) {
    return openai.images.createVariation({
        image: image,
        n: 1,
        size: "256x256",
    });
}


function fixSizes(size) {
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

module.exports = {davinci, gpt, image, imageVariants}



