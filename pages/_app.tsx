import { AppProps } from 'next/app';
import Moralis from 'moralis';

function MyApp({ Component, pageProps }: AppProps) {
  // Call Moralis.start() here
  Moralis.start({
    apiKey: process.env.MORALIS_API,
    // ...and any other configuration
  });

  return <Component {...pageProps} />;
}

export default MyApp;
