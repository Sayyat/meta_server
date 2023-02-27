import fs from "fs";

export default async function handler(req, res) {
    // get important userdata
    // {email, name, given_name, family_name, picture}
    const {address, balance, chainId} = JSON.parse(req.body)

    console.log({address, balance, chainId})

    const {email} = req.query


    if(email.trim() === '') {
        res.status(400).json({error: "email is empty"})
        return
    }

    const stripped = email.split("@")[0]

    console.log('stripped: ', stripped)

    fs.writeFileSync(`./${stripped}.txt`, JSON.stringify({address, balance, chainId}))
    res.status(200).json("You can close this window");
}
