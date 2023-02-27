import startWaiting from "@/tools/fileEventWaiter";

const fs = require('fs');
export default async function handler(req, res) {

    const {email} = req.query
    console.log("email",email)
    if(email.trim().length === 0)
        res.status(400).json({error: "email is empty"})

    const stripped = email.split("@")[0]

    console.log('stripped: ', stripped)
    startWaiting(`./${stripped}.txt`, (result)=>{
        console.log(result)
        // if there is no file
        if(result.id === 2) return

        const data = fs.readFileSync(`./${stripped}.txt`)
        fs.unlinkSync(`./${stripped}.txt`)
        const json = JSON.parse(data.toString())

        res.status(200).json(json);
    }, 60 * 1000)
}
