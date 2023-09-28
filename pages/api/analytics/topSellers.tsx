import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import initializeFirebaseServer from '../../../src/firebase/initAdmin';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

type TimeIntervalKeys = '1hr' | '6hr' | '24hr' | '7days' | '30days';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  try {
    const { network, marketplace, address, alchemyNetwork } = req.query;

    if (!network || !marketplace || !address) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const provider = new ethers.providers.JsonRpcProvider(
      `https://${alchemyNetwork}}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`
    );

    const contract = await sdk.getContract(marketplace as string, 'marketplace');
    const events = await contract.events.getEvents('NewSale');
    const { db } = initializeFirebaseServer();

    const ownerSales: Record<string, any> = {};
    const ownerDetailsCache: Record<string, any> = {};

    const timeIntervals: Record<TimeIntervalKeys, number> = {
      '1hr': 60 * 60,
      '6hr': 6 * 60 * 60,
      '24hr': 24 * 60 * 60,
      '7days': 7 * 24 * 60 * 60,
      '30days': 30 * 24 * 60 * 60,
    };

    const initializeHourlySales = (hours: number) => new Array(hours).fill(0);

    const salesByInterval: Record<
      TimeIntervalKeys,
      {
        salesVolume: number;
        uniqueListers: Set<string>;
        hourlySales?: number[];
        dailySales?: number[];
      }
    > = {
      '1hr': { salesVolume: 0, uniqueListers: new Set(), hourlySales: new Array(1).fill(0) },
      '6hr': { salesVolume: 0, uniqueListers: new Set(), hourlySales: new Array(6).fill(0) },
      '24hr': { salesVolume: 0, uniqueListers: new Set(), hourlySales: new Array(24).fill(0) },
      '7days': { salesVolume: 0, uniqueListers: new Set(), dailySales: new Array(7).fill(0) },
      '30days': { salesVolume: 0, uniqueListers: new Set(), dailySales: new Array(30).fill(0) },
    };

    const currentTime = Math.floor(Date.now() / 1000);
    const blocks = await Promise.all(
      events.map((event) => provider.getBlock(event.transaction.blockNumber))
    );

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const block = blocks[i];
      const timestamp = block.timestamp;
      const saleVolume = Number(event.data.totalPricePaid) / 1e18;

      for (const interval of Object.keys(timeIntervals) as TimeIntervalKeys[]) {
        if (currentTime - timestamp <= timeIntervals[interval]) {
          salesByInterval[interval].salesVolume += saleVolume;
          salesByInterval[interval].uniqueListers.add(event.data.buyer);

          if (interval === '7days' || interval === '30days') {
            const dayDiff = Math.floor((currentTime - timestamp) / (60 * 60 * 24));
            salesByInterval[interval].dailySales![dayDiff] += saleVolume;
          } else {
            const hourDiff = Math.floor((currentTime - timestamp) / (60 * 60));
            salesByInterval[interval].hourlySales![hourDiff] += saleVolume;
          }
        }
      }

      const listerContract = event.data.assetContract;
      const contractOwner = await sdk.getContract(listerContract, 'multiwrap');
      const owner = await contractOwner.owner.get();

      if (!ownerSales[owner]) {
        ownerSales[owner] = { totalSalesVolume: 0, ownerDetails: {} };
      }

      ownerSales[owner].totalSalesVolume += saleVolume;

      if (!ownerDetailsCache[owner]) {
        const userRef = db.collection('users').doc(owner);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          ownerDetailsCache[owner] = {
            displayName: userData?.displayName,
            photoURL: userData?.photoURL,
            state: userData?.state,
            email: userData?.email,
          };
          ownerSales[owner].ownerDetails = ownerDetailsCache[owner];
        } else {
          delete ownerSales[owner];
        }
      } else {
        ownerSales[owner].ownerDetails = ownerDetailsCache[owner];
      }
    }

    const responseArray = Object.keys(ownerSales)
      .map((owner) => ({
        owner,
        ...ownerSales[owner],
      }))
      .sort((a, b) => b.totalSalesVolume - a.totalSalesVolume);

    // Convert sets of unique listers to counts and ensure the arrays are of correct length
    for (const interval of Object.keys(timeIntervals) as TimeIntervalKeys[]) {
      salesByInterval[interval].uniqueListers = salesByInterval[interval].uniqueListers.size as any; // Cast Set size to fit in the structure

      if (salesByInterval[interval].hourlySales) {
        // Calculate the expected length of hourlySales based on the interval
        const expectedHourlyLength = timeIntervals[interval] / 3600;
        while (salesByInterval[interval].hourlySales!.length < expectedHourlyLength) {
          salesByInterval[interval].hourlySales!.push(0);
        }
      }

      if (salesByInterval[interval].dailySales) {
        // Calculate the expected length of dailySales based on the interval
        const expectedDailyLength = timeIntervals[interval] / (3600 * 24);
        while (salesByInterval[interval].dailySales!.length < expectedDailyLength) {
          salesByInterval[interval].dailySales!.push(0);
        }
      }
    }

    const result = responseArray.map((singleUserSales) => {
      const intervals = Object.keys(timeIntervals).map((intervalKey) => {
        const interval = intervalKey as TimeIntervalKeys;
        return {
          name: interval,
          salesVolume: salesByInterval[interval].salesVolume,
          uniqueListers: salesByInterval[interval].uniqueListers.size,
          sales: salesByInterval[interval].dailySales || salesByInterval[interval].hourlySales,
        };
      });

      return {
        address: singleUserSales.owner,
        displayName: singleUserSales.ownerDetails.displayName,
        photoURL: singleUserSales.ownerDetails.photoURL,
        state: singleUserSales.ownerDetails.state,
        email: singleUserSales.ownerDetails.email,
        totalSalesVolume: singleUserSales.totalSalesVolume,
        intervals: intervals,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
