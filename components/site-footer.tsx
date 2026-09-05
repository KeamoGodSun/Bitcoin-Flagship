import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Youtube, Send, MessageCircle, Zap } from 'lucide-react';
import { LightningAddress } from '@/components/lightning-address';
import { TipButton } from '@/components/tip-button';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://x.com', label: 'X / Twitter', icon: Twitter },
  { href: 'https://t.me', label: 'Telegram', icon: Send },
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
  { href: 'https://discord.com', label: 'Discord', icon: MessageCircle },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Bitcoin Flagship logo"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                ₿itcoin <span className="text-bitcoin">Flagship</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A grassroots community driving Bitcoin adoption through meetups, education, public art, and social campaigns.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">Navigate</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-bitcoin"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-foreground">Support us</h3>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-bitcoin" /> Lightning address
              </div>
              <div className="mt-2">
                <LightningAddress />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip the community in seconds — no sign-up, no middleman.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-bitcoin hover:text-bitcoin"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ₿itcoin Flagship. Permissionless &amp; open.
          </p>
          <p className="text-sm text-muted-foreground">
            Not financial advice. ₿ only.
          </p>
        </div>
      </div>
    </footer>
  );
}
