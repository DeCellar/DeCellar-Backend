import { paramCase } from 'change-case';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const sdk = new ThirdwebSDK('mumbai');

    const contract = await sdk.getContract(`${process.env.NFT_COLLECTION}`, 'nft-collection');
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
