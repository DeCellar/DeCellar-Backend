import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../.././src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chainId } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(address as string, 'nft-collection');
    console.log(contract);
    const metadata: any = await contract.metadata.get();

    return res.status(200).json({ metadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
