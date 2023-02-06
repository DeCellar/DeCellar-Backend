// Balance API Param and Result Types
import Moralis from 'moralis';

export type getNativeBalanceParams = Parameters<typeof Moralis.EvmApi.balance.getNativeBalance>[0];

export type getNativeBalanceResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.balance.getNativeBalance>>,
  'result'
>['result'];
