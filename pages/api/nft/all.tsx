import { paramCase } from 'change-case';
import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import cors from '../../../src/utils/cors';

const { NFT_COLLECTION } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (!NFT_COLLECTION) {
      return res.status(500).send('Missing required environment variables');
    }

    const { chainId, name } = req.query;

    if (!chainId) {
      return res.status(400).json({ message: 'Missing chain ID' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Missing product name' });
    }

    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const nfts = await contract.getAll();

    const productNameInParamCase = paramCase(name as string);
    const product = nfts.find(
      (_product: any) => paramCase(_product.metadata.name) === productNameInParamCase
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
