import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { uploadFolderParams } from 'src/@types/evm';
import cors from 'src/utils/cors';

interface uploadFolderRequest extends NextApiRequest {
  body: uploadFolderParams;
}

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export default async function handler(req: uploadFolderRequest, res: NextApiResponse) {
  await cors(req, res);
  const { abi } = req.body;

  try {
    const data = await Moralis.EvmApi.ipfs.uploadFolder({
      abi,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
