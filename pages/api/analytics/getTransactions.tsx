import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK, NFT_COLLECTION, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  try {
    if (!NETWORK || !NFT_COLLECTION) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, NETWORK, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');

    const events = await contract.events.getEvents('Transfer');

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
