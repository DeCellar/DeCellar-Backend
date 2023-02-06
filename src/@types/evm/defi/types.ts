// Defi API Param and Result Types
import Moralis from 'moralis';

export type getPairAddressParams = Parameters<typeof Moralis.EvmApi.defi.getPairAddress>[0];
export type getPairReservesParams = Parameters<typeof Moralis.EvmApi.defi.getPairReserves>[0];

export type getPairAddressResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.defi.getPairAddress>>,
  'result'
>['result'];
export type getPairReservesResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.defi.getPairReserves>>,
  'result'
>['result'];
