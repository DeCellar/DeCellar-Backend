import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import {
  ThirdwebSDK,
  DirectListingV3,
  EnglishAuction,
  OfferV3,
  Offer,
  MarketplaceV3,
  Bid,
} from '@thirdweb-dev/sdk';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, marketplace, address } = req.query;

    if (!network || !marketplace || !address) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const contract = await sdk.getContract(marketplace as string, 'marketplace-v3');

    const directListings = await contract.directListings.getAll({
      tokenContract: address as string,
    });
    const auctionListings = await contract.englishAuctions.getAll({
      tokenContract: address as string,
    });

    const floorPrice = (await findFloorPrice(directListings, auctionListings, contract)) || 0;

    return res.status(200).json({ floorPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

export const findFloorPrice = async (
  directListings: DirectListingV3[],
  auctionListings: EnglishAuction[],
  contract: MarketplaceV3
): Promise<number> => {
  // For direct listings, get the pricePerToken from currencyValuePerToken.displayValue
  const directListingPrices = directListings.map((listing) =>
    parseFloat(listing.currencyValuePerToken?.displayValue || '0')
  );

  // For auction listings, fetch its highest bid and get its price
  const auctionPrices = await Promise.all(
    auctionListings.map(async (auction) => {
      const highestBid = await contract.englishAuctions.getWinningBid(auction.id);
      return parseFloat(highestBid?.bidAmountCurrencyValue.displayValue || '0');
    })
  );

  // Combine both lists and find the minimum price
  const allPrices = [...directListingPrices, ...auctionPrices];
  const floorPrice = Math.min(...allPrices);

  return floorPrice;
};
