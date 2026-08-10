import * as React from 'react';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * 톤. canonical은 `signal · positive · cautionary · negative`이며 `info · success · warning · error`는
   * canonicalise 이전 소비자를 위해 동결된 별칭입니다(같은 표면으로 정규화되며 새 코드에서는 쓰지 않습니다).
   * 기본값은 canonical 표기입니다 — 이전 기본값 `"info"`는 같은 표면으로 정규화되던 별칭 표기였습니다.
   * @default "signal"
   */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'info' | 'success' | 'warning' | 'error';
  /** 표면 배치. embedded는 부모 패널 내부의 edge-to-edge 상태 띠입니다. @default "standalone" */
  variant?: 'standalone' | 'embedded';
  /** 굵은 헤드라인 줄. */
  title?: React.ReactNode;
  /** 본문 메시지. */
  children?: React.ReactNode;
  /** 끝의 액션 노드(예: 텍스트 Button). */
  action?: React.ReactNode;
  /** 닫기 버튼 표시; 클릭 시 호출. */
  onClose?: () => void;
  /** 닫기 버튼의 접근성 레이블. @default "닫기" */
  closeLabel?: string;
}

/** 인라인 공지 바 — 독립형 또는 부모 표면에 결합된 틴트 상태 띠. */
export function Banner(props: BannerProps): React.JSX.Element;
