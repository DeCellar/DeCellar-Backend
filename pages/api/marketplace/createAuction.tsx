import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
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

    const {
      assetContractAddress,
      tokenId,
      startTimestamp,
      listingDurationInSeconds,
      quantity,
      currencyContractAddress,
      buyoutPricePerToken,
      reservePricePerToken,
    } = req.query;

    const auction = {
      assetContractAddress,
      tokenId,
      startTimestamp,
      listingDurationInSeconds,
      quantity,
      currencyContractAddress,
      buyoutPricePerToken,
      reservePricePerToken,
    };

    const createAuction = await contract.auction.createListing(auction as any);
    res.status(200).json({ createAuction });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
