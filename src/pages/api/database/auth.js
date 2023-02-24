import executeQuery from './db'

// user logins with metamask
export async function loginMetamask(wallet) {
    const query = await executeQuery(`select * from users where wallet = ${wallet};`)
    if (query.length === 0) {
        return null;
    } else {
        return query[0]
    }
}

export async function addMetamask(wallet, email) {

    const queryForEmail = await executeQuery(`select * from users where email = ${email};`)
    console.log(queryForEmail[0])
    if (queryForEmail.length === 0) return null
    console.log("my data: ", email, wallet)

    executeQuery("UPDATE `users` SET `wallet`='" + wallet + "' WHERE `email` = '" + email + "'")
        .then(response => {
            console.log(response)
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
}


// user logins with Google
export async function loginGoogle(email) {
    console.log("attempt to login via google: " + email)
    // check if user already authorized
    const loginQuery = await executeQuery(`select * from users where email = '${email}';`, [])

    // sql query result has no error, and we have found user in database
    if (!loginQuery.error && loginQuery.result.length > 0) {
        if(loginQuery.result.length > 1){
            console.log("There are more than 1 user in table users")
        }
        return loginQuery.result[0]
    }
    // sql query result has some error, or we did not find user in database
    const signUpQuery = await executeQuery(`insert into users (email) values ('${email}');`, [])

    const id = signUpQuery.result.insertId

    return {
        id: id,
        nickname: '',
        email: email,
        wallet: '',
        avatarUrl: ''
    }
}