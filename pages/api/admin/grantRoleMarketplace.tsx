import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const sdk = new ThirdwebSDK('mumbai');

  const { listerAddress } = req.query;

  const contract = await sdk.getContract(`${process.env.MARKETPLACE}`, 'marketplace');

  const grantRole = await contract.roles.grant('lister', `${listerAddress}`);
  res.status(200).json({ grantRole });
}
