export default async function handler(req, res) {
    console.log("Request body: " + req.body);

    res.status(200).json("result");
}
