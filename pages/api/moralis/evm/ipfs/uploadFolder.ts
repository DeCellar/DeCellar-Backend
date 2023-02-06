import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import type { uploadFolderParams } from 'src/@types/evm';

interface uploadFolderRequest extends NextApiRequest {
  body: uploadFolderParams;
}

export default async function handler(req: uploadFolderRequest, res: NextApiResponse) {
  const { abi } = req.body;
  await Moralis.start({ apiKey: process.env.MORALIS_API });

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
