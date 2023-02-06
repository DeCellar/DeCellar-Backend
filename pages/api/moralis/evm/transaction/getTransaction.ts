import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTransactionParams } from 'src/@types/evm';

interface getTransactionRequest extends NextApiRequest {
  body: getTransactionParams;
}

export default async function handler(req: getTransactionRequest, res: NextApiResponse) {
  const { chain, transactionHash } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

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
