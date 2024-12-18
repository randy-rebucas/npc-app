import sharetribeSDK from 'sharetribe-flex-sdk';

export const sdk = sharetribeSDK.createInstance({
  clientId: process.env.SHARETRIBE_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_CLIENT_SECRET,
  baseUrl: process.env.SHARETRIBE_MARKETPLACE_URL,
});

