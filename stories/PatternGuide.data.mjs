export const loadingPatternGuide = {
  id: 'loading',
  storybookTitle: 'LDS Core/Patterns/Loading',
  authority: 'LDS Core',
  type: 'Pattern',
  title: 'Loading',
  applicability: '모든 LDS 제품의 비동기 작업',
  problem:
    '사용자가 무엇을 기다리고 무엇을 계속할 수 있는지 로딩 신호의 범위와 종류로 설명합니다.',
  primaryRule:
    '기다리는 대상과 같은 범위에 하나의 주 로딩 신호만 둡니다.',
  decisions: [
    {
      condition: '완성될 콘텐츠 구조를 알고 있다',
      signal: 'Skeleton',
      detail: '첫 진입의 본문·카드·표처럼 실제 레이아웃을 미리 예약합니다.',
    },
    {
      condition: '진행률을 측정할 수 있다',
      signal: 'Progress',
      detail: '업로드·변환·내보내기처럼 시작과 끝이 있는 작업의 실제 완료량을 보여 줍니다.',
    },
    {
      condition: '짧고 구조를 알 수 없는 작업이다',
      signal: 'Spinner',
      detail: '작은 control 또는 좁은 region에서 짧게 기다릴 때 사용합니다.',
    },
    {
      condition: '기존 데이터는 계속 읽을 수 있다',
      signal: 'ResourceState',
      detail: '콘텐츠를 지우지 않고 refreshing 상태와 최신성을 알립니다.',
    },
    {
      condition: '정합성 때문에 일부 영역을 멈춰야 한다',
      signal: 'Dimmer',
      detail: '필요한 region만 차단하고 aria-busy와 inert를 함께 적용합니다.',
    },
  ],
  components: [
    { name: 'Spinner', relationship: '구조와 진행률을 알 수 없는 짧은 기다림' },
    { name: 'Skeleton', relationship: '알고 있는 콘텐츠 구조의 자리 예약' },
    { name: 'Progress', relationship: '측정 가능한 작업의 실제 완료량' },
    { name: 'ResourceState', relationship: '기존 콘텐츠를 보존하는 재요청과 복구' },
    { name: 'Dimmer', relationship: '정합성 때문에 필요한 region 차단' },
  ],
  restrictedVariants: [
    {
      name: 'Brand Spinner',
      owner: 'LDS Theme',
      baseSignal: 'Spinner',
      when: '브랜드 진입점이나 제품 전환처럼 기다림과 함께 LK ROBOTICS라는 출처를 강조해야 할 때만 사용합니다.',
      avoid: '일반 콘텐츠·버튼·부분 영역 로딩에는 Core Spinner를 사용합니다.',
      storybookDocsId: 'lds-theme-status-brand-spinner--docs',
    },
  ],
  failure: [
    '실패하면 로딩 신호를 멈추고 원인과 다시 시도할 행동으로 자리를 넘깁니다.',
    '1분 이상 걸리는 작업은 취소 또는 background 전환과 완료 통지를 제공합니다.',
  ],
  accessibility: [
    'aria-busy는 실제로 갱신되는 가장 작은 범위에 적용합니다.',
    '진행 중 변화는 status로, 즉시 대응해야 하는 실패는 alert로 알립니다.',
    '기존 콘텐츠를 유지하는 동안 읽던 위치와 focus를 불필요하게 초기화하지 않습니다.',
  ],
  avoid: [
    '같은 범위에 Skeleton, Spinner, indeterminate Progress를 겹치지 않습니다.',
    '국소 작업 때문에 page 전체를 차단하지 않습니다.',
    '제품의 timeout과 재시도 정책을 디자인 시스템의 시간 기본값으로 대신하지 않습니다.',
  ],
};

export const patternGuides = [loadingPatternGuide];
