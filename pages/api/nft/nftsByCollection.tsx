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
    const { collectionAddress, address } = req.query;

    console.log(collectionAddress, address);
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(collectionAddress as string, 'nft-collection');

    const nfts = await contract.erc721.getOwned(address as string);
    console.log(nfts);
    res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
