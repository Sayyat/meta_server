import fs from "fs";
import jwtDecode from "jwt-decode";
import {loginGoogle} from "../../database/auth";

export default async function handler(req, res) {
    // get important userdata
    // {email, name, given_name, family_name, picture}
    const jwt = JSON.parse(req.body)
    const userdata = jwtDecode(jwt.credential)
    const {email, name, given_name, family_name, picture} = userdata
    console.log({email, name, given_name, family_name, picture})

    const result = await loginGoogle(email)

    let newData = {
        id: result.id.toString(),
        email: email,
        firstname: given_name,
        nickname: result.nickname,
        walletData: {
            address: result.walletAddress,
            balance: result.walletBalance,
            chainId: result.walletChainId
        },
        avatarUrl: result.avatarUrl,
        imageBytes: ''
    }

    console.log(newData)

    loadImage(picture, (imageBytes) => {
        const {token} = req.query
        newData.imageBytes = imageBytes
        fs.writeFileSync(`./${token}.txt`, JSON.stringify(newData))
        res.status(200).json("You can close this window");
    })
}

// convert image url to byte[]
function loadImage(imageUrl, onComplete) {
    fetch(imageUrl).then(response => {
        response.blob().then(blob => {
            blob.arrayBuffer().then(arrayBuffer => {
                onComplete(Buffer.from(arrayBuffer).toString('base64'))
            })
        })
    })
}