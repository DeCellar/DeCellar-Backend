import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

const { NETWORK, MARKETPLACE, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }

    const userAddress = req.query.userAddress as string; // Get user address from query parameter

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, NETWORK, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API}`
    );

    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const events = await contract.events.getEvents('NewSale');

    let totalSoldItems = 0;
    let totalSoldPrice = 0;

    // Create arrays for sold prices of the current week and the previous week
    const currentWeekSoldPrices = new Array(7).fill(0);
    const previousWeekSoldPrices = new Array(7).fill(0);

    const currentTime = Math.floor(Date.now() / 1000);

    // Fetch blocks in parallel
    const blockPromises = events.map((event) => provider.getBlock(event.transaction.blockNumber));
    const blocks = await Promise.all(blockPromises);

    const userAddressesSet = new Set([userAddress]);

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

    // Construct the response
    const response = {
      userAddress: userAddress,
      totalSoldItems: totalSoldItems,
      totalSoldPrice: totalSoldPrice,
      currentWeekSoldPrices: currentWeekSoldPrices,
      previousWeekSoldPrices: previousWeekSoldPrices,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
