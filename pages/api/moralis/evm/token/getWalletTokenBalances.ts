import axios from 'src/utils/axios';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';

const headers: any = {
  accept: 'application/json',
  'X-API-Key': process.env.MORALIS_API_KEY,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain } = req.query;

 try {
    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/erc20`, 
    //https://deep-index.moralis.io/api/v2/0xd8da6bf26964af9d7eed9e03e53415d37aa96045/erc20?chain=eth'
    {
      headers,
      params: {
        chain,
      }
    });
    
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}

