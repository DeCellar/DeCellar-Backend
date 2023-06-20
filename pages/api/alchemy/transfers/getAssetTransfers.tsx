import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../../src/utils/cors';
import axios from '../../../../src/utils/axios';

// Alchemy URL --> Replace with your API key at the end

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { fromAddress, toAddress, alchemyNetwork, type } = req.query;

  const baseURL = `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`;

  const addressParam = fromAddress ? { fromAddress } : toAddress ? { toAddress } : {};

  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        category: [type as string],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: '0x3e8',
        order: 'desc',
        ...addressParam,
      },
    ],
  };

  // config object for making a request with axios
  const config = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  try {
    // Make the request and send the response back to the client
    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
