import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getNativeBalanceParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getNativeBalanceRequest extends NextApiRequest {
  body: getNativeBalanceParams;
}
Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(req: getNativeBalanceRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain } = req.body;
  try {
    const data = await Moralis.EvmApi.balance.getNativeBalance({
      address,
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
