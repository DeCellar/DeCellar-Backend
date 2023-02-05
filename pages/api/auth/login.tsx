import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import initializeFirebaseServer from '../../../src/firebase/initAdmin';
import cors from '../../../src/utils/cors';

const { PRIVATE_KEY, DOMAIN, NETWORK } = process.env;

/**
 * Handle user login request
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 */
export default async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await cors(req, res);

  if (!NETWORK || !PRIVATE_KEY || !DOMAIN) {
    return res.status(500).send('Missing required environment variables');
  }
  // Retrieve login payload from user's request
  const loginPayload = req.body.payload;

  // Initialize Thirdweb SDK
  const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY!, NETWORK);

  // Verify the address of the client-side wallet
  let address;
  try {
    address = sdk.auth.verify(DOMAIN, loginPayload);
  } catch (err) {
    console.error(err);
    return res.status(401).send('Unauthorized');
  }

  // Initialize Firebase Server
  const { auth } = initializeFirebaseServer();
  const token = await auth.createCustomToken(address);

  // Return the token to the client
  return res.status(200).json({ token });
}
