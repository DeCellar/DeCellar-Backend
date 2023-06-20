import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import axios from '../../../src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { alchemyNetwork, fromAddress, toAddress, count } = req.query;

  const baseURL = `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`;

  const countHex = count ? `0x${Number(count).toString(16)}` : '0x3e8';

  const fromRequestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        category: ['external'],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: countHex,
        order: 'desc',
        fromAddress: fromAddress as string,
      },
    ],
  };

  const toRequestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        category: ['erc20', 'erc721', 'erc1155'],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: countHex,
        order: 'desc',
        toAddress: toAddress as string,
      },
    ],
  };

  const toConfig = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: toRequestBody,
  };

  const fromConfig = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: fromRequestBody,
  };

  try {
    // API requests in parallel
    const [toResponse, fromResponse] = await Promise.all([axios(toConfig), axios(fromConfig)]);
    const transfers = [...fromResponse.data.result.transfers, ...toResponse.data.result.transfers];

    // Sort the transfers array by timestamp in descending order
    transfers.sort((a, b) => {
      const aTimestamp = new Date(a.metadata.blockTimestamp).getTime();
      const bTimestamp = new Date(b.metadata.blockTimestamp).getTime();
      return bTimestamp - aTimestamp;
    });

    res.status(200).json({ transfers });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
