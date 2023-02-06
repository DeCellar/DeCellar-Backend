import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { runContractFunctionParams } from 'src/@types/evm';

interface runContractFunctionRequest extends NextApiRequest {
  body: runContractFunctionParams;
}

export default async function handler(req: runContractFunctionRequest, res: NextApiResponse) {
  const { abi, address, chain, functionName, params } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

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
