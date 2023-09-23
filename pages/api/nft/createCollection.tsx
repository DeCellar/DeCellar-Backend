import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

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

    const { chainId } = req.query;
    if (!chainId) {
      return res.status(500).send('Missing chain id');
    }

    const { metadata } = req.query;
    const createCollection = await sdk.deployer.deployNFTCollection(metadata as any);
    return res.status(200).json({ createCollection });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
