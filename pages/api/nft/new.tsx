import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK('mumbai');

  const contract = await sdk.getContract(`${process.env.NFT_COLLECTION}`, 'nft-collection');

  const { address, metadata } = req.query;

  const createNFT = await contract.mintTo(address as string, metadata as any);
  res.status(200).json({ createNFT });
}
