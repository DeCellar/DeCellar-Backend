import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';

import cors from 'src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chain } = req.body;

    const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      address,
      chain,
    });

    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
