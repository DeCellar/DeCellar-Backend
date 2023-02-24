import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK(process.env.NETWORK as string);

  const { minterAddress } = req.query;

  const contract = await sdk.getContract(`${process.env.MARKETPLACE}`, 'nft-collection');

  const grantRole = await contract.roles.revoke('minter', `${minterAddress}`);
  res.status(200).json({ grantRole });
}
