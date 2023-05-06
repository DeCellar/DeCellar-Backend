import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

const API_KEY = process.env.MAILCHIMP_API_KEY;
const API_SERVER = process.env.MAILCHIMP_API_SERVER;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `api_key ${API_KEY}`,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    const { email } = req.body;

    console.log(email);

    if (!email || !email.length) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const data = {
      email_address: email,
      status: 'subscribed',
    };

    const response = await axios.post(url, data, options);
    const { status } = response.data;
    res.status(200).json({ status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
