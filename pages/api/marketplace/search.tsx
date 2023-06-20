import { paramCase } from 'change-case';
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
    const listings = await contract.getActiveListings();
    const { name } = req.query;
    const cleanQuery = `${name}`.toLowerCase().trim();
    const nfts: any = [];
    listings.forEach((listing: any) => {
      if (!name) {
        return nfts.push(listing);
      }
      if (listing.asset.name.toLowerCase().includes(cleanQuery)) {
        return nfts.push(listing);
      }
    });
    res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
