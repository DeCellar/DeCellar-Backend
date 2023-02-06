import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getDateToBlockParams } from 'src/@types/evm';

interface getDateToBlockRequest extends NextApiRequest {
  body: getDateToBlockParams;
}

export default async function handler(req: getDateToBlockRequest, res: NextApiResponse) {
  const { chain, date } = req.body;
  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.block.getDateToBlock({
      chain,
      date,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
