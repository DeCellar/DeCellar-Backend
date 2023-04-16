import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { chainId } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
    const { metadata } = req.query;
    const createCollection = await sdk.deployer.deployNFTCollection(metadata as any);
    return res.status(200).json({ createCollection });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
