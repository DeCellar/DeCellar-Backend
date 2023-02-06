import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenTransfersParams } from 'src/@types/evm';

interface getTokenTransfersRequest extends NextApiRequest {
  body: getTokenTransfersParams;
}

export default async function handler(req: getTokenTransfersRequest, res: NextApiResponse) {
  const { address, chain, cursor, fromBlock, fromDate, limit, toBlock, toDate } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.token.getTokenTransfers({
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
