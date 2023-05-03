import {loginGoogle} from "@/backend/database/auth";

export default async function handler(req, res) {
    if (req.method == "POST") {
        console.log("Request body: " + req.body);
        const {email} = JSON.parse(req.body)
        console.log("email: " + email)
        await loginGoogle(email);
        //
        // if (error) {
        //     res.status(400).json(error);
        // } else {
            res.status(200).json("result");
        // }
    }
}
