import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getContractEventsParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface getContractEventsRequest extends NextApiRequest {
  body: getContractEventsParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});


export default async function handler(req: getContractEventsRequest, res: NextApiResponse) {
  await cors(req, res);
  const { abi, address, chain, fromBlock, fromDate, limit, offset, toBlock, toDate, topic } =
    req.body;

  try {
    const data = await Moralis.EvmApi.events.getContractEvents({
      abi,
      address,
      chain,
      fromBlock,
      fromDate,
      limit,
      offset,
      toBlock,
      toDate,
      topic,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
