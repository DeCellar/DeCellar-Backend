import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const {
      name,
      description,
      category,
      date_created,
      uri,
      external_url,
      animation_url,
      product_code,
      color,
      background_color,
      image,
      attributes,
      images,
      collectionAddress,
      networkId,
      address,
    } = req.body;

    if (!collectionAddress || !networkId || !address || !name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const nonEmptyValues = {
      name,
      description,
      category,
      date_created,
      uri,
      external_url,
      animation_url,
      product_code,
      color,
      background_color,
      image,
      attributes,
      images,
    };

    // Initialize the Thirdweb SDK on the server-side
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      Number(networkId)
    );

    // Load the NFT Collection via its contract address using the SDK
    const nftCollection = await sdk.getContract(collectionAddress, 'nft-collection');

    const signedPayload = await nftCollection.signature.generate({
      to: address,
      metadata: nonEmptyValues,
    });

    res.status(200).json({
      signedPayload: signedPayload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
