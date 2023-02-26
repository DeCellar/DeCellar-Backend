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

    const { address } = req.query;

    const listings: any = [];
    listedNFT.forEach((listing: any) => {
      if (listing.sellerAddress.includes(address)) {
        return listings.push(listing);
      }
    });

    // Calculate the start and end dates of this week and last week
    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(thisWeekStart.getTime() - 1 * 24 * 60 * 60 * 1000);

    // Filter the listings based on the dates
    const presentWeekListings = await listings.filter((listing: any) => {
      const listingDate = new Date(
        parseInt(
          listing.type == 1
            ? listing.startTimeInEpochSeconds._hex
            : listing.startTimeInSeconds._hex,
          16
        ) * 1000
      );

      return listingDate >= thisWeekStart;
    });

    const lastWeekListings = await listings.filter((listing: any) => {
      const listingDate = new Date(
        parseInt(
          listing.type == 1
            ? listing.startTimeInEpochSeconds._hex
            : listing.startTimeInSeconds._hex,
          16
        ) * 1000
      );

      return listingDate >= lastWeekStart && listingDate <= lastWeekEnd;
    });

    // Count the number of listings for each day in this week and last week
    const presentWeekListingCountsArray = [0, 0, 0, 0, 0, 0, 0];
    const lastWeekListingCountsArray = [0, 0, 0, 0, 0, 0, 0];

    presentWeekListings.forEach((listing: any) => {
      const dayIndex = new Date(
        parseInt(
          listing.type == 1
            ? listing.startTimeInEpochSeconds?._hex
            : listing.startTimeInSeconds._hex,
          16
        ) * 1000
      ).getDay();
      presentWeekListingCountsArray[dayIndex]++;
    });

    lastWeekListings.forEach((listing: any) => {
      const dayIndex = new Date(
        parseInt(
          listing.type == 1
            ? listing.startTimeInEpochSeconds?._hex
            : listing.startTimeInSeconds._hex,
          16
        ) * 1000
      ).getDay();
      lastWeekListingCountsArray[dayIndex]++;
    });

    const sumPresentWeek = fSumArray(presentWeekListingCountsArray);
    const sumLastWeek = fSumArray(lastWeekListingCountsArray);
    const growth = fPercentChange(sumLastWeek, sumPresentWeek);

    // Construct the response object
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
      totalListing: {
        count: listings.length,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
