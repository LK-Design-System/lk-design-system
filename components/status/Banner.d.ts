import * as React from 'react';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 톤. @default "info" */
  tone?: 'info' | 'success' | 'warning' | 'error';
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

/** 인라인 공지 바 — 틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기. */
export function Banner(props: BannerProps): JSX.Element;
