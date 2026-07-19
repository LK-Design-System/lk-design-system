import * as React from 'react';

export interface FooterEntry {
  /** 굵은 라벨(흰색 62%) — 대표전화 · 사업자등록번호 · 본사 등. */
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface FooterLink {
  label: React.ReactNode;
  href?: string;
}

export interface FooterColumn {
  heading?: React.ReactNode;
  links?: FooterLink[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** 연락 행 — 기본값: 실제 LK 대표전화 · 사업자등록번호. */
  contact?: FooterEntry[];
  /** 거점 행 — 기본값: 실제 본사(대전) · R&D 센터(서울) · 공장(고양). */
  locations?: FooterEntry[];
  /** 저작권 줄. @default "Copyright ⓒ 2024 - 2026 LK ROBOTICS Inc. All rights reserved." */
  copyright?: React.ReactNode;
  /** (확장) 브랜드 노드 — 실사이트 푸터에는 없음. */
  brand?: React.ReactNode;
  /** (확장) 링크 컬럼 — 실사이트 푸터에는 없음. */
  columns?: FooterColumn[];
  /** (확장) 정책 링크 — 저작권 줄 옆 / compact 우측. */
  links?: FooterLink[];
  /** 한 줄 앱 푸터 — 헤어라인 탑 + 뮤트 텍스트, 대시보드 바닥용. @default false */
  compact?: boolean;
  /** 실사이트 푸터에 포함된 '맨 위로' 플로팅 버튼(스크롤 600px 후 표시). @default false */
  backToTop?: boolean;
  /** 콘텐츠 컬럼 최대 폭(px). 실사이트 값. @default 1280 */
  maxWidth?: number;
  style?: React.CSSProperties;
}

/** 사이트 푸터 — 실사이트(lkrobotics-homepage) LKFooter 미러: 네이비 밴드 + 연락·거점·저작권 정보 블록. 기본값이 실데이터라 `<Footer />`만으로 프로덕션 푸터를 재현. `compact`는 대시보드용 한 줄 버전. */
export function Footer(props: FooterProps): React.JSX.Element;
