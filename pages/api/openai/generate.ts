import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { Configuration, OpenAIApi } from 'openai';

// Environment variable validation
const openAIKey = process.env.OPENAI_API;
const chatGPTAssistant = process.env.CHATGPT_ASSISTANT;

if (!openAIKey || !chatGPTAssistant) {
  console.error('Missing either OPENAI_API or CHATGPT_ASSISTANT environment variable');
  process.exit(1);
}

// OpenAI Configuration
const configuration = new Configuration({ apiKey: openAIKey });
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  const { prompt } = req.query;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing required query parameter: prompt' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: chatGPTAssistant as string,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt.toString() },
      ],
    });

    const result = response?.data?.choices[0]?.message?.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error in OpenAI Chat Completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
