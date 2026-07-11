import * as React from 'react';

export interface ImageAnnotationRegion {
  id?: React.Key;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: React.ReactNode;
  score?: number;
  tone?: 'signal' | 'positive' | 'warning' | 'danger' | 'neutral';
}

export interface ImageAnnotationPoint {
  id?: React.Key;
  x: number;
  y: number;
  radius?: number;
  label?: React.ReactNode;
  value?: React.ReactNode;
  unit?: React.ReactNode;
  tone?: 'signal' | 'positive' | 'warning' | 'danger' | 'neutral';
}

export interface AnnotatedImageProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt: string;
  caption?: React.ReactNode;
  regions?: ImageAnnotationRegion[];
  points?: ImageAnnotationPoint[];
  annotationsVisible?: boolean;
  defaultAnnotationsVisible?: boolean;
  onAnnotationsVisibleChange?: (visible: boolean) => void;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  summaryLabel?: React.ReactNode;
  aspectRatio?: string;
  objectFit?: React.CSSProperties['objectFit'];
}

/** Image renderer for normalized regions and points. Provenance and workflow actions are composed outside. */
export function AnnotatedImage(props: AnnotatedImageProps): JSX.Element;
