const axios = require('axios');
const FormData = require('form-data');
const styles = require("./styles.json")

const dreamApiKey = process.env.DREAM_API_KEY || "u0DOb40tPa551kuAqPwvynVpybsskIMh"

const BASE_URL = 'https://api.luan.tools/api/tasks/';
// const STYLES_URL = "https://api.luan.tools/api/styles/"

const headers = {
    headers: {
        Authorization: `Bearer ${dreamApiKey}`,
        'Content-Type': 'application/json'
    }
}
const RATIO_MEAN = 1000


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
            'style': styleId,
            'prompt': prompt,
            'target_image_weight': 0.3,
            'width': width,
            'height': height
        }
    }
    await axios.put(taskUrl, JSON.stringify(put_payload), headers).catch(error => console.log(error.response));
}

async function waitUntilReady(taskUrl) {
    let state = "generating"
    while (state === "generating") {
        const get_response = await axios.get(taskUrl, headers).catch(error => console.log(error.response));
        state = get_response.data.state
        if (state === "failed") {
            return null
        } else if (state === "completed") {
            return get_response.data;
        }
        await new Promise(res => setTimeout(res, 4000));
    }
}

async function generateImage(styleId, prompt, ratio) {
    const {width, height} = calculateWidthAndHeight(ratio)
    const taskId = await generateId()
    const taskUrl = BASE_URL + taskId
    await editImage(taskUrl, styleId, prompt, width, height)
    return await waitUntilReady(taskUrl)
}

// console.log(calculateWidthAndHeight("3x5"))

module.exports = {generateImage, styles}