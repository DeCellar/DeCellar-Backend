import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, marketplace } = req.query;

    if (!network || !marketplace) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(marketplace as string, 'marketplace');

    const getAllListings = await contract.getAllListings();

    const nftsWithBid = await Promise.all(
      getAllListings.map(async (nft) => {
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

    return res.status(200).json({ getAllListings: nftsWithBid });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
