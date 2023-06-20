import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import axios from '../../../src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { alchemyNetwork, collectionAddress, tokenId } = req.query;

  const baseURL = `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}/getNFTMetadata`;

  try {
    // Make the request and send the response back to the client
    const response = await axios.get(baseURL, {
      params: {
        contractAddress: collectionAddress as string,
        tokenId: tokenId as string,
      },
    });
    console.log(response);

    res.status(200).json(response.data);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error });
  }
}
