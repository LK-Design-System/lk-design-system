import * as React from 'react';

export interface DashboardShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `header`/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. */
  header?: React.ReactNode;
  /** 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. */
  navigation?: React.ReactNode;
  /** 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. */
  narrowNavigation?: React.ReactNode;
  /** 좁은 화면에서 modal Drawer로 표시할 계층형 탐색 슬롯. 제공하면 좁은 화면에서 넓은 navigation은 숨고 본문은 그대로 유지됩니다. */
  temporaryNavigation?: React.ReactNode;
  /** temporaryNavigation Drawer의 제품 소유 열린 상태. 넓은 화면에서는 렌더되지 않습니다. @default false */
  temporaryNavigationOpen?: boolean;
  /** Escape, scrim, 닫기 버튼으로 temporaryNavigation을 닫아 달라는 요청. */
  onTemporaryNavigationClose?: () => void;
  /** 헤더 trigger의 `aria-controls`와 연결할 Drawer dialog id. 생략하면 내부 id를 생성합니다. */
  temporaryNavigationId?: string;
  /** Drawer에 보이는 탐색 제목. */
  temporaryNavigationTitle?: React.ReactNode;
  /** Drawer dialog와 내부 navigation의 접근 가능한 이름. @default "주 탐색" */
  temporaryNavigationLabel?: string;
  /** Drawer 닫기 버튼의 접근 가능한 이름. @default "탐색 닫기" */
  temporaryNavigationCloseLabel?: string;
  /** temporaryNavigation Drawer 너비(px). @default 320 */
  temporaryNavigationWidth?: number;
  /** Drawer가 열릴 때 우선 초점을 받을 내부 요소. */
  temporaryNavigationInitialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Drawer가 닫힐 때 초점을 복원할 persistent trigger. */
  temporaryNavigationReturnFocusRef?: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
  /** auto는 768px 미만에서 좁은 구성을 사용합니다. @default "auto" */
  layout?: 'auto' | 'wide' | 'narrow';
  /** header-first는 전폭 header 아래에 탐색을 두고, side-first는 넓은 화면에서 탐색을 전체 높이의 첫 열에 둡니다. @default "header-first" */
  topology?: 'header-first' | 'side-first';
  /** main landmark id. 생략하면 인스턴스별 id를 생성합니다. */
  mainId?: string;
  /** main landmark의 접근 가능한 이름. */
  mainLabel?: string;
  mainClassName?: string;
  mainStyle?: React.CSSProperties;
  /** 첫 focus 대상인 건너뛰기 링크 문구. @default "본문으로 건너뛰기" */
  skipLabel?: string;
  /** 넓은 화면 navigation의 기본 접근 가능한 이름. @default "주 탐색" */
  navigationLabel?: string;
  /** 좁은 화면 navigation의 기본 접근 가능한 이름. @default "주 탐색" */
  narrowNavigationLabel?: string;
}

/** header/navigation/main landmark, desktop topology, 넓은·좁은 탐색 전환을 조합하는 제품 대시보드 셸. */
export function DashboardShell(props: DashboardShellProps): React.JSX.Element;
