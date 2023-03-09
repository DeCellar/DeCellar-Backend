import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const { NETWORK } = process.env;

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK) {
      return res.status(500).send('Missing required environment variables');
    }
    const { address, chainId } = req.query;
    const sdk = new ThirdwebSDK(NETWORK);
    const contractList = await sdk.getContractList(address as string);

    const nftCollection = [];
    const metadataPromises = [];
    for (const contract of contractList) {
      const contractType = await contract.contractType();
      if (contractType === 'nft-collection') {
        metadataPromises.push(contract.metadata());
        nftCollection.push(contract);
      }
    }

    const metadata = await Promise.all(metadataPromises);
    const nftCollectionWithMetadata = nftCollection
      .map((contract, index) => ({
        ...contract,
        metadata: metadata[index],
      }))
      .filter((contract) => contract.chainId.toString() === chainId);

    return res.status(200).json({ nftCollection: nftCollectionWithMetadata });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
