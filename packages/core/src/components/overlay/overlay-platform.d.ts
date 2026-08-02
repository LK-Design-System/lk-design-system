import * as React from 'react';

export interface OverlayRuntimeValue {
  portalTarget: HTMLElement | null;
  scopeTarget: HTMLElement | null;
  zIndexBase: number;
  direction?: 'ltr' | 'rtl';
  colorScheme?: 'light' | 'dark' | 'auto';
}

export interface OverlayRuntimeProviderProps extends Partial<OverlayRuntimeValue> {
  children?: React.ReactNode;
}

export const OverlayRuntimeContext: React.Context<OverlayRuntimeValue>;
export function OverlayRuntimeProvider(props: OverlayRuntimeProviderProps): React.JSX.Element;
export function useOverlayRuntime(): OverlayRuntimeValue;

export interface UseOverlayLayerOptions {
  open?: boolean;
  zIndex?: number;
}

export function useOverlayLayer(options?: UseOverlayLayerOptions): {
  zIndex: number;
  isTopmost: () => boolean;
};

export interface OverlayPortalProps {
  children?: React.ReactNode;
  open?: boolean;
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  anchorRef?: React.RefObject<HTMLElement | null>;
  portalRef?: React.Ref<HTMLDivElement>;
  layer?: 'anchored' | 'modal';
}

export function OverlayPortal(props: OverlayPortalProps): React.ReactPortal | React.ReactNode;
