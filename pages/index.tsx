import Head from 'next/head';
import { HOST_API, DOMAIN } from '../config';

export default function IndexPage() {
  return (
    <div style={styles.container}>
      <Head>
        <title>DeCellar API</title>
        <meta name="description" content="DeCellar API for marketplace" />
        <meta name="keywords" content="wine, API, DeCellar, selling" />
        <meta name="author" content="DeCellar" />
        <link rel="icon" href="assets/images/logos/logo.jpeg" />
      </Head>
      <img src="assets/images/logos/logo.jpeg" style={styles.logo} alt="DeCellar Logo" />
      <h1 style={styles.title}>Welcome to the DeCellar API</h1>
      <p style={styles.text}>
        You have successfully set up the DeCellar API. You can start building your backend
        functionality by creating new API routes in the <code>pages/api</code> directory.
      </p>
      <p style={styles.text}>
        The <code>HOST_API</code> variable is currently set to <code>{HOST_API}</code>. The{' '}
        <code>DOMAIN</code> variable is currently set to <code>{DOMAIN}</code> and bockchain network
        is set to <code>{process.env.NETWORK}</code>.
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#ffffff',
    fontFamily: 'Roboto, sans-serif',
  } as React.CSSProperties,
  logo: {
    width: '200px',
    height: 'auto',
    margin: '20px 0',
  } as React.CSSProperties,
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#4b4b4b',
    textAlign: 'center',
    marginBottom: '40px',
  } as React.CSSProperties,
  text: {
    fontSize: '24px',
    color: '#7f7f7f',
    textAlign: 'center',
    marginBottom: '20px',
    maxWidth: '500px',
  } as React.CSSProperties,
};
