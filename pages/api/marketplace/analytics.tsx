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

    const tradingStats = getTradingStats(nftsWithBid, collectionAddress as string);

    return res.status(200).json({ tradingStats });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Function to calculate trading statistics for different time periods
const getTradingStats = (listings: any, collectionAddress: string) => {
  const now = Date.now();
  const startOfToday = new Date().setHours(0, 0, 0, 0); // Fix: Set to the start of the day (midnight)
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = oneDay * 7;
  const thirtyDays = oneDay * 30;
  const ninetyDays = oneDay * 90;

  const soldListingsForCollection = listings.filter(
    (listing: any) =>
      listing.assetContractAddress === collectionAddress &&
      listing.status === 'sold' &&
      startOfToday - listing.endTimeInEpochSeconds.toNumber() * 1000 <= ninetyDays // Fix: Check against the endTimeInEpochSeconds
  );

  const calculateStats = (timePeriod: number) => {
    const filteredListings = soldListingsForCollection.filter(
      (listing: any) => startOfToday - listing.endTimeInEpochSeconds.toNumber() * 1000 <= timePeriod // Fix: Check against the endTimeInEpochSeconds
    );

    if (filteredListings.length === 0) {
      return {
        totalSalesVolume: 0,
        numberOfSales: 0,
        averagePrice: 0,
        tradingVolume: 0,
        currencySymbol: '', // Assuming the currency symbol is already present in the response
      };
    }

    let totalSalesVolume = 0;
    let numberOfSales = 0;
    let tradingVolume = 0;
    let currencySymbol = ''; // Currency symbol of the sales

    filteredListings.forEach((listing: any) => {
      if (listing.type === 0) {
        // For type === 0 (direct sale)
        numberOfSales += listing.quantity.toNumber();
        tradingVolume += listing.quantity.toNumber();
        currencySymbol = listing.buyoutCurrencyValuePerToken.currencySymbol; // Assuming the currency symbol is present in buyoutCurrencyValuePerToken
      } else if (listing.type === 1) {
        // For type === 1 (auction)
        const winningBid = listing.highestBid;
        if (winningBid) {
          totalSalesVolume += parseFloat(winningBid.totalPrice.displayValue);
          numberOfSales += 1;
          tradingVolume += 1;
          currencySymbol = winningBid.totalPrice.currencySymbol; // Assuming the currency symbol is present in totalPrice
        }
      }
    });

    const averagePrice = totalSalesVolume / numberOfSales;

    return {
      totalSalesVolume,
      numberOfSales,
      averagePrice,
      tradingVolume,
      currencySymbol,
    };
  };

  return {
    oneDay: calculateStats(oneDay),
    oneWeek: calculateStats(oneWeek),
    thirtyDays: calculateStats(thirtyDays),
    ninetyDays: calculateStats(ninetyDays),
    allTime: calculateStats(now - startOfToday), // Fix: Calculate the time difference from the start of today
  };
};
