import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NFT_COLLECTION, NETWORK } = process.env;
// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !NFT_COLLECTION) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(NFT_COLLECTION, 'nft-collection');
    const { id } = req.body;
    const burnNftResult = await contract.burn(id);
    res.status(200).json({ result: burnNftResult });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
