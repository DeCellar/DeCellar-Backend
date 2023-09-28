import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { chain } from 'lodash';

const { PRIVATE_KEY, THIRDWEB_SECRET_KEY } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { network, address, special } = req.query;

    if (!network || !address) {
      return res.status(500).send('Missing required parameters');
    }

    const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY as string, network as string, {
      secretKey: THIRDWEB_SECRET_KEY,
    });

    const contractList = await sdk.getContractList(address as string);

    const allowedContractTypes =
      special === 'true'
        ? ['edition', 'edition-drop', 'nft-drop', 'signature-drop']
        : ['nft-collection'];

    const nftCollection = [];
    const metadataPromises = [];

    for (const contract of contractList) {
      const contractType = await contract.contractType();

      if (allowedContractTypes.includes(contractType)) {
        metadataPromises.push(contract.metadata());
        nftCollection.push({ contract, contractType });
      }
    }

    const metadata = await Promise.all(metadataPromises);
    const nftCollectionWithMetadata = nftCollection
      .map((item, index) => ({ ...item, metadata: metadata[index] }))
      .filter((item) => item.contract.chainId.toString() === network);

    return res.status(200).json({ nftCollection: nftCollectionWithMetadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
