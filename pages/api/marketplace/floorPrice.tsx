import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

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

    // Get the collection address from the request query parameters
    const collectionAddress = req.query.address;

    if (!collectionAddress) {
      return res.status(400).send('Collection address parameter is missing');
    }

    const { floorPrice, currencySymbol } = getFloorPriceAndCurrencySymbol(
      nftsWithBid,
      collectionAddress as string
    );

    if (floorPrice === null) {
      return res.status(404).send('Collection not found');
    }

    return res.status(200).json({ floorPrice, currencySymbol });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Function to get the floor price and currency symbol of a collection
const getFloorPriceAndCurrencySymbol = (listings: any, collectionAddress: string) => {
  const listingsForCollection = listings.filter(
    (listing: any) => listing.assetContractAddress === collectionAddress
  );

  if (listingsForCollection.length === 0) {
    // No listings found for the collection
    return { floorPrice: null, currencySymbol: null };
  }

  // Filter out listings that have a valid buyoutCurrencyValuePerToken (for type === 0)
  const validDirectSaleListings = listingsForCollection.filter(
    (listing: any) => listing.type === 0 && listing.buyoutCurrencyValuePerToken !== null
  );

  // Filter out listings that have a valid highestBid (for type === 1 - auction listings)
  const validAuctionListings = listingsForCollection.filter(
    (listing: any) => listing.type === 1 && listing.highestBid !== null
  );

  let floorPrice = null;
  let currencySymbol = null;

  // Calculate the floor price based on the type
  if (validDirectSaleListings.length > 0) {
    floorPrice = Math.min(
      ...validDirectSaleListings.map((listing: any) =>
        parseFloat(listing.buyoutCurrencyValuePerToken.displayValue)
      )
    );
    currencySymbol = validDirectSaleListings[0].buyoutCurrencyValuePerToken.symbol;
  } else if (validAuctionListings.length > 0) {
    floorPrice = Math.max(
      ...validAuctionListings.map((listing: any) =>
        parseFloat(listing.highestBid.amount.displayValue)
      )
    );
    currencySymbol = validAuctionListings[0].highestBid.amount.symbol;
  }

  return { floorPrice, currencySymbol };
};
