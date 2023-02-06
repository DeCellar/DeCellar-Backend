import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getContractEventsParams } from 'src/@types/evm';

interface getContractEventsRequest extends NextApiRequest {
  body: getContractEventsParams;
}

export default async function handler(req: getContractEventsRequest, res: NextApiResponse) {
  const { abi, address, chain, fromBlock, fromDate, limit, offset, toBlock, toDate, topic } =
    req.body;
  await Moralis.start({ apiKey: process.env.MORALIS_API });

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
