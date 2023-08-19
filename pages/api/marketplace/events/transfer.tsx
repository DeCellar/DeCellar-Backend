import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK, MARKETPLACE } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }

    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');

    const events = await contract.events.getEvents('Transfer');

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
