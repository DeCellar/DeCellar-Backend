// Utlis API Param and Result Types
import Moralis from 'moralis';

export type endpointWeightsParams = Parameters<typeof Moralis.EvmApi.utils.endpointWeights>;
export type runContractFunctionParams = Parameters<
  typeof Moralis.EvmApi.utils.runContractFunction
>[0];
export type web3ApiVersionParams = Parameters<typeof Moralis.EvmApi.utils.web3ApiVersion>;

export type endpointWeightsResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.utils.endpointWeights>>,
  'result'
>['result'];
export type runContractFunctionResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.utils.runContractFunction>>,
  'result'
>['result'];
export type web3ApiVersionResult = Pick<
  Awaited<ReturnType<typeof Moralis.EvmApi.utils.web3ApiVersion>>,
  'result'
>['result'];
