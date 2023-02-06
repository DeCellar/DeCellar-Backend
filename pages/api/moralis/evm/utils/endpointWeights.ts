import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { endpointWeightsParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface endpointWeightsRequest extends NextApiRequest {
  body: endpointWeightsParams;
}

export default async function handler(req: endpointWeightsRequest, res: NextApiResponse) {
  await cors(req, res);
  const {} = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.utils.endpointWeights();
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
