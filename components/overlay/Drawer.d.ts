import * as React from 'react';

export interface DrawerProps {
  /** 열림 상태. @default false */
  open?: boolean;
  /** 슬라이드인 방향. @default "right" */
  side?: 'left' | 'right';
  /** 패널 너비(px). @default 380 */
  width?: number;
  /** 패널 표면. "brand"는 chrome(제목 행·닫기 버튼·구분선·본문)까지 네이비 브랜드 표면으로 렌더링합니다. 어두운 masthead와 brand SideNav를 함께 쓰는 모바일 셸에서 표면이 끊기지 않게 합니다. @default "default" */
  appearance?: 'default' | 'brand';
  /** Drawer의 chrome/body 밀도. body의 density-aware 자식은 이를 상속하며 명시적 size/padding/density가 우선합니다. @default "comfortable" */
  density?: 'comfortable' | 'compact';
  title?: React.ReactNode;
  /** 제목 아래의 짧은 보조 설명. dialog의 `aria-describedby`와 연결됩니다. */
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Escape, scrim, 닫기 액션이 호출하는 controlled dismiss callback. */
  onClose?: () => void;
  /** scrim 클릭으로 닫기. @default true */
  closeOnScrim?: boolean;
  /** 열릴 때 우선 초점을 받을 Drawer 내부 요소. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** 닫힌 뒤 trigger 또는 `returnFocusRef`로 초점을 복원합니다. @default true */
  restoreFocus?: boolean;
  /** `title`이 없을 때 사용할 접근 가능한 이름. @default "서랍 패널" */
  ariaLabel?: string;
  /** 닫기 버튼의 접근 가능한 이름. @default "닫기" */
  closeLabel?: string;
  /** Render at the owner-document Portal boundary. @default true */
  withinPortal?: boolean;
  portalTarget?: HTMLElement | null;
  zIndex?: number;
  /** 스크롤 body의 padding·layout을 조합별로 조정합니다. */
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

/** 네이비 스크림 위 사이드 패널 — 필터 / 상세 / 설정. */
export function Drawer(props: DrawerProps): React.JSX.Element | null;

export interface DrawerSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Drawer 본문 안의 보이는 하위 제목. */
  title: React.ReactNode;
  /** 제목 아래의 짧은 설명. */
  description?: React.ReactNode;
  /** 문서 구조에 맞는 제목 레벨. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** 제목 행 우측의 보조 액션. */
  actions?: React.ReactNode;
  /** 앞 섹션과 구분선·상단 간격을 추가합니다. @default false */
  divider?: boolean;
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Drawer density를 상속하는 의미 있는 본문 하위 구획. */
export function DrawerSection(props: DrawerSectionProps): React.JSX.Element;
