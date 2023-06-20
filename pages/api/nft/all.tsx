import { paramCase } from 'change-case';
import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import cors from '../../../src/utils/cors';

const { NFT_COLLECTION, NETWORK } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NFT_COLLECTION) {
      return res.status(500).send('Missing required environment variables');
    }
    const { chainId } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const nfts = await contract.getAll();

    const { name } = req.query;

    const product = nfts.find((_product: any) => paramCase(_product.metadata.name) === name);
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
