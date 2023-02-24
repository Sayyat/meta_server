import { changePhone } from "../../../../db/authorize";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { result, error } = await changePhone(req.body);
    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json(result);
    }
  }
}
