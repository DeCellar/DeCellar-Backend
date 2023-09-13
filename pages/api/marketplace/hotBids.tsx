import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { MARKETPLACE, NETWORK, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, NETWORK, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const nfts = await contract.getActiveListings();

    const nftsWithBid = await Promise.all(
      nfts
        .filter((nft) => nft.type === 1) // Filter for type=1
        .map(async (nft) => {
          const highestBid = await contract.auction.getWinningBid(nft.id);
          const getOffers = await contract.getOffers(nft.id);

          return {
            highestBid,
            offers: getOffers,
            ...nft,
          };
        })
    );

    const nftsWithHighestBid = nftsWithBid.sort((a, b) => {
      const aBid = Number(a?.highestBid?.currencyValue?.value || 0);
      const bBid = Number(b?.highestBid?.currencyValue?.value || 0);
      return bBid - aBid;
    });

    const output = { hotBids: nftsWithHighestBid };
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
