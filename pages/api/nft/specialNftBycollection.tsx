import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { collectionAddress, chainId } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(collectionAddress as string);
    const nfts = await contract.erc1155.getAll();
    res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
