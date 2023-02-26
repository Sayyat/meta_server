import startWaiting from "@/tools/fileEventWaiter";

const fs = require('fs');
export default async function handler(req, res) {

    const {email} = req.query
    console.log("email",email)
    if(email.trim().length === 0)
        res.status(400).json({error: "email is empty"})

    startWaiting(`./${email}.txt`, (result)=>{
        console.log(result)
        // if there is no file
        if(result.id === 2) return

        const data = fs.readFileSync(`./${email}.txt`)
        fs.unlinkSync(`./${email}.txt`)
        const json = JSON.parse(data.toString())

        res.status(200).json(json);
    }, 60 * 1000)
}
