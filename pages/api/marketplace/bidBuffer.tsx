import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

{
  /* A percentage (e.g. 5%) in basis points (5% = 500, 100% = 10000).
   A new bid is considered to be a winning bid only if its bid amount 
   is at least the bid buffer (e.g. 5%) greater than the previous winning 
   bid. This prevents buyers from making very slightly higher bids to win 
   the auctioned items. 
   */
}
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
    const { bufferBps } = req.query;
    const setBidBuffer = await contract.setBidBufferBps(bufferBps as any);
    res.status(200).json({ setBidBuffer });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
