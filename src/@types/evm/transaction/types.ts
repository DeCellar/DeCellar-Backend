// Transactions API Param and Result Types
import Moralis from 'moralis';

export type getTransactionParams = Parameters<typeof Moralis.EvmApi.transaction.getTransaction>[0];
export type getWalletTransactionsParams = Parameters<
  typeof Moralis.EvmApi.transaction.getWalletTransactions
>[0];

export type getWalletTransactionsResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.transaction.getWalletTransactions>>,
  'result'
>['result'];
