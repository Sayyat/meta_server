
export default function Home() {

    function login(){
        const token = "123"
        // listen to callback
        fetch("/api/callback/google/" + token)
            .then((response) => response.json())
            .then(result => {
                console.log(result)
            })
        // open google oauth page
        window.open(`..?t=${token}`)
    }

    return(
        <>
            index
            <button
                onClick={login}>
                google oauth
            </button>
        </>
    )
}
