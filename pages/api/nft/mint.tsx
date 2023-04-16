import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NFT_COLLECTION } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NFT_COLLECTION) {
      return res.status(500).send('Missing required environment variables');
    }
    const { chainId } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const { address, metadata } = req.query;
    const createNFT = await contract.mintTo(address as string, metadata as any);
    res.status(200).json({ createNFT });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
