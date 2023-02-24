// Block API Param and Result Types
import Moralis from 'moralis';

export type getBlockParams = Parameters<typeof Moralis.EvmApi.block.getBlock>[0];
export type getDateToBlockParams = Parameters<typeof Moralis.EvmApi.block.getDateToBlock>[0];

// export type getBlockResult = Pick<Awaited<ReturnType< typeof Moralis.EvmApi.block.getBlock >>, "result">['result'];
export type getBlockResult = Pick<
  Exclude<Awaited<ReturnType<typeof Moralis.EvmApi.block.getBlock>>, null>,
  'result'
>['result'];
export type getDateToBlockResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.block.getDateToBlock>>,
  'result'
>['result'];
