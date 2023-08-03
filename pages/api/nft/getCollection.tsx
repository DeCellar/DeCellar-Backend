import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { address, chainId } = req.query;

    if (!chainId) {
      return res.status(500).send('Missing chain ID');
    }

    if (!address) {
      return res.status(500).send('Missing contract address');
    }

    const sdk = new ThirdwebSDK(chainId as string);
    const contract = await sdk.getContract(address as string, 'nft-collection');
    const metadata: any = await contract.metadata.get();

    return res.status(200).json({ metadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
