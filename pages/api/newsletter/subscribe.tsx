import { NextApiRequest, NextApiResponse } from 'next';
import axios from '../../../src/utils/axios';
import cors from '../../../src/utils/cors';

const API_KEY = process.env.EMAIL_OCTOPUS_API;
const LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID;

const url = `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  try {
    const { email } = req.body;
    const data = {
      api_key: API_KEY,
      email_address: email,
      tags: ['newsletter'],
      status: 'SUBSCRIBED',
    };
    const response = await axios.post(
      `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
      data
    );
    const { status } = response.data;

    return res.status(200).json({ status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
