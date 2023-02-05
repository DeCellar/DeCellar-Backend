import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK, NFT_COLLECTION } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !NFT_COLLECTION) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const { tokenId } = req.query;
    const nft = await contract.get(tokenId as string);
    res.status(200).json({ nft });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
