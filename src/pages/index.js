import {GoogleLogin, GoogleOAuthProvider, useGoogleLogin, useGoogleOneTapLogin} from "@react-oauth/google";

import {useRouter} from "next/router";

export default function Google() {
    const router = useRouter();
    const {t} = router.query;
    console.log(t)

    function success(result) {
        fetch(`../api/authorize/google/${t}`, {
            method: "post",
            body: JSON.stringify(result)
        }).then(response => {
            console.log(response)
            window.close();
        })
    }

    function error() {

    }

    function onError() {
        console.log("server side error 500")
    }

    return (
        <>
            <div className="container">
                <GoogleOAuthProvider
                    clientId={"1073982536661-u50ihostb12fjvqlnph7g2gif14nam7b.apps.googleusercontent.com"}
                >
                    <GoogleLogin
                        onSuccess={success}
                        onError={error}
                        useOneTap={true}
                        auto_select={true}
                    >

                    </GoogleLogin>
                </GoogleOAuthProvider>
            </div>
        </>
    )
}