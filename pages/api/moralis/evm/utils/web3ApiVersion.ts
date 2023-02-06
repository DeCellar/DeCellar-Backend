import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { web3ApiVersionParams } from 'src/@types/evm';

interface web3ApiVersionRequest extends NextApiRequest {
  body: web3ApiVersionParams;
}

export default async function handler(req: web3ApiVersionRequest, res: NextApiResponse) {
  const {} = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.utils.web3ApiVersion();
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
