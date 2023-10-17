const axios = require("axios");

async function getYoutubeVideo() {
    const response = await fetch("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAimRv2elHEH2j_26uEJi8iDT_19TMhTDo&id=fO8wPLwRCao,SPITxn7YU-I")

    const result = await response.json()
    console.log(result)
    return response
}


getYoutubeVideo()

module.exports = {getYoutubeVideo}