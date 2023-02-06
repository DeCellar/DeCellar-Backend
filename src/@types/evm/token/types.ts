// Token API Param and Result Types
import Moralis from 'moralis';

export type getTokenAllowanceParams = Parameters<typeof Moralis.EvmApi.token.getTokenAllowance>[0];
export type getTokenMetadataParams = Parameters<typeof Moralis.EvmApi.token.getTokenMetadata>[0];
export type getTokenMetadataBySymbolParams = Parameters<
  typeof Moralis.EvmApi.token.getTokenMetadataBySymbol
>[0];
export type getTokenPriceParams = Parameters<typeof Moralis.EvmApi.token.getTokenPrice>[0];
export type getTokenTransfersParams = Parameters<typeof Moralis.EvmApi.token.getTokenTransfers>[0];
export type getWalletTokenBalancesParams = Parameters<
  typeof Moralis.EvmApi.token.getWalletTokenBalances
>[0];
export type getWalletTokenTransfersParams = Parameters<
  typeof Moralis.EvmApi.token.getWalletTokenTransfers
>[0];

export type getTokenAllowanceResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getTokenAllowance>>,
  'result'
>['result'];
export type getTokenMetadataResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getTokenMetadata>>,
  'result'
>['result'];
export type getTokenMetadataBySymbolResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getTokenMetadataBySymbol>>,
  'result'
>['result'];
export type getTokenPriceResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getTokenPrice>>,
  'result'
>['result'];
export type getTokenTransfersResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getTokenTransfers>>,
  'result'
>['result'];
export type getWalletTokenBalancesResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getWalletTokenBalances>>,
  'result'
>['result'];
export type getWalletTokenTransfersResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.token.getWalletTokenTransfers>>,
  'result'
>['result'];
