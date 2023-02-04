const nextConfig = {
  reactStrictMode: true,
  env: {
    DEV_API: 'http://localhost:3000',
    PRODUCTION_API: process.env.PRODUCTION_API,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    // FIREBASE
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    MORALIS_API: process.env.MORALIS_API,
    POLYGON_API: process.env.POLYGON_API,
    // NFT
    NFT_COLLECTION: process.env.NFT_COLLECTION,
    MARKETPLACE: process.env.MARKETPLACE,
  },
};

export default nextConfig;
