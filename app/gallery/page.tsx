'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Users,
  Palette,
  Store,
  Expand,
  type LucideIcon,
} from 'lucide-react';
import manifest from '@/lib/gallery-manifest.json';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GallerySection {
  id: string;
  label: string;
  images: GalleryImage[];
}

interface GalleryGroup {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  sections: GallerySection[];
}

const GROUP_META: Record<string, { label: string; description: string; icon: LucideIcon }> = {
  education: {
    label: 'Education',
    description:
      'Workshops and learning programs that make Bitcoin accessible — from Trezor Academy to My First Bitcoin.',
    icon: GraduationCap,
  },
  events: {
    label: 'Events',
    description:
      'Chess afternoons, movie nights, and regular meetups where the community connects in person.',
    icon: Users,
  },
  'public-art': {
    label: 'Public Art & Awareness',
    description:
      'Public art and billboard campaigns bringing Bitcoin visibility to the streets.',
    icon: Palette,
  },
  community: {
    label: 'Community',
    description:
      'Local businesses learning to accept Bitcoin and start stacking sats themselves.',
    icon: Store,
  },
};

function buildGroups(): GalleryGroup[] {
  const groups: GalleryGroup[] = [];

  for (const section of manifest) {
    let group = groups.find((g) => g.id === section.group);
    if (!group) {
      const meta = GROUP_META[section.group] ?? {
        label: section.groupLabel,
        description: '',
        icon: Store,
      };
      group = {
        id: section.group,
        label: meta.label,
        description: meta.description,
        icon: meta.icon,
        sections: [],
      };
      groups.push(group);
    }

    group.sections.push({
      id: section.section,
      label: section.sectionLabel,
      images: section.images.map((file) => ({
        src: `/gallery/${section.group}/${section.section}/${file}`,
        alt: `${section.sectionLabel} photo — ${section.groupLabel}`,
      })),
    });
  }

  const order = ['education', 'events', 'public-art', 'community'];
  return order
    .map((id) => groups.find((g) => g.id === id))
    .filter((g): g is GalleryGroup => Boolean(g));
}

export default function GalleryPage() {
  const groups = useMemo(buildGroups, []);
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? 'education');
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? groups[0];

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const activeSection =
    activeGroup?.sections.find((s) => s.id === activeSectionId) ?? activeGroup?.sections[0];

  const handleGroupChange = (id: string) => {
    setActiveGroupId(id);
    setActiveSectionId(null);
  };

  const images = activeSection?.images ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Photo <span className="text-gradient-bitcoin">Gallery</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Moments from our meetups, workshops, murals, and campaigns. Every picture a block in the story.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Group tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <button
                key={group.id}
                onClick={() => handleGroupChange(group.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:px-5',
                  activeGroup?.id === group.id
                    ? 'bg-bitcoin text-background shadow-lg shadow-bitcoin/30'
                    : 'border border-border bg-card text-muted-foreground hover:border-bitcoin/50 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {group.label}
              </button>
            );
          })}
        </div>

        {activeGroup && (
          <>
            {/* Group description */}
            <div className="mx-auto mt-10 max-w-2xl text-center">
              <p className="text-lg text-muted-foreground">{activeGroup.description}</p>
            </div>

            {/* Section sub-tabs (when a group has multiple sub-categories) */}
            {activeGroup.sections.length > 1 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {activeGroup.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={cn(
                      'inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-medium transition-all',
                      activeSection?.id === section.id
                        ? 'bg-secondary text-bitcoin'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}

            {/* Image grid */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {images.map((image) => (
                <Dialog key={image.src}>
                  <DialogTrigger asChild>
                    <button className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-background/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <Expand className="h-4 w-4 text-foreground" />
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="h-[85vh] max-w-5xl border-border bg-card p-0 sm:rounded-xl">
                    <div className="relative h-full w-full p-2 sm:p-3">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 80vw"
                        className="rounded-lg object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {images.length === 0 && (
              <p className="mt-12 text-center text-muted-foreground">
                No photos in this category yet. Check back soon.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}