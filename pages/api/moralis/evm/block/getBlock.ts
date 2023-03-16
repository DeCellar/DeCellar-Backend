import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getBlockParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface getBlockParamsRequest extends NextApiRequest {
  body: getBlockParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});


export default async function handler(req: getBlockParamsRequest, res: NextApiResponse) {
  await cors(req, res);
  const { blockNumberOrHash, chain } = req.body;

  try {
    const data = await Moralis.EvmApi.block.getBlock({
      blockNumberOrHash,
      chain,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
