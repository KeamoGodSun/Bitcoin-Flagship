export type LightningProviderName = 'mock' | 'lnd' | 'btcpayserver';

export const siteConfig = {
  name: '₿itcoin Flagship',
  description:
    'A grassroots community driving Bitcoin adoption through meetups, education, public art, and social campaigns.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoin-flagship.vercel.app',
  lightningAddress:
    process.env.NEXT_PUBLIC_LIGHTNING_ADDRESS || 'tips@bitcoinflagship.org',
  lightningProvider: (process.env.LIGHTNING_PROVIDER ||
    'mock') as LightningProviderName,
  lnd: {
    host: process.env.LND_HOST || '',
    macaroon: process.env.LND_MACAROON || '',
    tlsCertBase64: process.env.LND_TLS_CERT || '',
  },
  btcpayserver: {
    url: process.env.BTCPAY_URL || '',
    apiKey: process.env.BTCPAY_API_KEY || '',
    storeId: process.env.BTCPAY_STORE_ID || '',
  },
};