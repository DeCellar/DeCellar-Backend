// Streams API Param and Result Types
import Moralis from 'moralis';

export type addParams = Parameters<typeof Moralis.Streams.add>[0];
export type addAddressParams = Parameters<typeof Moralis.Streams.addAddress>[0];
export type deleteParams = Parameters<typeof Moralis.Streams.delete>[0];
export type deleteAddressParams = Parameters<typeof Moralis.Streams.deleteAddress>[0];
export type getAddressesParams = Parameters<typeof Moralis.Streams.getAddresses>[0];
export type getAllParams = Parameters<typeof Moralis.Streams.getAll>[0];
export type getByIdParams = Parameters<typeof Moralis.Streams.getById>[0];
export type getHistoryParams = Parameters<typeof Moralis.Streams.getHistory>[0];
export type parsedLogsParams = Parameters<typeof Moralis.Streams.parsedLogs>[0];
export type readSettingsParams = Parameters<typeof Moralis.Streams.readSettings>;
export type retryParams = Parameters<typeof Moralis.Streams.retry>[0];
export type setSettingsParams = Parameters<typeof Moralis.Streams.setSettings>[0];
export type updateParams = Parameters<typeof Moralis.Streams.update>[0];
export type updateStatusParams = Parameters<typeof Moralis.Streams.updateStatus>[0];
export type verifySignatureParams = Parameters<typeof Moralis.Streams.verifySignature>[0];

export type addResult = Pick<Awaited<ReturnType<typeof Moralis.Streams.add>>, 'result'>['result'];
export type addAddressResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.addAddress>>,
  'result'
>['result'];
export type deleteResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.delete>>,
  'result'
>['result'];
export type deleteAddressResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.deleteAddress>>,
  'result'
>['result'];
export type getAddressesResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.getAddresses>>,
  'result'
>['result'];
export type getAllResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.getAll>>,
  'result'
>['result'];
export type getByIdResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.getById>>,
  'result'
>['result'];
export type getHistoryResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.getHistory>>,
  'result'
>['result'];
export type parsedLogsResult = Awaited<ReturnType<typeof Moralis.Streams.parsedLogs>>;
export type readSettingsResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.readSettings>>,
  'result'
>['result'];
export type retryResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.retry>>,
  'result'
>['result'];
export type setSettingsResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.setSettings>>,
  'result'
>['result'];
export type updateResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.update>>,
  'result'
>['result'];
export type updateStatusResult = Pick<
  Awaited<ReturnType<typeof Moralis.Streams.updateStatus>>,
  'result'
>['result'];
export type verifySignatureResult = Awaited<ReturnType<typeof Moralis.Streams.verifySignature>>;
