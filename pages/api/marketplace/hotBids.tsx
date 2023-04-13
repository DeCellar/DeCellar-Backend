import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { type } from 'os';

const { MARKETPLACE, NETWORK } = process.env;

interface INftWithBid {
  assetContractAddress: string;
  tokenId: string;
  highestBid: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  try {
    if (!NETWORK || !MARKETPLACE) {
      return res.status(500).send('Missing required environment variables');
    }
    const sdk = new ThirdwebSDK(NETWORK);
    const contract = await sdk.getContract(MARKETPLACE, 'marketplace');
    const nfts = await contract.getActiveListings();

    const nftsWithBid: INftWithBid[] = await Promise.all(
      nfts
        .filter((nft) => nft.type === 1) // Filter for type=1
        .map(async (nft) => {
          const highestBid = await contract.auction.getWinningBid(nft.id);
          return {
            assetContractAddress: nft.assetContractAddress,
            tokenId: nft.tokenId.toString(),
            highestBid: highestBid?.currencyValue?.displayValue || '0',
            metadata: nft.asset,
          };
        })
    );

    const nftsWithHighestBid = nftsWithBid.sort((a, b) => {
      return parseFloat(b.highestBid) - parseFloat(a.highestBid);
    });

    res.status(200).json({ hotBids: nftsWithHighestBid });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
