import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../../src/utils/cors';
import axios from '../../../../src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const blockHash = req.query.blockHash as string;

  if (!blockHash) {
    return res.status(400).json({ error: 'blockHash is required.' });
  }

  const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API}`;

  const requestBody = {
    id: 0,
    jsonrpc: '2.0',
    method: 'alchemy_getTransactionReceipts',
    params: [
      {
        blockHash,
      },
    ],
  };

  const config = {
    method: 'post',
    url: baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  try {
    const response = await axios(config);
    const transactionReceipts = response.data;

    // Return the timestamp or modify as per your requirements
    res.status(200).json({ transactionReceipts });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'An error occurred while fetching receipts.' });
  }
}
