import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from './thirdweb';
import initializeFirebaseServer from '../../../src/firebase/initAdmin';
import cors from '../../../src/utils/cors';

/**
 * Handles login requests and returns a JWT token for the user.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
export default async function handleLoginRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply CORS to the response.
    await cors(req, res);

    // Get the user from the request.
    const user = await getUser(req);

    // If the user is not found, return an unauthorized error response.
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Initialize the Firebase Admin SDK.
    const { auth } = initializeFirebaseServer();

    // Generate a JWT token for the user to be used on the client-side.
    const token = await auth.createCustomToken(user.address);

    // Send the token to the client-side.
    res.status(200).json({ token });
  } catch (error) {
    // Handle any errors that occur during the request.
    console.error(`Error handling login request: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
