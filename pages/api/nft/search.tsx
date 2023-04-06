import { NextApiRequest, NextApiResponse } from 'next';
import { paramCase } from 'change-case';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

const headers: any = {
  accept: 'application/json',
  'X-API-Key': process.env.MORALIS_API_KEY,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chain, tokenHash } = req.query;

    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft`, {
      headers,
      params: {
        chain,
        format: 'decimal',
        mediaItems: true,
      },
    });
    const data = response.data.result;

    const nft = data.find((_product: any) => paramCase(_product.token_hash) === tokenHash);

    if (!nft) {
      return res.status(404).json({ message: 'product not found' });
    }

    res.status(200).json({ nft });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
