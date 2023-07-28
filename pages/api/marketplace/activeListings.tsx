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
    const { address } = req.query;
    const nfts: any = [];
    listings.forEach((listing: any) => {
      if (listing.sellerAddress.includes(address)) {
        return nfts.push(listing);
      }
    });

    const nftsWithBid = await Promise.all(
      nfts.map(async (nft: any) => {
        if (nft.type === 0) {
          // For type === 0 (non-auction listings)
          return {
            ...nft,
            highestBid: null,
            offers: [],
          };
        }

        // For type === 1 (auction listings)
        const highestBid = await contract.auction.getWinningBid(nft.id);
        const getOffers = await contract.getOffers(nft.id);

        return {
          ...nft,
          highestBid,
          offers: getOffers,
        };
      })
    );

    res.status(200).json({ nfts: nftsWithBid });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
