import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { collectionAddress, chainId } = req.query;
    if (!collectionAddress || !chainId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, chainId as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(collectionAddress as string);
    const nfts = await contract.erc1155.getAll();

    return res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
