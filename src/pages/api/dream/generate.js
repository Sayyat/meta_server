import {generateImage} from "@/backend/dreamApi";


export default async function handler(req, res){
    const {style, description, ratio} = JSON.parse(req.body)

    console.log({style, description, ratio})
    const result = await generateImage(style, description, ratio)
    console.log({dataInApi: result})
    res.status(200).json(result)
}