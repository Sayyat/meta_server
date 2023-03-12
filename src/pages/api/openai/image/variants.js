import {imageVariants} from "@/pages/backend/chatgpt";

export default async function handler(req, res) {
    let {image }= JSON.parse(req.body)
    image = image.replace(/^data:image\/png;base64,/, '');
    image = Buffer.from(image, "base64")
    let answer = await imageVariants(image)
    const result = answer.data
    res.status(200).json(result)
}
