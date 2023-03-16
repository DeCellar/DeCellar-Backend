import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { EvmChain } from 'moralis/common-evm-utils';
import cors from 'src/utils/cors';

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chain } = req.query;
    const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      address: address as string,
      chain: EvmChain.MUMBAI,
    });

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
