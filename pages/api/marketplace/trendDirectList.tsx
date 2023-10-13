import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK, DirectListingV3 } from '@thirdweb-dev/sdk';
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

    const validListings = await contract.directListings.getAllValid();

    const trendingDirectListings = await Promise.all(
      validListings.map(async (directListing: DirectListingV3) => {
        // Listings with a price per token greater than 50 are considered trending
        const pricePerToken = parseFloat(directListing.currencyValuePerToken.displayValue);

        if (pricePerToken > 30) {
          return { directListing };
        }
        return null;
      })
    );

    // Sort the trending direct listings based on the custom sorting strategy
    trendingDirectListings;

    // Extract only the direct listings from the trendingDirectListings array
    const trendingListingsResponse = trendingDirectListings
      .filter((entry) => entry !== null)
      .map((entry) => (entry as { directListing: DirectListingV3 }).directListing);

    res.status(200).json({ trendingDirectListings: trendingListingsResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
