import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK(process.env.NETWORK as string);

  const contract = await sdk.getContract(`${process.env.NFT_COLLECTION}`, 'nft-collection');

  const getMinters = await contract.roles.get('minter');
  res.status(200).json({ getMinters });
}
