import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { fromAddress, toAddress, alchemyNetwork } = req.query;

  const addressParam = fromAddress ? { fromAddress } : toAddress ? { toAddress } : {};

  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        category: ['external'],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: '0x3e8',
        order: 'desc',
        ...addressParam,
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://${alchemyNetwork}.g.alchemy.com/v2/${process.env.ALCHEMY_API}/`,
      requestBody,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const transfers = response.data.result.transfers;

    const currentYear = Array(12).fill(0);
    const previousYear = Array(12).fill(0);
    const currentYearStart = new Date().getFullYear();
    const previousYearStart = currentYearStart - 1;

    let currentYearSum = 0;
    let previousYearSum = 0;

    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      const blockTimestamp = new Date(transfer.metadata.blockTimestamp);
      const month = blockTimestamp.getMonth();
      const value = transfer.value;

      if (blockTimestamp.getFullYear() === currentYearStart) {
        currentYear[month] += value;
        currentYearSum += value;
      } else if (blockTimestamp.getFullYear() === previousYearStart) {
        previousYear[month] += value;
        previousYearSum += value;
      }
    }
    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentMonthValue = currentYear[currentMonth];
    const prevMonthValue = previousYear[prevMonth];
    const currentYearValue = currentYearSum;
    const previousYearValue = previousYearSum;

    const currentMonthGrowth =
      prevMonthValue === 0
        ? currentMonthValue === 0
          ? 0
          : 10000
        : ((currentMonthValue - prevMonthValue) / prevMonthValue) * 100;

    const currentYearGrowth =
      previousYearValue === 0
        ? currentYearValue === 0
          ? 0
          : 1000
        : ((currentYearValue - previousYearValue) / previousYearValue) * 100;

    const totalCurrentValue = currentYear.reduce((acc, value) => acc + value, 0);
    const totalPrevValue = previousYear.reduce((acc, value) => acc + value, 0);

    const tranferAnalytics = {
      months: months,
      currentYear: {
        year: currentYearStart,
        monthlyTransfers: currentYear.map((value) => Number(value.toFixed(4))),
      },
      previousYear: {
        year: previousYearStart,
        monthlyTransfers: previousYear.map((value) => Number(value.toFixed(4))),
      },
      totalValueCurrentYear: Number(totalCurrentValue.toFixed(4)),
      totalValuePrevYear: Number(totalPrevValue.toFixed(4)),
      percentGrowthCurrentMonth: currentMonthGrowth < 0 ? 0 : currentMonthGrowth,
      percentGrowthCurrentYear: currentYearGrowth < 0 ? 0 : currentYearGrowth,
    };

    res.status(200).json(tranferAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
