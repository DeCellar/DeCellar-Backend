import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { MARKETPLACE, NETWORK } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const { listingId, pricePerToken, quantity } = req.query;
    const makeOffer = await contract.makeOffer(
      listingId as string,
      pricePerToken as string,
      quantity as string
    );
    res.status(200).json({ makeOffer });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
