import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { fPercentChange, fSumArray } from 'src/utils/math';

const { NETWORK, NFT_COLLECTION, PRIVATE_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  try {
    if (!NETWORK || !NFT_COLLECTION) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }

    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const { address } = req.query;
    const nfts: any[] = await contract.getOwned(address as string);

    // Get NFTs for this week and last week
    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(thisWeekStart.getTime() - 1 * 24 * 60 * 60 * 1000);
    const presentWeekNFTs = nfts.filter((nft) => {
      const nftDate = new Date(nft?.metadata?.createdAt);
      return nftDate >= thisWeekStart;
    });
    const lastWeekNFTs = nfts.filter((nft) => {
      const nftDate = new Date(nft?.metadata?.createdAt);
      return nftDate >= lastWeekStart && nftDate <= lastWeekEnd;
    });

    // Count the number of NFTs for each day in this week and last week
    const presentWeekNftCountsArray = Array(7).fill(0);
    const lastWeekNftCountsArray = Array(7).fill(0);

    for (const nft of presentWeekNFTs) {
      const dayIndex = new Date(nft?.metadata?.createdAt).getDay();
      presentWeekNftCountsArray[dayIndex]++;
    }

    for (const nft of lastWeekNFTs) {
      const dayIndex = new Date(nft?.metadata?.createdAt).getDay();
      lastWeekNftCountsArray[dayIndex]++;
    }

    // Calculate the growth percentage
    const sumPresentWeek = fSumArray(presentWeekNftCountsArray);
    const sumLastWeek = fSumArray(lastWeekNftCountsArray);
    const growth = fPercentChange(sumLastWeek, sumPresentWeek);

    // Construct the response object
    const response = {
      presentWeek: {
        nfts: presentWeekNftCountsArray,
        count: sumPresentWeek,
      },
      lastWeek: {
        nfts: lastWeekNftCountsArray,
        count: sumLastWeek,
      },
      growthPercent: growth,
      totalNFT: {
        count: nfts.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
