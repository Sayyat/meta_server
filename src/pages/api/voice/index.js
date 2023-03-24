export default async function handler(req, res) {
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {text} = body


    res.status(200).json("answer")
}

