import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { alchemyNetwork, address } = req.query;

  try {
    const blockNumRes = await axios.post(
      `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 0,
      }
    );

    const blockNum = parseInt(blockNumRes.data.result, 16);

    let low = 0;
    let high = blockNum;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      const codeRes = await axios.post(
        `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
        {
          jsonrpc: '2.0',
          method: 'eth_getCode',
          params: [address as string, 'latest'],
          id: 0,
        }
      );
      const code = codeRes.data.result;

      if (code === '0x') {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    const receiptRes = await axios.post(
      `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      {
        jsonrpc: '2.0',
        method: 'alchemy_getTransactionReceipts',
        params: [
          {
            blockNumber: `0x${high.toString(16)}`,
          },
        ],
        id: 1,
      }
    );
    const receipts = receiptRes.data.result.receipts;

    for (const receipt of receipts) {
      if (receipt.contractAddress === (address as string).toLowerCase()) {
        res.status(200).json({ deployer: receipt.from, blockNumber: high });
        return;
      }
    }

    res.status(404).json({ error: 'Contract not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
