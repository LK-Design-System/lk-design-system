import * as React from 'react';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목 위 보조 라벨. */
  eyebrow?: React.ReactNode;
  /** Breadcrumb 등 제목 위 경로 슬롯. */
  breadcrumb?: React.ReactNode;
  /** 페이지 제목. */
  title: React.ReactNode;
  /** 제목 아래 설명. */
  description?: React.ReactNode;
  /** 제목 옆 상태 badge/chip 슬롯. */
  status?: React.ReactNode;
  /** 설명 아래 metadata 슬롯. */
  meta?: React.ReactNode;
  /** 우측 액션 영역. */
  actions?: React.ReactNode;
  /** 액션 영역과 본문 수직 정렬. @default "start" */
  align?: 'start' | 'center';
  /** 제목 크기. @default "md" */
  size?: 'sm' | 'md';
}

/** 앱 화면의 제목, 설명, 상태, primary action을 일관되게 배치하는 페이지 헤더. */
export function PageHeader(props: PageHeaderProps): React.JSX.Element;
