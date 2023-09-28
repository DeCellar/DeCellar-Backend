import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

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

    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API}`
    );

    const contract = await sdk.getContract(marketplace as string, 'marketplace');
    const events = await contract.events.getEvents('NewSale');

    let totalSoldItems = 0;
    let totalSoldPrice = 0;

    const currentWeekSoldPrices = new Array(7).fill(0);
    const previousWeekSoldPrices = new Array(7).fill(0);

    const currentTime = Math.floor(Date.now() / 1000);

    const blockPromises = events.map((event) => provider.getBlock(event.transaction.blockNumber));
    const blocks = await Promise.all(blockPromises);

    const userAddressesSet = new Set([address]);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const block = blocks[i];
      const timestamp = block.timestamp;
      const saleVolume = Number(event.data.totalPricePaid) / 1e18;

      if (userAddressesSet.has(event.data.buyer)) {
        // Check if the buyer address matches the user's address
        totalSoldItems++;
        totalSoldPrice += saleVolume;

        // Calculate the time interval (in days) between the sale and current time
        const timeInterval = Math.floor((currentTime - timestamp) / (60 * 60 * 24));

        if (timeInterval >= 0 && timeInterval < 14) {
          // Determine if the sale occurred in the current week or the previous week
          if (timeInterval < 7) {
            // Sale occurred in the current week
            currentWeekSoldPrices[timeInterval] += saleVolume;
          } else {
            // Sale occurred in the previous week
            previousWeekSoldPrices[timeInterval - 7] += saleVolume;
          }
        }
      }
    }

    // Calculate the percentage growth from the previous week
    const percentageGrowth = calculatePercentageGrowth(
      currentWeekSoldPrices,
      previousWeekSoldPrices
    );

    const response = {
      userAddress: address,
      totalSoldItems: totalSoldItems,
      totalSoldPrice: totalSoldPrice,
      currentWeekSoldPrices: currentWeekSoldPrices,
      previousWeekSoldPrices: previousWeekSoldPrices,
      percentageGrowth: percentageGrowth,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Function to calculate percentage growth
function calculatePercentageGrowth(currentWeek: number[], previousWeek: number[]): number {
  const currentWeekTotal = currentWeek.reduce((total, price) => total + price, 0);
  const previousWeekTotal = previousWeek.reduce((total, price) => total + price, 0);

  if (previousWeekTotal === 0) {
    return 0; // To avoid division by zero
  }

  return ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;
}
