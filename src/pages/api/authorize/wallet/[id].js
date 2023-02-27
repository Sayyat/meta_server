import fs from "fs";
import {addMetamask} from "@/pages/api/database/auth";

export default async function handler(req, res) {
    // get important userdata
    // {email, name, given_name, family_name, picture}
    const {address, balance, chainId} = JSON.parse(req.body)

    console.log({address, balance, chainId})

    const {id} = req.query

    await addMetamask(id, address, balance.formatted, chainId)

    if (id.trim() === '') {
        res.status(400).json({error: "id is empty"})
        return
    }

    const walletData = {
        address, balance: balance.formatted, chainId
    }

    fs.writeFileSync(`./${id}.txt`, JSON.stringify(walletData))
    res.status(200).json("You can close this window");
}
