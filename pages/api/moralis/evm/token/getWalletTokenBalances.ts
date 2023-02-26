import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getWalletTokenBalancesParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getWalletTokenBalancesRequest extends NextApiRequest {
  body: getWalletTokenBalancesParams;
}

export default async function handler(req: getWalletTokenBalancesRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain } = req.body;

  try {
    const data = await Moralis.EvmApi.token.getWalletTokenBalances({
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
