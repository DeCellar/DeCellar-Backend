import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

const url = process.env.MAILCHIMP_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { email } = req.query;

    const { data } = await axios.get(`${url}&EMAIL=${email}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { msg, result } = data;

    console.log(msg, result);

    res.status(200).json({ msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
