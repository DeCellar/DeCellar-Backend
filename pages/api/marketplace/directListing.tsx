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
    const {
      assetContractAddress,
      tokenId,
      startTimestamp,
      listingDurationInSeconds,
      quantity,
      currencyContractAddress,
      buyoutPricePerToken,
    } = req.query;

    const listing = {
      assetContractAddress,
      tokenId,
      startTimestamp,
      listingDurationInSeconds,
      quantity,
      currencyContractAddress,
      buyoutPricePerToken,
    };
    const directListing = await contract?.direct.createListing(listing as any);
    res.status(200).json({ directListing });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
