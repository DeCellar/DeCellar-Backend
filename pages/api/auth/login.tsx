import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from './thirdweb';
import initializeFirebaseServer from '../../../src/firebase/initAdmin';
import cors from '../../../src/utils/cors';

/**
 * Handle user login request
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 */
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await cors(req, res);

  const user = await getUser(req);

  if (!user) return res.status(401).json({ error: 'Unauthorized!' });

  // Initialize the Firebase Admin SDK.
  const { auth } = initializeFirebaseServer();

  // Generate a JWT token for the user to be used on the client-side.
  const token = await auth.createCustomToken(user?.address);

  // Send the token to the client-side.
  return res.status(200).json({ token });
}
