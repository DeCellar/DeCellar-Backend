const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    DEV_API: 'http://localhost:3000',
    PRODUCTION_API: 'https://api.decellar.it',
    DEV_DOMAIN: 'http://localhost:8081',
    PRODUCTION_DOMAIN: 'https://www.decellar.io',

    PRIVATE_KEY: process.env.PRIVATE_KEY,
    // FIREBASE
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    //MORALIS
    MORALIS_API: process.env.MORALIS_API,
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
    // BLOCKCHAIN
    NETWORK: process.env.NETWORK,
    // NFT
    NFT_COLLECTION: process.env.NFT_COLLECTION,
    MARKETPLACE: process.env.MARKETPLACE,

    EMAIL_OCTOPUS_API: process.env.EMAIL_OCTOPUS_API,
    EMAIL_OCTOPUS_LIST_ID: process.env.EMAIL_OCTOPUS_LIST_ID,

    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_API_SERVER: process.env.MAILCHIMP_API_SERVER,
    MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID,

    ALCHEMY_API: process.env.ALCHEMY_API,
    ALCHEMY_AUTH_KEY: process.env.ALCHEMY_AUTH_KEY,
    WEBHOOK_ID: process.env.WEBHOOK_ID,
    COINMARKET_API: process.env.COINMARKET_API,

    OPENAI_API: process.env.OPENAI_API,

    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
  },
};

export default nextConfig;
