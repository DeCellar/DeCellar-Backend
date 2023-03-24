import { NextApiRequest, NextApiResponse } from 'next';
import process from 'process';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';
import { fPercentChange } from 'src/utils/math';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK } = process.env;
interface NftCollectionItem {
  address: string;
  chainId: number;
  transactions: {
    total: number | null;
    page: number;
    page_size: number;
    cursor: any;
    result: {
      block_number: string;
      block_timestamp: string;
      block_hash: string;
      transaction_hash: string;
      transaction_index: number;
      log_index: number;
      value: string;
      contract_type: string;
      transaction_type: string;
      token_address: string;
      token_id: string;
      from_address: string;
      to_address: string;
      amount: string;
      verified: number;
      operator: any;
    }[];
    block_exists: boolean;
  };
}

interface NftApiResponse {
  nftSold: number;
  nftCollection: NftCollectionItem[];
}

interface MonthlySales {
  month: string;
  sales: number;
  revenue: number;
}

interface YearlySales {
  year: number;
  salesByMonth: MonthlySales[];
}

const headers: any = { accept: 'application/json', 'X-API-Key': process.env.MORALIS_API_KEY };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    if (!NETWORK) {
      return res.status(500).send('Missing required environment variables');
    }
    const { address, chain } = req.query;

    const sdk = new ThirdwebSDK(NETWORK);
    const contractList = await sdk.getContractList(address as string);
    const nftCollectionPromises = contractList.map(async (contract) => {
      const contractType = await contract.contractType();
      if (contractType === 'nft-collection') {
        const response = await axios.get(
          `https://deep-index.moralis.io/api/v2/nft/${contract.address}/transfers`,
          {
            headers,
            params: {
              chain,
            },
          }
        );
        return {
          ...contract,
          transactions: response.data,
        };
      }
      return null;
    });

    const nftCollection = (await Promise.all(nftCollectionPromises)).filter(
      (item) => item !== null
    ) as NftCollectionItem[];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastYear = currentYear - 1;

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const salesByMonth: MonthlySales[] = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      sales: 0,
      revenue: 0,
    }));

    nftCollection.forEach((collection) => {
      collection.transactions.result.forEach((transaction) => {
        const transactionDate = new Date(transaction.block_timestamp);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;

        if (transactionYear === currentYear) {
          salesByMonth[transactionMonth - 1].sales += 1;
          salesByMonth[transactionMonth - 1].revenue += parseInt(transaction.value);
        }
      });
    });

    const salesByMonthLastYear: MonthlySales[] = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      sales: 0,
      revenue: 0,
    }));

    nftCollection.forEach((collection) => {
      collection.transactions.result.forEach((transaction) => {
        const transactionDate = new Date(transaction.block_timestamp);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;

        if (transactionYear === lastYear) {
          salesByMonthLastYear[transactionMonth - 1].sales += 1;
          salesByMonth[transactionMonth - 1].revenue += parseInt(transaction.value);
        }
      });
    });

    const totalSales = salesByMonth.reduce((acc, cur) => acc + cur.sales, 0);
    const totalSalesLastYear = salesByMonthLastYear.reduce((acc, cur) => acc + cur.sales, 0);

    const yearlySales: YearlySales[] = [
      {
        year: lastYear,
        salesByMonth: salesByMonthLastYear,
      },
      {
        year: currentYear,
        salesByMonth,
      },
    ];

    const nftApiResponse = {
      nftSold: totalSales,
      totalSales: totalSales,
      totalSalesLastYear: totalSalesLastYear,
      yearlySales: yearlySales,
      nftCollection: nftCollection,
    };

    return res.status(200).json(nftApiResponse);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'An error occurred while fetching wallet transactions.' });
  }
}
