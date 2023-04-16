import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    const { address, chainId } = req.query;

    const sdk = new ThirdwebSDK(chainId as string);
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

    const nftsPromises = nftCollectionWithMetadata.map(async (contract) => {
      const nftContractAddress = contract.address;
      const nftContract = await sdk.getContract(nftContractAddress);
      const nfts = await nftContract.erc721.getOwned(address as string);

      return {
        contractAddress: nftContractAddress,
        nfts: nfts,
      };
    });

    const nfts = await Promise.all(nftsPromises);

    return res.status(200).json({ nfts });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
