export type LightningProviderName = 'mock' | 'lnd' | 'btcpayserver';

export const siteConfig = {
  name: '₿itcoin Flagship',
  description:
    'A grassroots community driving Bitcoin adoption through meetups, education, public art, and social campaigns.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoinflagship.com',
  lightningAddress:
    process.env.NEXT_PUBLIC_LIGHTNING_ADDRESS || 'tips@bitcoinflagship.com',
  /**
   * The documentary is funded from its own wallet, kept separate from the
   * general tip address so the two can be accounted for independently.
   * Left empty on purpose: we never guess an address. An empty value means
   * "not published yet", and the UI says so instead of showing a wallet that
   * would swallow money nobody controls.
   */
  documentaryLightningAddress: process.env.NEXT_PUBLIC_DOCUMENTARY_LIGHTNING_ADDRESS || '',
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