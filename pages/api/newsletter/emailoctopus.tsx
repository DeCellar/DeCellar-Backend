import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import axios from 'src/utils/axios';

// const https = require('https');

const API_KEY = process.env.MAIL_OCTOPUS;

const url = `https://emailoctopus.com/api/1.6/lists/7e6d8e9a-eb10-11ed-9ba8-2542450d386d/contacts`
// const host_name = 'emailoctopus.com'
// const path = 'api/1.6/lists/7e6d8e9a-eb10-11ed-9ba8-2542450d386d/contacts'

var options = {
    // hostname: host_name,
    port: 443,
    // path,
    // method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await cors(req, res);
        const { email } = req.body;

        if (!email || !email.length) {
            return res.status(400).json({ error: 'Invalid Parameters' })
        };

        const data = {
            api_key: API_KEY,
            email_address: email,
            status: 'SUBSCRIBED'
        };

        const response = await axios.post(url, data, options);
        const { status } = response.data;

        res.status(200).json({ status })
    } catch (error) {

        res.status(422).json({ message: 'Email exists in our newsletter' });
    }
}