export interface HotBid {
  highestBid: string;
  assetContractAddress: string;
  buyoutPrice: {
    type: string;
    hex: string;
  };
  currencyContractAddress: string;
  buyoutCurrencyValuePerToken: {
    name: string;
    symbol: string;
    decimals: number;
    value: {
      type: string;
      hex: string;
    };
    displayValue: string;
  };
  id: string;
  tokenId: {
    type: string;
    hex: string;
  };
  quantity: {
    type: string;
    hex: string;
  };
  startTimeInEpochSeconds: {
    type: string;
    hex: string;
  };
  asset: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    id: string;
    uri: string;
    images: string[];
    category: string;
    product_sku: string;
    product_code: string;
    color: string;
    date_created: number;
  };
  reservePriceCurrencyValuePerToken: {
    name: string;
    symbol: string;
    decimals: number;
    value: {
      type: string;
      hex: string;
    };
    displayValue: string;
  };
  reservePrice: {
    type: string;
    hex: string;
  };
  endTimeInEpochSeconds: {
    type: string;
    hex: string;
  };
  sellerAddress: string;
  type: number;
}
