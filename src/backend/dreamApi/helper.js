const fs = require("fs")

const STYLES_URL = "https://api.luan.tools/api/styles/"

fetch(STYLES_URL ).then(response => response.json()).then(result => {
    fs.writeFileSync("allStyles.json", JSON.stringify(result), {encoding: "utf-8"})
})