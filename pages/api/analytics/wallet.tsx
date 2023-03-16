import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import type { getWalletTransactionsParams } from 'src/@types/evm';
Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    const { address, chain, cursor, fromDate, limit, toDate } = req.body;
    const transactions: getWalletTransactionsParams = await Moralis.EvmApi.transaction.getWalletTransactions({
      address,
      chain,
      cursor,
      fromDate,
      limit,
      toDate,
    });

    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;

    const [yearSales, yearExpenses] = Array.from({ length: 2 }, () => Array(12).fill(0));
    let [thisMonthSales, lastMonthSales, thisMonthExpenses, lastMonthExpenses] = Array(4).fill(0);

    transactions.forEach(
      (block_timestamp: string, value: number, from_address: string, to_address: string) => {
        const txDate = new Date(block_timestamp);
        const txMonth = txDate.getMonth();

        if (from_address.toLowerCase() === address.toLowerCase()) {
          yearSales[txMonth] += Number(value);
          if (txMonth === thisMonth - 1) {
            thisMonthSales += Number(value);
          } else if (txMonth === lastMonth - 1) {
            lastMonthSales += Number(value);
          }
        }
        if (to_address.toLowerCase() === address.toLowerCase()) {
          yearExpenses[txMonth] += Number(value);
          if (txMonth === thisMonth - 1) {
            thisMonthExpenses += Number(value);
          } else if (txMonth === lastMonth - 1) {
            lastMonthExpenses += Number(value);
          }
        }
      }
    );

    const response = {
      yearSales,
      yearExpenses,
      thisMonthSales,
      lastMonthSales,
      thisMonthExpenses,
      lastMonthExpenses,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'An error occurred while fetching wallet transactions.' });
  }
}
