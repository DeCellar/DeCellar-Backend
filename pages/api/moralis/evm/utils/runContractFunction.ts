import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { runContractFunctionParams } from 'src/@types/evm';
import cors from 'src/utils/cors';
interface runContractFunctionRequest extends NextApiRequest {
  body: runContractFunctionParams;
}

export default async function handler(req: runContractFunctionRequest, res: NextApiResponse) {
  await cors(req, res);
  const { abi, address, chain, functionName, params } = req.body;

  try {
    const data = await Moralis.EvmApi.utils.runContractFunction({
      abi,
      address,
      chain,
      functionName,
      params,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
