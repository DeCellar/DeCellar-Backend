import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK, MARKETPLACE } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }

    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');

    const events = await contract.events.getEvents('NewSale');

    // Sort sales in descending order based on the total price paid
    const sortedSales = events.sort((a, b) => {
      const totalPricePaidA = Number(a.data.totalPricePaid);
      const totalPricePaidB = Number(b.data.totalPricePaid);
      return totalPricePaidB - totalPricePaidA;
    });

    // Convert BigNumber totalPricePaid to readable format (e.g., USDT)
    const decimalFactor = 1e6; // Assuming USDT with 6 decimal places
    const formattedSales = [];
    for (const sale of sortedSales) {
      const listingId = Number(sale.data.listingId);
      const quantityBought = Number(sale.data.quantityBought);
      const totalPricePaid = Number(sale.data.totalPricePaid) / decimalFactor; // Convert to USDT
      const listing = await contract.getListing(listingId.toString());

      formattedSales.push({
        listingId,
        assetContract: sale.data.assetContract,
        quantityBought,
        totalPricePaid,
        transactionHash: sale.transaction.transactionHash,
        blockNumber: sale.transaction.blockNumber,
        listingDetails: listing, // Add the listing details to the response
      });
    }

    res.status(200).json({ sales: formattedSales });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
