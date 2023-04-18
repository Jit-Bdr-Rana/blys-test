import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    //extract body content ie token
    const token = req.body.toString();
    const tokenArr: string[] = token?.split(""); // split into array
    const last = tokenArr[tokenArr.length - 1]; //last token digit
    if (token.length >= 7 || tokenArr.length >= 7 || last == "7") {
      res
        .status(500)
        .json({ error: "token must be 6 digit and not end with 7" });
    } else {
      res.status(200).json({
        message: "success you are being redirected to the route /success",
      });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not allowd only post request is supported" });
  }
}
