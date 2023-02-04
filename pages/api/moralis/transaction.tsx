import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address } = req.query;
    const response = await axios.get(`https://api-testnet.polygonscan.com/api
   ?module=transaction
   &action=gettxreceiptstatus
   &txhash=${address}
   &apikey=${process.env.POLYGON_API}`);

    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
