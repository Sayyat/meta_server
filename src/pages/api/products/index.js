import {google} from 'googleapis';

const GoogleSheetsKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC60sPRfgd2y4Lr\nMtb1rdCiqUt+325h9T73JWa/+vgA7lL7f8jgbCciamMf02Hyb8h2F52V/kiFV3ah\n93e/7bHgnJJYTSS1BTCW0jLVcIgIoyeVgUsKs3Z25NLMrIwTBWDwQmVCmhBUPnD9\nOgV20niNFGZ9E+WHWkhQMt1tExiu75JF4KfvnploITqoA6tiSggySLBCFQ6Z9g2G\np2kArcWoinMufP5Fm9uis3eQ0wxBKa4FVu7SqMXwYJyrbFOoMcF6ND2fRiOG5eQf\nUo18xVv8D+VRzDk2kF25G4XB71yb3DJqxcPzScJseskTmo8O/v7gk2OOl8As5mjn\ncITGNv3jAgMBAAECggEARoA99EMOlwZir9Y+J3VB2/huLIEtmxrc+ZAsL7uKNnO5\nbf5BdGtr80FZicuP1VjYubPcvJs6i9M/SgzkrFGLRDthwJ/P/93nAatuEnzGYRgM\n2o7xniauSFy+rg1ZSN5JQDGWG+WezuPHaNAp+rafVoIB0Saegg8QZe9j/wLrWCwb\nu+hxjM5iCacTzbNdVClSXNrXy/IH7Lb/lTAHiTL4gR3UQ8o6ilvBdiy2S5I77uu6\n4OXbcOvthNrnnhJGKJflcKdMpV0Wmh2sMaP9udIr4Sl4aQTzRNzH7JY8uuFYK3Xg\nLeb5R6wU09DGwmQnNk6tG5Qfsl6SzCKesD6NSe5E3QKBgQDqpLGY9rEw34yEdSUD\ncAH9HF/fU7cQuKQ0z3ohbbLC2MGRnSBTP5WS7ye5u3cMddRK/U1Sz09BAvFAWn1W\nhuLgzCqpU0CZUqKDnh0jgL8e+QgB3mqJ+pnjpFmvQSLIaOgx2xJ1lV3ZdoN64CHY\nQumDHWlaT6VjQUVR1PUPYPh/vQKBgQDL09cyu6t6aN0dCja6isH+0U9iY1JXwxMK\n++xK6Pe2R4S292IZWG1aO1X+TtXSdFx+uC5U9bKmDF12tj3YyIkwzXS3Sua63joB\nhjjM2wqavP29CE4qFXixEA0H3Ikeqy54JpUqs036HR+aECTWYluzlWY3CMwFP7+4\nl+FoLAr+HwKBgDD9T8MjBl2w3tKs7pxoH1IsQWwMO3V3R3lrNBGUqLT7snZnet9G\nsEDsQ7wIgtOMKlW5yxIWDHMDXUFVY0PUh7vthJ6zrhIU6a9XLLhD4iNiVSSmvlGu\ni8C2iK8Jh2yWUpxOI+1+0QhdMRhPgWF4nu5sDpn3dQ1jDEkIkF20nk11AoGAeaVX\ndL7Oa4L0G+XBnfk8KGExGI4gUaJp1g9eCaMaW545VZ003d2JfeWVv+267RxnK3Wu\nqSPt1+3fRf8j0CJ2xjqIYu//3hzMz6YUdiZwIMOUR+ISDEm+OyZSMJPs/fG6DRkx\nw0c5zYDeIGtsIMqY4gfS9ht479UJDhkO/MX0VY8CgYBJqqzrAzDpTq0dKSlnzXMu\nsJxNxBHwIFxykwOvahQz1quUeUIEVXbuOGxvtAcMCSMc39R8AcXUFJm0o3dL7ibh\nTJS05DAq1OlSjO2624kTSVsTR95BJQyF3K+Ax9ZKMF3qF77N+IZR7MibZUbqBuqd\nwvm3lPKDF8yZ7tcosg6bwA==\n-----END PRIVATE KEY-----\n"
async function handler(req, res) {
  if (req.method === 'GET') {

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        private_key: GoogleSheetsKey.replace(/\\n/g, '\n'),
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
