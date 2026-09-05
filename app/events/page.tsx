'use client';

import { useState } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { events, eventCategories, type EventCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventCategory>('meetups');
  const filteredEvents = events.filter((e) => e.category === activeTab);
  const activeCategory = eventCategories.find((c) => c.id === activeTab);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient-bitcoin">Events</span> &amp; Projects
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Meetups, workshops, murals, and campaigns. Find an event near you and get involved.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {eventCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:px-5',
                activeTab === cat.id
                  ? 'bg-bitcoin text-background shadow-lg shadow-bitcoin/30'
                  : 'border border-border bg-card text-muted-foreground hover:border-bitcoin/50 hover:text-foreground'
              )}
            >
              <cat.icon className="h-4 w-4" />
              <span dangerouslySetInnerHTML={{ __html: cat.label }} />
            </button>
          ))}
        </div>

        {/* Category description */}
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: activeCategory?.description ?? '' }} />
        </div>

        {/* Events grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const cat = eventCategories.find((c) => c.id === event.category);
            return (
              <div
                key={event.title}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-bitcoin">
                  {cat && <cat.icon className="h-4 w-4" />}
                  <span dangerouslySetInnerHTML={{ __html: cat?.label ?? '' }} />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: event.description }} />
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-bitcoin" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-bitcoin" />
                    <span dangerouslySetInnerHTML={{ __html: event.location }} />
                  </div>
                </div>
                <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-bitcoin transition-colors hover:text-bitcoin-light">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No events scheduled in this category yet. Check back soon.</p>
        )}
      </section>
    </div>
  );
}
