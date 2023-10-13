import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import cors from '../../../src/utils/cors';

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
    const contract = await sdk.getContract(marketplace as string, 'marketplace-v3');

    const validListings = await contract.englishAuctions.getAllValid();

    const trendingAuctions = await Promise.all(
      validListings.map(async (auction) => {
        const winningBid = await contract.englishAuctions.getWinningBid(auction.id);

        if (winningBid) {
          const { bidAmount } = winningBid;
          const bidAmountValue = parseFloat(bidAmount);
          if (bidAmountValue >= 50) {
            return { auction, winningBid };
          }
        }
        return null;
      })
    );

    trendingAuctions;

    res.status(200).json({ trendingAuctions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
