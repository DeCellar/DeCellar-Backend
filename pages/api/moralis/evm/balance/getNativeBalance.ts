import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getNativeBalanceParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getNativeBalanceRequest extends NextApiRequest {
  body: getNativeBalanceParams;
}

export default async function handler(req: getNativeBalanceRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain, toBlock } = req.body;
  try {
    const data = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
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
