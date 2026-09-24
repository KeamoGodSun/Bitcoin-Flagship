import { Wallet as WalletIcon, GraduationCap, Calendar, Megaphone, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export type WalletGroupId = 'flagship' | 'education' | 'events' | 'activation';

export interface WalletProgram {
  id: string;
  name: string;
  description: string;
  memo: string;
  defaultAmount?: number;
}

export interface WalletGroup {
  id: WalletGroupId;
  name: string;
  shortName: string;
  description: string;
  memo: string;
  defaultAmount: number;
  icon: LucideIcon;
  programs: WalletProgram[];
}

export function walletAddress(walletId: WalletGroupId): string {
  if (walletId === 'flagship') return siteConfig.lightningAddress;

  const overrides = parseAddressOverrides();
  if (overrides[walletId]) return overrides[walletId];

  const domain = siteConfig.lightningAddress.split('@')[1] || 'bitcoinflagship.com';
  return `${walletId}@${domain}`;
}

function parseAddressOverrides(): Record<string, string> {
  try {
    const raw = process.env.NEXT_PUBLIC_WALLET_ADDRESSES;
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export const walletGroups: WalletGroup[] = [
  {
    id: 'flagship',
    name: '₿itcoin Flagship',
    shortName: 'Flagship',
    description: 'Support the overall movement — meetups, education, public art, and campaigns.',
    memo: 'Bitcoin Flagship tip',
    defaultAmount: 2100,
    icon: WalletIcon,
    programs: [],
  },
  {
    id: 'education',
    name: 'Education Wallet',
    shortName: 'Education',
    description: 'Fund learning programs: first-time courses, wallet academies, and Lightning bootcamps.',
    memo: 'Bitcoin Flagship — Education',
    defaultAmount: 5000,
    icon: GraduationCap,
    programs: [
      {
        id: 'my-first-bitcoin',
        name: 'My First Bitcoin',
        description: 'Introductory Bitcoin education for newcomers.',
        memo: 'My First Bitcoin — education',
        defaultAmount: 5000,
      },
      {
        id: 'trezor-academy',
        name: 'Trezor Academy',
        description: 'Hands-on self-custody and hardware wallet training.',
        memo: 'Trezor Academy — education',
        defaultAmount: 5000,
      },
      {
        id: 'lightning-bootcamp',
        name: 'Lightning Bootcamp',
        description: 'Node setup, channels, and real Lightning payments.',
        memo: 'Lightning Bootcamp — education',
        defaultAmount: 5000,
      },
    ],
  },
  {
    id: 'events',
    name: 'Events Wallet',
    shortName: 'Events',
    description: 'Fund in-person moments: meet-ups, movie screenings, and game days.',
    memo: 'Bitcoin Flagship — Events',
    defaultAmount: 5000,
    icon: Calendar,
    programs: [
      {
        id: 'meetups',
        name: 'Meet-ups',
        description: 'Regular community gatherings and networking.',
        memo: 'Meet-up — events',
        defaultAmount: 5000,
      },
      {
        id: 'movie-night',
        name: 'Movie Night',
        description: 'Documentary screenings and film nights.',
        memo: 'Movie Night — events',
        defaultAmount: 5000,
      },
      {
        id: 'game-day',
        name: 'Game Day',
        description: 'Bitcoin trivia and community game days.',
        memo: 'Game Day — events',
        defaultAmount: 5000,
      },
      {
        id: 'outer-meets',
        name: 'Outer Meets',
        description: 'Outdoor meet-ups — hikes, walks, and park hangs.',
        memo: 'Outer Meets — events',
        defaultAmount: 5000,
      },
    ],
  },
  {
    id: 'activation',
    name: 'Activation & Awareness Wallet',
    shortName: 'Awareness',
    description: 'Fund public outreach: merchant on-boarding, billboards, and murals.',
    memo: 'Bitcoin Flagship — Activation & Awareness',
    defaultAmount: 5000,
    icon: Megaphone,
    programs: [
      {
        id: 'merchant-onboarding',
        name: 'Merchant On-boarding',
        description: 'Helping local businesses accept Bitcoin.',
        memo: 'Merchant On-boarding — activation',
        defaultAmount: 5000,
      },
      {
        id: 'murals-billboards',
        name: 'Murals & Billboards',
        description: 'Public art and highway billboard campaigns.',
        memo: 'Murals & Billboards — activation',
        defaultAmount: 5000,
      },
    ],
  },
];

export function getWalletGroup(walletId: string): WalletGroup {
  return walletGroups.find((g) => g.id === walletId) ?? walletGroups[0];
}

export function getWalletProgram(group: WalletGroup, programId?: string): WalletProgram | null {
  if (!programId) return null;
  return group.programs.find((p) => p.id === programId) ?? null;
}

export function buildWalletMemo(walletId: string, programId?: string): string {
  const group = getWalletGroup(walletId);
  const program = getWalletProgram(group, programId);
  return program ? program.memo : group.memo;
}

export function defaultWalletAmount(walletId: string, programId?: string): number {
  const group = getWalletGroup(walletId);
  const program = getWalletProgram(group, programId);
  return program?.defaultAmount ?? group.defaultAmount;
}