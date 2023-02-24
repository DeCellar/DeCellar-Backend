// Ipfs API Param and Result Types
import Moralis from 'moralis';

export type uploadFolderParams = Parameters<typeof Moralis.EvmApi.ipfs.uploadFolder>[0];

export type uploadFolderResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.ipfs.uploadFolder>>,
  'result'
>['result'];
