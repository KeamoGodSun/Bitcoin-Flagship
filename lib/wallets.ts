import { Wallet as WalletIcon, GraduationCap, Calendar, Megaphone, Film, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { programsForGroup, type WalletGroupId, type WalletProgram } from '@/lib/programs';

export type { WalletGroupId, WalletProgram };

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

  const domain = siteConfig.lightningAddress.split('@')[1] || 'bitcoinflagship.org';
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

const walletGroupBase: Omit<WalletGroup, 'programs'>[] = [
  {
    id: 'flagship',
    name: '₿itcoin Flagship',
    shortName: 'Flagship',
    description: 'Support the overall movement — meetups, education, public art, and campaigns.',
    memo: 'Bitcoin Flagship tip',
    defaultAmount: 2100,
    icon: WalletIcon,
  },
  {
    id: 'education',
    name: 'Education Wallet',
    shortName: 'Education',
    description: 'Fund learning programs: first-time courses, wallet academies, and Lightning bootcamps.',
    memo: 'Bitcoin Flagship — Education',
    defaultAmount: 5000,
    icon: GraduationCap,
  },
  {
    id: 'events',
    name: 'Events Wallet',
    shortName: 'Events',
    description: 'Fund in-person moments: meet-ups, movie screenings, and game days.',
    memo: 'Bitcoin Flagship — Events',
    defaultAmount: 5000,
    icon: Calendar,
  },
  {
    id: 'activation',
    name: 'Activation & Awareness Wallet',
    shortName: 'Awareness',
    description: 'Fund public outreach: merchant on-boarding, billboards, murals, and campaigns.',
    memo: 'Bitcoin Flagship — Activation & Awareness',
    defaultAmount: 5000,
    icon: Megaphone,
  },
  {
    id: 'documentary',
    name: 'Documentary Wallet',
    shortName: 'Doccie',
    description: 'Fund production of the State Project documentary now being filmed.',
    memo: 'Bitcoin Flagship — State Project Doccie',
    defaultAmount: 5000,
    icon: Film,
  },
];

export const walletGroups: WalletGroup[] = walletGroupBase.map((group) => ({
  ...group,
  programs: programsForGroup(group.id),
}));

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
