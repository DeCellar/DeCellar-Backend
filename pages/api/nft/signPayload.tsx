import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../.././src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
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

    if (!collectionAddress && !networkId && !address && !name) {
      return res.status(500).send('Missing required environment variables');
    }

    const nonEmptyValues = Object.fromEntries(
      Object.entries({
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
      }).filter(([_, value]) => Boolean(value))
    );

    // Initialize the Thirdweb SDK on the serverside
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      Number(networkId)
    );

    console.log(sdk, '/n', networkId, '/n', nonEmptyValues);

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = await sdk.getContract(collectionAddress, 'nft-collection');

    const signedPayload = await nftCollection.signature.generate({
      to: address,
      metadata: {
        ...nonEmptyValues,
      },
    });

    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: `Server error ${e}` });
  }
}
