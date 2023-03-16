import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenMetadataParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface getTokenMetadataRequest extends NextApiRequest {
  body: getTokenMetadataParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});


export default async function handler(req: getTokenMetadataRequest, res: NextApiResponse) {
  await cors(req, res);
  const { addresses, chain } = req.body;

  try {
    const data = await Moralis.EvmApi.token.getTokenMetadata({
      addresses,
      chain,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
