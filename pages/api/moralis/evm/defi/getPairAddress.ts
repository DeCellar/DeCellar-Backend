import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getPairAddressParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getPairAddressRequest extends NextApiRequest {
  body: getPairAddressParams;
}

export default async function handler(req: getPairAddressRequest, res: NextApiResponse) {
  await cors(req, res);
  const { chain, exchange, toBlock, toDate, token0Address, token1Address } = req.body;

  try {
    const data = await Moralis.EvmApi.defi.getPairAddress({
      chain,
      exchange,
      toBlock,
      toDate,
      token0Address,
      token1Address,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
