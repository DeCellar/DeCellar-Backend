import { ChainId, ThirdwebSDK } from '@thirdweb-dev/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

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
      chainId,
      address,
    } = req.body;

    if (!collectionAddress || !chainId || !address || !name) {
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

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, chainId, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

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
