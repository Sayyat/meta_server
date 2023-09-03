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

import mariadb from'mariadb'

const pool = mariadb.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectTimeout: 5
})


export default async function executeQuery(query, values) {
    let conn, result
    try {
        conn = await pool.getConnection();
        result = await conn.query(query, values)
    } catch (e) {
        console.error(e)
        result = null
    } finally {
        if(conn)
            await conn.release()
    }

    return result
}


