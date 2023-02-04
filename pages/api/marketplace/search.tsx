import { paramCase } from 'change-case';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    const sdk = new ThirdwebSDK('mumbai');

    const contract = await sdk.getContract(`${process.env.MARKETPLACE}`, 'marketplace');

    const listings = await contract.getActiveListings();

    const { address, name } = req.query;

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
