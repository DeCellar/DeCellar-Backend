import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK('mumbai');

  const contract = await sdk.getContract(`${process.env.MARKETPLACE}`, 'marketplace');

  const listings = await contract.getActiveListings();

  const { address } = req.query;

  const nfts: any = [];

  listings.forEach((listing: any) => {
    if (listing.sellerAddress.includes(address)) {
      return nfts.push(listing);
    }
  });

  res.status(200).json({ nfts });
}
