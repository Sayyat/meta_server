const axios = require('axios');
// const styles = require("./styles.json")
const styles = require("./allStyles.json")
const {detectLanguage, translate} = require("@/backend/translator");

const dreamApiKey = process.env.DREAM_API_KEY

const BASE_URL = 'https://api.luan.tools/api/tasks/';



const headers = {
    headers: {
        Authorization: `Bearer ${dreamApiKey}`,
        'Content-Type': 'application/json'
    }
}
const RATIO_MEAN = 1000

async function translatePrompt(prompt){
    try {
        const lang = await detectLanguage(prompt)
        prompt = await translate(prompt, lang, "en")
    } catch (error){
        console.log(error)
    }
    return prompt
}

function calculateWidthAndHeight(ratio = "1x1") {
    let [w, h] = ratio.split("x")
    let width = parseInt(w)
    let height = parseInt(h)
    const mean = (width + height) / 2
    width = Math.floor(RATIO_MEAN * width / mean)
    height = Math.floor(RATIO_MEAN * height / mean)
    return {width, height}
}

async function generateId() {
    const post_payload = {"use_target_image": false};
    const response = await axios.post(BASE_URL, post_payload, headers).catch(error => console.log(error.response));
    return response.data.id
}

async function editImage(taskUrl, styleId, prompt, width, height) {
    const put_payload = {
        'input_spec': {
            'prompt': prompt,
            'style': styleId,
            'height': height,
            'width': width,
            'target_image_weight': 0.3,
            'has_watermark': false,
            'allow_nsfw': false,
            'steps': 100,
            'negative_prompt': null,
            'text_cfg': 7.5,
            'seed': null
        }
    }
    await axios.put(taskUrl, JSON.stringify(put_payload), headers).catch(error => console.log(error.response));
}

async function waitUntilReady(taskUrl) {
    let state
    while (true) {
        const get_response = await axios.get(taskUrl, headers).catch(error => console.log(error.response));
        state = get_response?.data?.state
        if (state === "failed") {
            return undefined
        } else if (state === "completed") {
            return get_response.data;
        }
        await new Promise(res => setTimeout(res, 4000));
    }
}

async function generateImage(taskId, styleId, prompt, ratio) {
    console.log({taskId, styleId, prompt, ratio})
    const {width, height} = calculateWidthAndHeight(ratio)
    taskId = taskId ? taskId : await generateId()
    const taskUrl = BASE_URL + taskId
    // console.log({prompt})
    prompt = await translatePrompt(prompt)
    // console.log({prompt})
    await editImage(taskUrl, styleId, prompt, width, height)
    return await waitUntilReady(taskUrl)
}

// console.log(calculateWidthAndHeight("3x5"))

module.exports = {generateImage, styles}