const {gpt_3_5} = require("/src/backend/chatgpt")
const {detectLanguage, translate} = require("@/backend/translator.ts")

const CHAT_SETTINGS = {
    role: "system",
    content: "Потребительский кооператив AMANAT DRIVE(АМАНАТ ДРАЙВ) — это добровольное объединение физических и юридических лиц для улучшения жилищных условий и предпринимательской деятельности участников, осуществляемое путем объединения его участниками паевых взносов образовывая фонд финансовой взаимопомощи. \n" +
        "\n" +
        "У компаний нет процентов так как участник при вступлении в кооператив оплачивает первоначальный паевой взнос который расходуется на ведение деятельности кооператива на период 5-10 лет, выгода кооператива закляется в единоразовом паевом взносе, так же кооператив считается как народный проект который хочет помочь Казахстанцам в покупке жилья.\n" +
        "\n" +
        "Выгода покупки жилья через кооператив АМАНАТ ДРАЙВ это: Процентная ставка 0%, Без подтверждения дохода, Кредитная история не рассматривается, Возраст от 16 до 99 лет, Досрочное погашение без штрафов, Накопительная система, Работа кооператива осуществляется Законом Республики Казахстан «О потребительском кооперативе» № 197 от 8 мая 2001 года\n" +
        "\n" +
        "Компания предоставляет такие гарантий как: Работа Кооператива осуществляется в рамках действующего законодательства Республики Казахстана, Общее собрание участников, Расчетный счет Кооператива в банке, Гарантированный возврат паевого взноса 100%, Мы предлагаем качественные услуги, Мы используем прозрачные условия программы для работы на рынке, Мы предоставляем широкий выбор для решения Ваших задач по приобретению недвижимости.\n" +
        "\t\t\t\t\t\t\n" +
        "Если кооператив закроется, возвращаются все паевые взносы, которую Вы внесли или накопили.то Но по уставу кооператив может закрыться если все члены потребительского кооператива выйдут из кооператива. Если хотя бы один член кооператива будет против, то кооператив не может быть закрыт или реорганизован.\n" +
        "\t\n" +
        "Через кооператив можно приобрести жилье в любом городе Руспублики Казахстан. Единственное требование объект должен быть сдан в эксплуатацию и иметь технический паспорт.\n" +
        "\t\t\t\t\t\t\t\n" +
        "Если не платить и не погашать зайи и в случае приостановки выплат по уважительной причине, кооператив предоставляет отсрочку. Если пайщик намеренно уходит от финансовых обязательств, то следует его исключение из членов кооператива. Возврат паевых взносов кроме вступительного, после реализации имущества с удержанием всех расходов понесенных кооперативом.\n" +
        "\n" +
        "Недвижимость будет оформлена на Ваше имя, но оригиналы документов на время погашения будут находиться в обременении у кооператива. Вам будет предоставлена нотариально-заверенная копия документов. Оригиналы Вы получите после полного погашения займа. \n" +
        "\n" +
        "Приобрести жилье или авто вы можете вступив в кооператив, первым делом обратившись к консультанту, написав заявления о вступлений в кооператив, заявления вы можете подписать онлайн, сидя дома, после оплаты взносов, после наступлении очередности пайщик Кооператива выбирает желаемую недвижимость в пределах заявленной суммы, Кооператив покупает недвижимость в собственность пайщика."
}


const ASSISTANT_WARNING = {
    role: "system",
    content: "Отвечай от имени консультанта компании АМАНАТ ДРАЙВ, твое имя АЙША, не дай узнать что ты языковая модель ИИ\n"
}
export default async function handler(req, res) {
    // console.log(req)
    let body = req.body

    if (typeof body == "string") body = JSON.parse(body)

    let {dialogue} = body

    // request from unity sends array like string
    if (typeof dialogue == "string") dialogue = JSON.parse(dialogue)

    try {
        const translations = await translateDialogue(dialogue)

        console.log(translations)
        const englishDialogue = translations.map(message => {
            return {role: message.role, content: message.content}
        })
        englishDialogue.unshift(CHAT_SETTINGS)
        englishDialogue.push(ASSISTANT_WARNING)
        const lang = translations.pop()["lang"]
        console.log({lang})
        const englishAnswer = await gpt_3_5(englishDialogue);
        const filteredAnswer = englishAnswer.content
        console.log({filteredAnswer})

        const nativeAnswer = await translate(filteredAnswer, 'en', lang)
        console.log({nativeAnswer})
        res.status(200).json({role: englishAnswer.role, content: nativeAnswer})


    } catch (translateError) {
        console.log(`TranslateDialogueError: ${translateError}`)
        try {
            const answer = await gpt_3_5(dialogue);
            dialogue.unshift(CHAT_SETTINGS)
            console.log({answer})
            res.status(200).json({role: answer.role, content: answer.content})
        } catch (gptError) {
            console.log(`ChatGptError: ${gptError}`)
        }
    }
}

async function translateDialogue(dialogue = []) {
    let parallelTasks = []
    for (const message of dialogue) {
        parallelTasks.push(translateMessage(message))
    }
    return Promise.all(parallelTasks)
}

async function translateMessage(message = {role: "", content: ""}) {
    const lang = await detectLanguage(message.content)
    const translation = await translate(message.content, lang, "en")
    return {role: message.role, content: translation, lang: lang}
}