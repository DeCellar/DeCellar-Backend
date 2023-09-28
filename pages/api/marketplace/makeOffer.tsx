import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, marketplace, address, listingId, pricePerToken, quantity } = req.query;

    if (!network || !marketplace || !address || !listingId || !pricePerToken || !quantity) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(marketplace as string, 'marketplace');

    const makeOffer = await contract.makeOffer(
      listingId as string,
      pricePerToken as string,
      quantity as string
    );
    res.status(200).json({ makeOffer });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
