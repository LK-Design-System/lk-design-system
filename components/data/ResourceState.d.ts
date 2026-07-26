import * as React from 'react';

export type ResourceStateValue =
  | 'ready'
  | 'loading'
  | 'refreshing'
  | 'empty'
  | 'error'
  | 'stale'
  | 'offline'
  | 'restricted';

export interface ResourceStateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** 표시할 리소스 상태. @default "ready" */
  state?: ResourceStateValue;
  /** 상태의 기본 제목을 대체합니다. */
  title?: React.ReactNode;
  /** 상태의 기본 설명을 대체합니다. */
  description?: React.ReactNode;
  /** 재시도, 필터 초기화, 권한 요청처럼 제품이 실행을 소유하는 액션입니다. */
  action?: React.ReactNode;
  /** 마지막으로 정상 데이터를 확인한 시각이나 설명입니다. */
  lastUpdated?: React.ReactNode;
  /** 마지막 업데이트 접두 레이블. @default "마지막 업데이트" */
  lastUpdatedLabel?: React.ReactNode;
  /** 기본 Skeleton 구성을 대체하는 로딩 콘텐츠입니다. */
  loadingContent?: React.ReactNode;
  /** 상태 메시지 표면 모양. 부모 표면과 결합할 때만 "embedded"를 명시합니다. @default "standalone" */
  messageVariant?: 'standalone' | 'embedded';
  /** 차단 상태 제목의 heading 단계. 감싸는 표면의 제목보다 한 단계 아래를 전달합니다. @default 3 */
  headingLevel?: number;
  /** ready 상태의 콘텐츠 또는 refreshing/error/stale/offline에서 유지할 마지막 정상 콘텐츠입니다. 콘텐츠를 유지하면 오류·오프라인도 polite 상태로 알립니다. */
  children?: React.ReactNode;
}

/** 리소스의 로딩·빈 상태·오류·freshness를 일관되게 표현하는 LDS Product 조합 컴포넌트입니다. */
export function ResourceState(props: ResourceStateProps): React.JSX.Element;
