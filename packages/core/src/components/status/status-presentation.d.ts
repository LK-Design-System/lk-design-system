import * as React from 'react';

export type StatusTone = 'positive' | 'cautionary' | 'negative' | 'signal' | 'offline';
export type StatusToneAlias =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'critical'
  | 'error'
  | 'neutral'
  | 'normal'
  | 'online';

export interface StatusTonePresentation {
  icon: string;
  foreground: string;
  surface: string;
  border: string;
}

export const STATUS_TONE_STYLE: Readonly<Record<StatusTone, Readonly<StatusTonePresentation>>>;

/** 상태 별칭을 canonical tone으로 정규화한다. 알 수 없는 값은 fallback을 반환한다. */
export function normalizeStatusTone(
  tone?: StatusTone | StatusToneAlias | (string & {}) | null,
  fallback?: StatusTone,
): StatusTone;

/** 정규화된 상태 tone의 아이콘·전경·표면·테두리 토큰 묶음. */
export function statusToneStyle(
  tone?: StatusTone | StatusToneAlias | (string & {}) | null,
  fallback?: StatusTone,
): Readonly<StatusTonePresentation>;

/** 패널 안에 flush하게 배치되는 상태 band의 공용 배경·hairline geometry. */
export function embeddedBandStyle(
  presentation: Pick<StatusTonePresentation, 'surface' | 'border'>,
): React.CSSProperties;
