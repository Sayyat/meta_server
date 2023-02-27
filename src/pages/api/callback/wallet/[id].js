import startWaiting from "@/tools/fileEventWaiter";

const fs = require('fs');
export default async function handler(req, res) {

    const {id} = req.query
    console.log("email", id)
    if (id.trim().length === 0)
        res.status(400).json({error: "id is empty"})


    startWaiting(`./${id}.txt`, (result) => {
        console.log(result)
        // if there is no file
        if (result.id === 2) return

        const data = fs.readFileSync(`./${id}.txt`)
        fs.unlinkSync(`./${id}.txt`)
        const json = JSON.parse(data.toString())

        res.status(200).json(json);
    }, 60 * 1000)
}
