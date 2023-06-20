import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../src/utils/cors';
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
    const nfts = await contract.getActiveListings();

    const nftsWithBid = await Promise.all(
      nfts
        .filter((nft) => nft.type === 1) // Filter for type=1
        .map(async (nft) => {
          const highestBid = await contract.auction.getWinningBid(nft.id);
          return {
            highestBid: highestBid?.currencyValue?.displayValue || '0',
            ...nft,
          };
        })
    );

    const nftsWithHighestBid = nftsWithBid.sort((a, b) => {
      return parseFloat(b.highestBid) - parseFloat(a.highestBid);
    });

    const output = { hotBids: nftsWithHighestBid };
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
