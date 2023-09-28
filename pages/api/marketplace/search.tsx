import { paramCase } from 'change-case';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { MARKETPLACE, NETWORK, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, marketplace, address, name } = req.query;

    if (!network || !marketplace || !address || !name) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(marketplace as string, 'marketplace');

    const listings = await contract.getActiveListings();

    const cleanQuery = `${name}`.toLowerCase().trim();
    const nfts: any = [];
    listings.forEach((listing: any) => {
      if (!name) {
        return nfts.push(listing);
      }
      if (listing.asset.name.toLowerCase().includes(cleanQuery)) {
        return nfts.push(listing);
      }
    });
    res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
