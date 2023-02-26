import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getContractLogsParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getContractLogsRequest extends NextApiRequest {
  body: getContractLogsParams;
}

export default async function handler(req: getContractLogsRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain, cursor, limit } = req.body;

  try {
    const data = await Moralis.EvmApi.events.getContractLogs({
      address,
      chain,
      cursor,
      limit,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
