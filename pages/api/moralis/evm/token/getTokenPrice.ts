import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenPriceParams } from 'src/@types/evm';

interface getTokenPriceRequest extends NextApiRequest {
  body: getTokenPriceParams;
}

export default async function handler(req: getTokenPriceRequest, res: NextApiResponse) {
  const { address, chain, exchange, toBlock } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain,
      exchange,
      toBlock,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
