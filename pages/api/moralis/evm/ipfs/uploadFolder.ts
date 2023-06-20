import { NextApiRequest, NextApiResponse } from 'next';
import axios from '../../../../src/utils/axios';
import cors from '../../../../src/utils/cors';

const headers: any = {
  accept: 'application/json',
  'X-API-Key': process.env.MORALIS_API_KEY,
};
interface IPFSUploadRequestBody {
  path: string;
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const data: IPFSUploadRequestBody[] = req.body;

  try {
    const response: any = await axios.post(
      'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
      data,
      {
        headers,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
}
