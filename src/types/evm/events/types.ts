// Events API Param and Result Types
import Moralis from 'moralis';

export type getContractEventsParams = Parameters<typeof Moralis.EvmApi.events.getContractEvents>[0];
export type getContractLogsParams = Parameters<typeof Moralis.EvmApi.events.getContractLogs>[0];

export type getContractEventsResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.events.getContractEvents>>,
  'result'
>['result'];
export type getContractLogsResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.events.getContractLogs>>,
  'result'
>['result'];
