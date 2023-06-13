import {generateImage} from "@/backend/dreamApi";


export default async function handler(req, res){
    const {taskId, style, description, ratio} = JSON.parse(req.body)

    console.log({taskId, style, description, ratio})
    const result = await generateImage(taskId, style, description, ratio)

    res.status(200).json(result)
}