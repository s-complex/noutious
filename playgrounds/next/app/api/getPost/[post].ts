import type { NextApiRequest, NextApiResponse } from "next";
import { initLocalify } from "@/localify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { post } = req.query;
  const localify = await initLocalify();
  const data = localify.getSinglePost(post);
  res.status(200).json(data)
}
