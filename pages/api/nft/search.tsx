import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const sdk = new ThirdwebSDK('mumbai');

    const contract = await sdk.getContract(`${process.env.NFT_COLLECTION}`, 'nft-collection');
    const { tokenId } = req.query;
    const nft = await contract.get(tokenId as string);

    res.status(200).json({ nft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
