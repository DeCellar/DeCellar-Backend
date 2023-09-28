import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { MARKETPLACE, NETWORK, PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, marketplace, address } = req.query;

    if (!network || !marketplace || !address) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });
    const contract = await sdk.getContract(marketplace as string, 'marketplace');

    let events = await contract.events.getEvents('NewSale');

    // Filter by lister address if provided
    if (address) {
      events = events.filter((event) => event.data.lister === address);
    }

    // Filter sales for type 0 and type 1
    const type0Sales = [];
    const type1Sales = [];

    for (const sale of events) {
      const listingId = Number(sale.data.listingId);
      const listing = await contract.getListing(listingId.toString());

      if (listing.type === 0) {
        type0Sales.push(sale);
      } else if (listing.type === 1) {
        type1Sales.push(sale);
      }
    }

    // Calculate the sum of sales volume for type 0 and type 1
    const sumType0 = type0Sales.reduce(
      (acc, sale) => acc + Number(sale.data.totalPricePaid) / 1e18,
      0
    );
    const sumType1 = type1Sales.reduce(
      (acc, sale) => acc + Number(sale.data.totalPricePaid) / 1e18,
      0
    );

    res.status(200).json({ direct: sumType0, auction: sumType1 });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
