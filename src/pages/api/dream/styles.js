import {styles} from "@/backend/dreamApi";

export default async function handler(req, res){
    res.status(200).json(styles)
}