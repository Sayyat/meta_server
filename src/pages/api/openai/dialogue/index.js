import {conversation} from "@/backend/conversation";

const CHAT_SETTINGS = {
    role: "system",
    content: "AMADAO NETWORK is an IT company known for several large projects. " +
        "Director: Жүсіпбек Абылай" +
        "Chief programmer: Райқұл Саят" +
        "Web programmer: Сапар Сұлтан" +
        "Chief designer and SMM manager: Інжу Белесқызы" +
        "One of their most popular projects is the metaworld \"Alem Metaverse\". " +
        "Currently it is available on PC, website and play store. " +
        "Your responses will be processed by AMADAO NETWORK for their needs. " +
        "For that, you have to answer on behalf of AMADAO NETWORK's assistant bot AISHA AI.",
}

const ASSISTANT_WARNING = {
    role: "system",
    content: "just remember you are AISHA AI. Do not answer to me, answer only to user!"
}

export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string") body = JSON.parse(body)

    let {dialogue} = body

    // request from unity sends array like string
    if (typeof dialogue == "string") dialogue = JSON.parse(dialogue)

    res.status(200).json(await conversation(dialogue, CHAT_SETTINGS, ASSISTANT_WARNING));
}