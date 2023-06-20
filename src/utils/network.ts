import { INetwork } from '../@types/network';

const network: INetwork[] = [
  {
    name: 'Ethereum Mainnet',
    alchemyName: 'eth-mainnet',
    chainId: 1,
    hexId: '0x1',
    rpcUrl: 'https://1rpc.io/eth',
    explorerUrl: 'https://etherscan.io/',
    symbol: 'ETH',
    blockTime: 13,
  },
  {
    name: 'Goerli Testnet',
    alchemyName: 'eth-goerli',
    chainId: 5,
    hexId: '0x5',
    rpcUrl: 'https://goerli.blockpi.network/v1/rpc/public',
    explorerUrl: 'https://goerli.etherscan.io/',
    symbol: 'ETH',
    blockTime: 15,
  },
  {
    name: 'Polygon Mainnet',
    alchemyName: 'polygon-mainnet',
    chainId: 137,
    hexId: '0x89',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    explorerUrl: 'https://polygonscan.com/',
    symbol: 'MATIC',
    blockTime: 2,
  },
  {
    name: 'Polygon Testnet',
    alchemyName: 'polygon-mumbai',
    chainId: 80001,
    hexId: '0x13881',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com/',
    symbol: 'MATIC',
    blockTime: 2,
  },
];

export default network;
