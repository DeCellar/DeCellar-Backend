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
