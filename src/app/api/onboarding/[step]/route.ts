import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  const { step } = req.query;
  res.end(`Post: ${step}`)
}
