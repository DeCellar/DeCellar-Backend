import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getPairReservesParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getPairReservesRequest extends NextApiRequest {
  body: getPairReservesParams;
}

export default async function handler(req: getPairReservesRequest, res: NextApiResponse) {
  await cors(req, res);
  const { chain, pairAddress, toBlock, toDate } = req.body;
  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.defi.getPairReserves({
      chain,
      pairAddress,
      toBlock,
      toDate,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
