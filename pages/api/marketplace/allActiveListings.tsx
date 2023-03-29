import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { IListing } from 'src/types/marketplace';

const { MARKETPLACE, NETWORK } = process.env;

export default async function handler(req: IListing, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const nfts = await contract.getActiveListings();
    res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
