import * as React from 'react';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 톤. @default "info" */
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
