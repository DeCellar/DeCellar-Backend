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
    const { assetContractAddress } = req.query;

    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const getAllListings = await contract.getAllListings();

    const filteredListings = getAllListings.filter(
      (listing) => listing.assetContractAddress === assetContractAddress
    );

    const nftsWithBid = await Promise.all(
      filteredListings.map(async (nft) => {
        if (nft.type !== 1) {
          return {
            ...nft,
            highestBid: null,
            offers: [],
          };
        }

        const highestBid = await contract.auction.getWinningBid(nft.id);
        const getOffers = await contract.getOffers(nft.id);

        return {
          ...nft,
          highestBid,
          offers: getOffers,
        };
      })
    );

    return res.status(200).json({ getAllListings: nftsWithBid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
