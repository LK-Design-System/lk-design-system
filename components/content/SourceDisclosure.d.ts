import * as React from 'react';

export type SourceAvailability = 'available' | 'stale' | 'missing' | 'restricted' | 'error' | 'unknown';

export interface SourceDisclosureMetadata {
  label: string;
  value: React.ReactNode;
}

export interface SourceDisclosureItem {
  id: string;
  label: React.ReactNode;
  kind?: React.ReactNode;
  location?: React.ReactNode;
  description?: React.ReactNode;
  excerpt?: React.ReactNode;
  observedAt?: React.ReactNode;
  updatedAt?: React.ReactNode;
  availability?: SourceAvailability;
  availabilityLabel?: React.ReactNode;
  metadata?: SourceDisclosureMetadata[];
  href?: string;
  actionLabel?: React.ReactNode;
  /** Accessible action name when label or actionLabel is not a plain string. */
  actionAriaLabel?: string;
  defaultExpanded?: boolean;
}

export interface SourceDisclosureProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Keeps the section name available to assistive technology when an embedding surface already supplies a visible label. */
  titleVisuallyHidden?: boolean;
  description?: React.ReactNode;
  sources?: SourceDisclosureItem[];
  emptyMessage?: React.ReactNode;
  onSourceActivate?: (source: SourceDisclosureItem) => void;
  openLabel?: React.ReactNode;
  /** Render each source as a single-line chip (opens the original on activation) instead of the bordered disclosure card. Use where a citation should read at the weight of an attachment chip — e.g. references under a chat answer. Drops inline detail disclosure, availability, and the card surface. @default false */
  compact?: boolean;
}

/** Product-provided provenance and availability without fetching or interpreting source content. */
export function SourceDisclosure(props: SourceDisclosureProps): React.JSX.Element;
