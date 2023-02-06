import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenAllowanceParams } from 'src/@types/evm';

interface getTokenAllowanceRequest extends NextApiRequest {
  body: getTokenAllowanceParams;
}

export default async function handler(req: getTokenAllowanceRequest, res: NextApiResponse) {
  const { address, chain, ownerAddress, spenderAddress } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const data = await Moralis.EvmApi.token.getTokenAllowance({
      address,
      chain,
      ownerAddress,
      spenderAddress,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
