import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getWalletTransactionsParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getWalletTransactionsRequest extends NextApiRequest {
  body: getWalletTransactionsParams;
}

export default async function handler(req: getWalletTransactionsRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain, cursor, fromBlock, fromDate, limit, toBlock, toDate } = req.body;
  try {
    const data = await Moralis.EvmApi.transaction.getWalletTransactions({
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
