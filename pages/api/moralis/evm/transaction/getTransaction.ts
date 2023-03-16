import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTransactionParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface getTransactionRequest extends NextApiRequest {
  body: getTransactionParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(req: getTransactionRequest, res: NextApiResponse) {
  await cors(req, res);
  const { chain, transactionHash } = req.body;

  try {
    const data = await Moralis.EvmApi.transaction.getTransaction({
      chain,
      transactionHash,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
