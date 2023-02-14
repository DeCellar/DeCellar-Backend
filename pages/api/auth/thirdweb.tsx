import { ThirdwebAuth } from '@thirdweb-dev/auth/next';
import { PrivateKeyWallet } from '@thirdweb-dev/auth/evm';

const env = process.env.NODE_ENV;
// Here we configure thirdweb auth with a domain and wallet
export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: env === 'production' ? 'http://nftpub.it' : 'http://localhost',
  wallet: new PrivateKeyWallet(process.env.PRIVATE_KEY || ''),
});

// Use the ThirdwebAuthHandler as the default export to handle all requests to /api/auth/*
export default ThirdwebAuthHandler();
