import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { fPercentChange, fSumArray } from 'src/utils/math';

const { MARKETPLACE, NETWORK } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (!NETWORK || !MARKETPLACE) {
      throw new Error('Missing required environment variables');
    }

    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const listedNFT = await contract.getAllListings();
    const activeListing = await contract.getActiveListings();
    const { address } = req.query;

    const active = activeListing.filter((listing: any) => listing.sellerAddress.includes(address));
    const listings = listedNFT.filter((listing: any) => listing.sellerAddress.includes(address));

    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(thisWeekStart.getTime() - 1 * 24 * 60 * 60 * 1000);

    const filterListingsByDates = (listings: any[], startDate: Date, endDate?: Date) =>
      listings.filter((listing: any) => {
        const listingDate = new Date(
          parseInt(
            listing.type == 1
              ? listing.startTimeInEpochSeconds?._hex
              : listing.startTimeInSeconds._hex,
            16
          ) * 1000
        );

        return listingDate >= startDate && (!endDate || listingDate <= endDate);
      });

    const presentWeekListings = filterListingsByDates(listings, thisWeekStart);
    const lastWeekListings = filterListingsByDates(listings, lastWeekStart, lastWeekEnd);

    const countListingsByDay = (listings: any[]) => {
      const listingCountsArray = [0, 0, 0, 0, 0, 0, 0];

      listings.forEach((listing: any) => {
        const dayIndex = new Date(
          parseInt(
            listing.type == 1
              ? listing.startTimeInEpochSeconds?._hex
              : listing.startTimeInSeconds._hex,
            16
          ) * 1000
        ).getDay();

        listingCountsArray[dayIndex]++;
      });

      return listingCountsArray;
    };

    const presentWeekListingCountsArray = countListingsByDay(presentWeekListings);
    const lastWeekListingCountsArray = countListingsByDay(lastWeekListings);

    const sumPresentWeek = fSumArray(presentWeekListingCountsArray);
    const sumLastWeek = fSumArray(lastWeekListingCountsArray);
    const growth = fPercentChange(sumLastWeek, sumPresentWeek);

    const response = {
      presentWeek: {
        listings: presentWeekListingCountsArray,
        count: sumPresentWeek,
      },
      lastWeek: {
        listings: lastWeekListingCountsArray,
        count: sumLastWeek,
      },
      growthPercent: growth,
      total: {
        all: listings.length,
        active: active.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
