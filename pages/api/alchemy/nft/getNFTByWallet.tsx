import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../../src/utils/cors';
import axios from '../../../../src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { address, alchemyNetwork, metadata } = req.query;

  const baseURL = `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}/getNFTs`;

  try {
    // Make the request and send the response back to the client
    const response = await axios.get(baseURL, {
      params: {
        owner: address as string,
        withMetadata: metadata || false,
        orderBy: 'transferTime',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error });
  }
}
