import * as React from 'react';

export interface LanguageSwitcherLocale {
  /** Stable BCP 47 locale value passed to `onChange`. */
  value: string;
  /** Native-language label, for example `한국어` or `English`. */
  label: React.ReactNode;
  /** Language applied to the visible label. Defaults to `value`. */
  lang?: string;
  /** Keep the locale visible but unavailable. @default false */
  disabled?: boolean;
}

export interface LanguageSwitcherChangeMetadata {
  locale: LanguageSwitcherLocale;
}

export interface LanguageSwitcherProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Available locales, preferably labeled in each language's native form. */
  locales: readonly LanguageSwitcherLocale[];
  /** Controlled current locale. Must match one `locales[].value`. */
  value: string;
  /** Reports the requested locale. Translation, routing, persistence, and document language remain app-owned. */
  onChange: (
    nextValue: string,
    metadata: LanguageSwitcherChangeMetadata,
  ) => void;
  /** Accessible name for the menu button. Localize this with the surrounding UI. @default "언어 선택" */
  ariaLabel?: string;
  /** Menu alignment relative to the trigger. @default "right" */
  align?: 'left' | 'right';
  /** Use the inverse trigger treatment on a dark TopBar surface. @default false */
  onDark?: boolean;
  /** Disable the trigger and every locale option. @default false */
  disabled?: boolean;
}

/** Controlled TopBar globe menu built from the LDS IconButton and DropdownMenu contracts. */
export function LanguageSwitcher(
  props: LanguageSwitcherProps,
): React.JSX.Element;
