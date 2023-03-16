import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getWalletTokenTransfersParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface getWalletTokenTransfersRequest extends NextApiRequest {
  body: getWalletTokenTransfersParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});


export default async function handler(req: getWalletTokenTransfersRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain, cursor, fromBlock, fromDate, limit, toBlock, toDate } = req.body;

  try {
    const data = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address,
      chain,
      cursor,
      fromBlock,
      fromDate,
      limit,
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
