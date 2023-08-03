import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { collectionAddress, address, chainId } = req.query;

    if (!collectionAddress || !address || !chainId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(collectionAddress as string, 'nft-collection');
    const nfts = await contract.erc721.getOwned(address as string);

    return res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
