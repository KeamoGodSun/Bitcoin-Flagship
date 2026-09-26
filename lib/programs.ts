export type WalletGroupId = 'flagship' | 'education' | 'events' | 'activation' | 'documentary';

export interface WalletProgram {
  id: string;
  name: string;
  description: string;
  memo: string;
  defaultAmount: number;
  walletGroupId: WalletGroupId;
}

/**
 * Canonical program registry. Program ids match the `section` ids produced by
 * scripts/process-images.mjs so the gallery, wallets, events, and calendar all
 * speak the same language. `social-campaigns` has no gallery photos but still
 * needs a wallet to receive into.
 */
export const programs: WalletProgram[] = [
  {
    id: 'my-first-bitcoin',
    name: 'My First Bitcoin',
    description: 'Introductory Bitcoin education for newcomers.',
    memo: 'My First Bitcoin — education',
    defaultAmount: 5000,
    walletGroupId: 'education',
  },
  {
    id: 'trezor-academy',
    name: 'Trezor Academy',
    description: 'Hands-on self-custody and hardware wallet training.',
    memo: 'Trezor Academy — education',
    defaultAmount: 5000,
    walletGroupId: 'education',
  },
  {
    id: 'lightning-bootcamp',
    name: 'Lightning Bootcamp',
    description: 'Node setup, channels, and real Lightning payments.',
    memo: 'Lightning Bootcamp — education',
    defaultAmount: 5000,
    walletGroupId: 'education',
  },
  {
    id: 'meet-ups',
    name: 'Meet-ups',
    description: 'Community gatherings and networking, including Outer Meets.',
    memo: 'Meet-up — events',
    defaultAmount: 5000,
    walletGroupId: 'events',
  },
  {
    id: 'movie-night',
    name: 'Movie Nights',
    description: 'Documentary screenings and film nights.',
    memo: 'Movie Night — events',
    defaultAmount: 5000,
    walletGroupId: 'events',
  },
  {
    id: 'game-day',
    name: 'Game Day',
    description: 'Bitcoin trivia and community game days.',
    memo: 'Game Day — events',
    defaultAmount: 5000,
    walletGroupId: 'events',
  },
  {
    id: 'murals-billboards',
    name: 'Murals & Billboards',
    description: 'Public art and highway billboard campaigns.',
    memo: 'Murals & Billboards — activation',
    defaultAmount: 5000,
    walletGroupId: 'activation',
  },
  {
    id: 'merchant-onboarding',
    name: 'Merchant On-boarding',
    description: 'Helping local businesses accept Bitcoin.',
    memo: 'Merchant On-boarding — activation',
    defaultAmount: 5000,
    walletGroupId: 'activation',
  },
  {
    id: 'social-campaigns',
    name: 'Social Campaigns',
    description: 'Coordinated online campaigns and thunderclaps.',
    memo: 'Social Campaign — activation',
    defaultAmount: 5000,
    walletGroupId: 'activation',
  },
  {
    id: 'documentary',
    name: 'State Project Doccie',
    description: 'Production costs for the documentary now being filmed.',
    memo: 'State Project Doccie — film',
    defaultAmount: 5000,
    walletGroupId: 'documentary',
  },
];

export function getProgram(programId: string): WalletProgram | null {
  return programs.find((p) => p.id === programId) ?? null;
}

export function programsForGroup(groupId: WalletGroupId): WalletProgram[] {
  return programs.filter((p) => p.walletGroupId === groupId);
}

export function programName(programId: string): string {
  return getProgram(programId)?.name ?? programId;
}
