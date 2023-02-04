import { NextApiRequest, NextApiResponse } from 'next';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import initializeFirebaseServer from '../../../firebase/initAdmin';
// utils
import cors from '../../../src/utils/cors';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  // Grab the login payload the user sent us with their request.
  const loginPayload = req.body.payload;
  // Set this to your domain to prevent signature malleability attacks.
  const domain = 'http://localhost';

  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY!, 'mumbai');
  let address;
  try {
    // Verify the address of the logged in client-side wallet by validating the provided client-side login request.
    address = sdk.auth.verify(domain, loginPayload);
  } catch (err) {
    console.error(err);
    return res.status(401).send('Unauthorized');
  }

  const { auth } = initializeFirebaseServer();
  const token = await auth.createCustomToken(address);

  // Send the token to the client to sign in with.
  return res.status(200).json({ token });
}
