import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { symbolA, symbolB } = req.query;
    if (!symbolA || !symbolB) {
      return res.status(500).send('Missing required parameters');
    }
    let reqInstance = axios.create({
      headers: {
        'X-CMC_PRO_API_KEY': `df781835-e5f4-4448-8b0a-fe31402ab3af`,
      },
    });
    const response = await reqInstance.get(
      `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=${symbolA}&convert=${symbolB}`
    );
    const { data } = response;
    res.status(200).json(data.data[0].quote);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
