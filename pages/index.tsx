import { HOST_API, DOMAIN } from '../config';

export default function IndexPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to the NFTPub API</h1>
      <p style={styles.text}>
        You have successfully set up the NFTPub API. You can start building your backend
        functionality by creating new API routes in the <code>pages/api</code> directory.
      </p>
      <p style={styles.text}>
        The <code>HOST_API</code> variable is currently set to <code>{HOST_API}</code>. The{' '}
        <code>DOMAIN</code> variable is currently set to <code>{DOMAIN}</code>.
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
