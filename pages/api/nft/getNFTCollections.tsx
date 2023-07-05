import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chainId, special } = req.query;
    const sdk = new ThirdwebSDK(chainId as string);
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
        nftCollection.push({
          contract,
          contractType,
        });
      }
    }

    const metadata = await Promise.all(metadataPromises);
    const nftCollectionWithMetadata = nftCollection
      .map((item, index) => ({
        contract: item.contract,
        contractType: item.contractType,
        metadata: metadata[index],
      }))
      .filter((item) => item.contract.chainId.toString() === chainId);

    return res.status(200).json({ nftCollection: nftCollectionWithMetadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
