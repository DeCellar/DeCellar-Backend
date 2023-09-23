import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { MARKETPLACE, NETWORK, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, NETWORK, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).send('Invalid asset contract');
    }

    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const events = await contract.events.getEvents('NewSale');
    const salesForAssetContract = events.filter((event) => event.data.assetContract === address);

    let saleVolume = 0;
    salesForAssetContract.forEach((sale) => {
      const totalPricePaid = Number(sale.data.totalPricePaid) / 1e18;
      saleVolume += totalPricePaid;
    });

    res.status(200).json({ saleVolume });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
