import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

{
  /* 
  Measured in seconds (e.g. 15 minutes or 900 seconds). 
  If a winning bid is made within the buffer of the auction closing 
  (e.g. 15 minutes within the auction closing), the auction's closing 
  time is increased by the buffer to prevent buyers from making last 
  minute winning bids, and to give time to other buyers to make a higher 
  bid if they wish to.
   */
}
const { MARKETPLACE, NETWORK } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const { bufferInSeconds } = req.query;
    const setTimeBuffer = await contract.setTimeBufferInSeconds(bufferInSeconds as string);
    res.status(200).json({ setTimeBuffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
