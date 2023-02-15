import { ThirdwebAuth } from '@thirdweb-dev/auth/next';
import { SignerWallet } from '@thirdweb-dev/auth/evm';
import { ethers } from 'ethers';

// Create a new ethers signer or use an existing one
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string);
const wallet = new SignerWallet(signer);

// Here we configure thirdweb auth with a domain and wallet
export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: process.env.DOMAIN as string,
  wallet: wallet,
});

// Use the ThirdwebAuthHandler as the default export to handle all requests to /api/auth/*
export default ThirdwebAuthHandler();
