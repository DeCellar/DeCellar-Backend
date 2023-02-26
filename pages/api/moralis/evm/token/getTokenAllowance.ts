import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { getTokenAllowanceParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface getTokenAllowanceRequest extends NextApiRequest {
  body: getTokenAllowanceParams;
}

export default async function handler(req: getTokenAllowanceRequest, res: NextApiResponse) {
  await cors(req, res);
  const { address, chain, ownerAddress, spenderAddress } = req.body;

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
