import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

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

    const { address, chainId } = req.query;

    if (!chainId) {
      return res.status(500).send('Missing chain ID');
    }

    if (!address) {
      return res.status(500).send('Missing contract address');
    }

    const contract = await sdk.getContract(address as string, 'nft-collection');
    const metadata: any = await contract.metadata.get();

    return res.status(200).json({ metadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
