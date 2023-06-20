import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import axios from '../../../src/utils/axios';

// Alchemy URL --> Replace with your API key at the end

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { address, alchemyNetwork } = req.query;

  const baseURL = `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`;

  // Data for making the request to query token balances
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json',
    },
    params: [`${address}`],
    id: 42,
  });

  // config object for making a request with axios
  const config = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    // Make the request and send the response back to the client
    const response = await axios(config);
    res.status(200).json(response.data.result);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
