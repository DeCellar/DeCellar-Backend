// API
// ----------------------------------------------------------------------

export const HOST_API =
  process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_API : process.env.DEV_API;

export const DOMAIN =
  process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DOMAIN : process.env.DEV_DOMAIN;
