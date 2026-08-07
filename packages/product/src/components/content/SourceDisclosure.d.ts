import * as React from 'react';
import type { StatusTone } from '@lk-design-system/lds-core/components/content/StatusBadge';

export type SourceAvailability = 'available' | 'stale' | 'missing' | 'restricted' | 'error' | 'unknown';

export type SourceDisclosureVariant = 'inline' | 'list' | 'chips';

export interface SourceDisclosureMetadata {
  label: string;
  value: React.ReactNode;
}

export interface SourceDisclosureBadge {
  label: React.ReactNode;
  /** @default "neutral" */
  tone?: StatusTone;
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
  /** Whether the user can still reach the source. Only exceptions render a badge: `available` and an omitted value stay silent, and `restricted` withholds the row entirely rather than disclosing that the source exists. */
  availability?: SourceAvailability;
  /** Replaces the default exception label. Ignored when availability is silent. */
  availabilityLabel?: React.ReactNode;
  /** A product-owned label that always shows — a verification verdict, a sensitivity class. Separate from `availability` so a source is not forced to express a judgement as a reachability state. */
  badge?: SourceDisclosureBadge;
  metadata?: SourceDisclosureMetadata[];
  href?: string;
  /** Accessible name when label is not a plain string. */
  actionAriaLabel?: string;
  /** Only applies to the `list` variant. @default false */
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
  /** `inline` collapses the sources behind a recessive "출처 N개" toggle that opens an anchored Popover, so the surrounding layout never shifts. `list` renders the bordered provenance list, one expandable row per source, for comparing several sources' state side by side. `chips` renders each source as a single-line link chip at attachment weight. @default "inline" */
  variant?: SourceDisclosureVariant;
  /** Start with the inline source popover open. Only applies to the `inline` variant. @default false */
  defaultOpen?: boolean;
  /** Sources the product withheld upstream, added to the ones this component withholds for `restricted` availability. Reported as one aggregate line; never named, and never folded into the visible source count. @default 0 */
  hiddenCount?: number;
  /** Replaces the default withheld-sources line. Name what access is needed and how to ask for it — never name the withheld source. */
  hiddenMessage?: React.ReactNode;
}

/** Product-provided provenance and availability without fetching or interpreting source content. */
export function SourceDisclosure(props: SourceDisclosureProps): React.JSX.Element;
