import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../.././src/utils/cors';
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(500).send('Missing required environment variables');
    }

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      //prompt: `Generate attributes for an NFT: ${name}`,
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 100,
    });

    const result = response.data.choices[0].text;
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
