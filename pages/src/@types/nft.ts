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
