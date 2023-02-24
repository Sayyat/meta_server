import {google} from 'googleapis';

async function handler(req, res) {
  if (req.method === 'GET') {
  
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    // console.log(auth);
    const sheets = google.sheets({
      auth,
      version: 'v4',
    });
    // console.log(sheets)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.DATABASE_ID,
      range: 'Sheet2!A2:G',
    });

    let values = response.data.values
    let result = []
    values.forEach(row => {
      result.push({
        id: row[0],
        title: row[1],
        description: row[2],
        price: row[3],
        discountPrice: row[4],
        imageUrl: row[5],
        imageBytes: '',
        url: row[6]
      })
    })
    await loadImages(result, (result) => {
      res.status(200).json(result);
    })
  }
}


async function loadImages(listOfUrls, onComplete) {
  let count = 0
  for (let i = 0; i < listOfUrls.length; i++) {
    fetch(listOfUrls[i].imageUrl).then(response => {
      response.blob().then(blob => {
        blob.arrayBuffer().then(arrayBuffer => {
          listOfUrls[i]["imageBytes"] = Buffer.from(arrayBuffer).toString('base64')
          count ++
          if (count >= listOfUrls.length) {
            onComplete(listOfUrls)
          }
        })
      })
    })
  }
}


export default handler;
