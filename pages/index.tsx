import fs from 'fs/promises'; // Use promises-based fs
import path from 'path';

export default function ApiDocs({ html = '' }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function getStaticProps() {
  try {
    // Use path.join to construct the correct file path
    const filePath = path.join(process.cwd(), 'public', 'swagger.html');
    const html = await fs.readFile(filePath, 'utf8');

    return {
      props: {
        html,
      },
    };
  } catch (error) {
    console.error('Error reading swagger.html:', error);
    return {
      props: {
        html: 'not working!', // Return an empty string in case of an error
      },
    };
  }
}
