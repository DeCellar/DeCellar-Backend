import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'src/utils/axios';
import cors from 'src/utils/cors';

const API_KEY = process.env.EMAIL_OCTOPUS_API;
const LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID;
const url = `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`;

const options = {
  port: 443,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default async function subscribeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Invalid parameters: email is required' });
    }

    const data = {
      api_key: API_KEY,
      email_address: email,
      status: 'SUBSCRIBED',
    };

    const response = await axios.post(url, data, options);
    const { status } = response.data;

    res.status(200).json({ status });
  } catch (error) {
    console.error('Failed to subscribe email', error);
    res.status(500).json({ error: 'Failed to subscribe email' });
  }
}
