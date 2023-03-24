const yandex_speech = require('yandex-speech');
export default async function handler(req, res) {
    let body = req.body

    if (typeof body == "string")
        body = JSON.parse(body)

    let {text} = body


    yandex_speech.TTS({
            developer_key: '3b7b9fba-cbcd-47d1-854a-b359ca0e5da7',
            text: text,
            file: 'hello.mp3',
            lang: "ru-RU",
            speaker: "amira",
        }, () => {
            console.log('done');
        }
    );


    res.status(200).json("answer")
}

