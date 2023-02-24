import startWaiting from "@/tools/fileEventWaiter";
const fs = require('fs');
export default async function handler(req, res) {
    console.log("token: ")
    console.log(req.query)
    const {token} = req.query

    startWaiting(`./${token}.txt`, (result)=>{
        console.log(result)
        const data = fs.readFileSync(`./${token}.txt`)
        fs.unlinkSync(`./${token}.txt`)
        const json = JSON.parse(data.toString())

        res.status(200).json(json);
    }, 60 * 1000)
}


