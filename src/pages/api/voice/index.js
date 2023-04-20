import {tts} from "/src/backend/ttsfree"
export default async function handler(req, res) {
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    const response = await tts("Сәлем Қалайсың!", "kk-KZ")
    res.status(200).json(response)
}

