import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenMetadataBySymbolParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getTokenMetadataBySymbolRequest extends NextApiRequest {
  body: getTokenMetadataBySymbolParams;
}

export default async function handler(req: getTokenMetadataBySymbolRequest, res: NextApiResponse) {
  await cors(req, res);
  const { chain, symbols } = req.body;

  try {
    const data = await Moralis.EvmApi.token.getTokenMetadataBySymbol({
      chain,
      symbols,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
