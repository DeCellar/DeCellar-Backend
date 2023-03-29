type Metadata = {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  id: string;
  uri: string;
  images: string[];
  category: string;
  productSKU?: string;
  color?: string;
  createdAt: number;
};

export type NFT = {
  owner: string;
  metadata: Metadata;
  type: string;
  supply: number;
};

interface NftMetadata {
  name: string;
  description: string;
  seller_fee_basis_points: number;
  fee_recipient: string;
  symbol: string;
  image?: string;
  external_link?: string;
}

export interface NFTCollection {
  address: string;
  chainId: number;
  metadata: NftMetadata;
}
