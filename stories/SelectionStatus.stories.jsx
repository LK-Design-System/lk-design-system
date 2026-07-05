import React from 'react';
import {
  Banner,
  Button,
  Callout,
  ChoiceCard,
  CircularProgress,
  EmptyState,
  FilterChip,
  Icon,
  Meter,
  MultiSelectChip,
  ProgressBar,
  SegmentedControl,
  Skeleton,
  Spinner,
  Stepper,
  Switch,
  ThemeToggle,
  ToggleButton,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/선택과 상태',
  parameters: {
    docs: {
      description: {
        component: '선택 입력과 로딩, 빈 상태, 진행 상태를 한 곳에서 확인합니다.',
      },
    },
  },
};

export default meta;

export const SelectionControls = {
  name: '선택 컨트롤',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 960 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <ChoiceCard selected icon={<Icon name="robot" />} title="AMR-07" description="실내 순찰 로봇" />
        <ChoiceCard multiple icon={<Icon name="map" />} title="지도 레이어" description="경로와 금지 구역 표시" />
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <FilterChip active count={3}>활성</FilterChip>
        <FilterChip caret>시설</FilterChip>
        <MultiSelectChip defaultSelected>야간</MultiSelectChip>
        <MultiSelectChip>외곽</MultiSelectChip>
        <ToggleButton defaultPressed icon={<Icon name="layers" size={17} />}>레이어</ToggleButton>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
        <SegmentedControl options={['상태', '지도', '로그']} defaultValue="지도" full />
        <Stepper defaultValue={3} min={0} max={10} />
        <Switch label="원격 제어 허용" defaultChecked />
        <ThemeToggle target={null} persist={false} defaultValue="light" />
      </section>
    </main>
  ),
};

export const StatusInventory = {
  name: '상태 컴포넌트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <Banner tone="info" title="지도 동기화 진행 중" action={<Button size="sm" variant="ghost">상세 보기</Button>}>
        최신 맵 데이터를 로드하고 있습니다.
      </Banner>
      <Callout tone="cautionary" title="배터리 임계값 확인" icon={<Icon name="triangle-exclamation" />}>
        배터리 20% 이하에서는 자동 복귀 미션이 우선됩니다.
      </Callout>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'center' }}>
        <CircularProgress value={72} showValue />
        <Meter label="배터리" value={47} max={100} />
        <ProgressBar label="미션 진행률" value={64} showValue />
        <Spinner label="동기화 중" />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="circle" width={56} />
        <EmptyState
          icon={<Icon name="search" />}
          title="결과 없음"
          description="선택한 조건에 해당하는 로봇이 없습니다."
          action={<Button size="sm">필터 초기화</Button>}
        />
      </section>
    </main>
  ),
};

export const SkeletonCard = {
  name: 'Skeleton card parity',
  render: () => (
    <div style={{ background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: 16, width: 300 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Skeleton variant="circle" width={44} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" lines={2} />
        </div>
      </div>
    </div>
  ),
};

export const SpinnerCard = {
  name: 'Spinner card parity',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <Spinner />
      <Spinner size={18} label="불러오는 중…" />
    </div>
  ),
};

export const ProgressBarCard = {
  name: 'ProgressBar card parity',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <ProgressBar value={68} label="업로드" showValue />
      <ProgressBar indeterminate />
    </div>
  ),
};

export const StepperCard = {
  name: 'Stepper card parity',
  render: () => {
    const [count, setCount] = React.useState(2);
    return <Stepper value={count} min={0} max={9} onChange={setCount} />;
  },
};
