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
  /**
   * False when we have no published address for this wallet. The UI must not
   * render a copy button or a lightning: link in that state, because an
   * address nobody controls looks exactly like one that does.
   */
  configured: boolean;
  programs: WalletProgram[];
}

/**
 * Resolves a wallet's published address, or '' when we do not have one.
 *
 * Every bucket currently receives at the published Blink address, with an
 * optional per-wallet override for splitting a bucket out later. We never
 * derive an address from the domain: an unknown wallet resolves to '' so the
 * interface can say it is not published yet instead of showing an address
 * nobody controls.
 */
export function walletAddress(walletId: WalletGroupId): string {
  if (walletId === 'flagship') return siteConfig.lightningAddress;

  const overrides = parseAddressOverrides();
  const override = overrides[walletId];
  if (override) return override;

  if (walletId === 'documentary') return siteConfig.documentaryLightningAddress;

  return siteConfig.lightningAddress;
}

export function isWalletConfigured(walletId: WalletGroupId): boolean {
  return walletAddress(walletId).trim().length > 0;
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

const walletGroupBase: Omit<WalletGroup, 'programs' | 'configured'>[] = [
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
    description: 'Fund Au∞₿ La₿s curriculum development, wallet workshops, and Lightning bootcamps.',
    memo: 'Bitcoin Flagship — Education',
    defaultAmount: 5000,
    icon: GraduationCap,
  },
  {
    id: 'events',
    name: 'Events & Conferences Wallet',
    shortName: 'Events',
    description: 'Fund in-person moments: The Blooming Women Empowerment Conference, meetups, movie nights, and game days.',
    memo: 'Bitcoin Flagship — Events',
    defaultAmount: 5000,
    icon: Calendar,
  },
  {
    id: 'activation',
    name: 'Activation & Awareness Wallet',
    shortName: 'Awareness',
    description: 'Fund Bitcoin Sisonke merchant onboarding, community murals, and digital billboards.',
    memo: 'Bitcoin Flagship — Activation & Awareness',
    defaultAmount: 5000,
    icon: Megaphone,
  },
  {
    id: 'documentary',
    name: 'Documentary Wallet',
    shortName: 'Doccie',
    description: 'Fund production of the State Project Doccie — camera and sound gear, travel, and post-production.',
    memo: 'Bitcoin Flagship — State Project Doccie',
    defaultAmount: 5000,
    icon: Film,
  },
];

export const walletGroups: WalletGroup[] = walletGroupBase.map((group) => ({
  ...group,
  configured: isWalletConfigured(group.id),
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
