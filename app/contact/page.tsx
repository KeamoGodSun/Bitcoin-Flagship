'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle, Twitter, Github, Youtube, CheckCircle2 } from 'lucide-react';

const socialLinks = [
  { href: 'https://x.com', label: 'X / Twitter', icon: Twitter, handle: '@bitcoinflagship' },
  { href: 'https://t.me', label: 'Telegram', icon: Send, handle: 't.me/bitcoinflagship' },
  { href: 'https://github.com', label: 'GitHub', icon: Github, handle: 'github.com/bitcoinflagship' },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube, handle: '@bitcoinflagship' },
  { href: 'https://discord.com', label: 'Discord', icon: MessageCircle, handle: 'discord.gg/bitcoinflagship' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in <span className="text-gradient-bitcoin">Touch</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Questions, ideas, partnerships, or just want to say hello? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold">Send a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-bitcoin/30 bg-bitcoin/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-bitcoin" />
                <p className="text-sm text-foreground">
                  Thanks! Your message has been sent. We will be in touch soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-bitcoin focus:outline-none focus:ring-1 focus:ring-bitcoin"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-bitcoin focus:outline-none focus:ring-1 focus:ring-bitcoin"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-bitcoin focus:outline-none focus:ring-1 focus:ring-bitcoin"
                  placeholder="Tell us what is on your mind..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-bitcoin px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-bitcoin/30 transition-all hover:bg-bitcoin-light"
              >
                Send Message
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Contact info + social */}
          <div className="lg:pl-8">
            <h2 className="text-2xl font-bold">Other Ways to Reach Us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer a different channel? Here are all the ways you can connect with the community.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Email</h3>
                  <p className="mt-1 text-sm text-muted-foreground">hello@bitcoinflagship.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Mailing Address</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bitcoin Flagship<br />
                    PO Box 21000<br />
                    Bitcoin City, BC 00021
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mt-10 text-lg font-bold">Follow Us</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-bitcoin/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-background">
                    <social.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{social.label}</div>
                    <div className="text-xs text-muted-foreground">{social.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
