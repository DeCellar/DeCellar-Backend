import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getPairReservesParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

interface getPairReservesRequest extends NextApiRequest {
  body: getPairReservesParams;
}

const headers: any = {
  accept: 'application/json',
  'X-API-Key': process.env.MORALIS_API_KEY,
};

export default async function handler(req: getPairReservesRequest, res: NextApiResponse) {
  await cors(req, res);
  const { pairAddress, chain } = req.query;

  if (!pairAddress || !chain) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  const url = `https://deep-index.moralis.io/api/v2/${pairAddress}/reserves?chain=${chain}`;

  try {
    const response = await axios.get(url, {
      headers,
    });
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
