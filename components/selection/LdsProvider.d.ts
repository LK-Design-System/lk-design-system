import * as React from 'react';

export type LdsColorScheme = 'light' | 'dark' | 'auto';
export type LdsProfile = 'default' | 'ops';
export type LdsDirection = 'ltr' | 'rtl';

export interface LdsStorageManager {
  get(defaultValue?: LdsColorScheme): LdsColorScheme;
  set(value: LdsColorScheme): void;
  subscribe?(callback: (value: LdsColorScheme) => void): () => void;
}

export function createLocalStorageManager(options?: { key?: string }): LdsStorageManager;

export interface LdsRuntimeValue {
  colorScheme: LdsColorScheme;
  setColorScheme: React.Dispatch<React.SetStateAction<LdsColorScheme>>;
  profile: LdsProfile;
  setProfile: React.Dispatch<React.SetStateAction<LdsProfile>>;
  direction: LdsDirection;
  locale?: string;
}

export const LdsRuntimeContext: React.Context<LdsRuntimeValue>;
export function useLdsRuntime(): LdsRuntimeValue;

export interface LdsProviderProps {
  children?: React.ReactNode;
  colorScheme?: LdsColorScheme;
  defaultColorScheme?: LdsColorScheme;
  onColorSchemeChange?: (value: LdsColorScheme) => void;
  /** Runtime expression profile. `default` preserves the baseline; `ops` opts into operational density/motion/depth tokens. */
  profile?: LdsProfile;
  defaultProfile?: LdsProfile;
  onProfileChange?: (value: LdsProfile) => void;
  storageManager?: LdsStorageManager;
  storageKey?: string;
  persist?: boolean;
  /** Theme/direction DOM target. null keeps runtime context only. @default document.documentElement */
  target?: HTMLElement | string | null;
  direction?: LdsDirection;
  locale?: string;
  portalTarget?: HTMLElement | null;
  zIndexBase?: number;
}

export function LdsProvider(props: LdsProviderProps): React.JSX.Element;

export interface LdsColorSchemeScriptProps {
  storageKey?: string;
  defaultColorScheme?: LdsColorScheme;
  nonce?: string;
}

/** SSR first-paint helper that applies the stored color scheme before hydration. */
export function LdsColorSchemeScript(props: LdsColorSchemeScriptProps): React.JSX.Element;
