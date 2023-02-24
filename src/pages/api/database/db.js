// const mysql = require('mysql')
//
// const conn = mysql.createConnection({
//     host: process.env.HOST,
//     port: process.env.PORT,
//     database: process.env.DATABASE,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     connectTimeout: 100
// })
//
// export default async function executeQuery(query, values) {
//     conn.query(query, values, function (err, result) {
//         if(err){
//             console.log(err)
//         }
//         console.log(result)
//     })
// }

const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectTimeout: 100
})

export default async function executeQuery(query, values) {
    let result = {result: null, error: null}
    try {
        const conn = await pool.getConnection();
        const res = await conn.query(query, values)
        result = {result: res, error: null}
    } catch (e) {
        console.error(e)
        result = {result: null, error: e}
    }

    return result
}


