import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK('mumbai');
  const contract = await sdk.getContract(`${process.env.MARKETPLACE}`, 'marketplace');

  const { _listingId, _closeFor } = req.query;

  const closeAuction = contract.auction.closeListing(_listingId as string, _closeFor as string);
  res.status(200).json({ closeAuction });
}
