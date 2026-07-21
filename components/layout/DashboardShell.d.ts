import * as React from 'react';

export interface DashboardShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `header`/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. */
  header?: React.ReactNode;
  /** 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. */
  navigation?: React.ReactNode;
  /** 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. */
  narrowNavigation?: React.ReactNode;
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
