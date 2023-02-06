import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenMetadataParams } from 'src/@types/evm';

interface getTokenMetadataRequest extends NextApiRequest {
  body: getTokenMetadataParams;
}

export default async function handler(req: getTokenMetadataRequest, res: NextApiResponse) {
  const { addresses, chain } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

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
