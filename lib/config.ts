export type LightningProviderName = 'mock' | 'lnd' | 'btcpayserver';

export const siteConfig = {
  name: '₿itcoin Flagship',
  description:
    'A grassroots community driving Bitcoin adoption through meetups, education, public art, and social campaigns.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoinflagship.com',
  lnbitsPaymentUrl:
    process.env.NEXT_PUBLIC_LNBITS_PAYMENT_URL || 'https://pay.bitcoinflagship.com',
  lightningAddress:
    process.env.NEXT_PUBLIC_LIGHTNING_ADDRESS || 'thebtczone@blink.sv',
  /**
   * All funding buckets currently receive at the same published Blink address
   * as the footer. The override exists so the documentary can be split into
   * its own wallet later without changing the interface.
   */
  documentaryLightningAddress:
    process.env.NEXT_PUBLIC_DOCUMENTARY_LIGHTNING_ADDRESS || 'thebtczone@blink.sv',
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