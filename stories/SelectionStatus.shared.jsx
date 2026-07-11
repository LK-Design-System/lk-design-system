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

export const SelectionControls = {
  name: '선택 컨트롤',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 960 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <ChoiceCard selected icon={<Icon name="document" />} title="기본 플랜" description="표준 설정으로 시작" />
        <ChoiceCard multiple icon={<Icon name="layers" />} title="고급 옵션" description="추가 설정 포함" />
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <FilterChip active count={3}>활성</FilterChip>
        <FilterChip caret>그룹</FilterChip>
        <MultiSelectChip defaultSelected>중요</MultiSelectChip>
        <MultiSelectChip>검토</MultiSelectChip>
        <ToggleButton defaultPressed icon={<Icon name="layers" size={17} />}>옵션</ToggleButton>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 520 }}>
        <SegmentedControl options={['상태', '목록', '로그']} defaultValue="목록" full />
        <Stepper defaultValue={3} min={0} max={10} />
        <Switch label="자동 저장 허용" defaultChecked />
        <ThemeToggle target={null} persist={false} defaultValue="light" />
      </section>
    </main>
  ),
};

export const ChoiceCardCard = {
  name: 'ChoiceCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [sel, setSel] = React.useState('field');
    return (
      <div data-visual-crop-root style={{ width: 700, height: 160, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <ChoiceCard title="기본 플랜" description="필수 옵션만 포함" selected={sel === 'patrol'} onSelect={() => setSel('patrol')} />
          <ChoiceCard title="검토 플랜" description="승인 절차 포함" selected={sel === 'field'} onSelect={() => setSel('field')} />
          <ChoiceCard title="보관 플랜" description="읽기 전용 상태" disabled />
        </div>
      </div>
    );
  },
};

export const FilterChipCard = {
  name: 'FilterChip card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <FilterChip active>문서</FilterChip>
        <FilterChip count={3}>상태</FilterChip>
        <FilterChip caret>전체</FilterChip>
      </div>
    </div>
  ),
};

export const MultiSelectChipCard = {
  name: 'MultiSelectChip card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <MultiSelectChip defaultSelected>중요</MultiSelectChip>
        <MultiSelectChip>검토</MultiSelectChip>
        <MultiSelectChip>게시</MultiSelectChip>
      </div>
    </div>
  ),
};

export const ThemeToggleCard = {
  name: 'ThemeToggle card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [theme, setTheme] = React.useState('light');
    return (
      <div data-visual-crop-root style={{ width: 480, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <ThemeToggle value={theme} onChange={setTheme} target={null} />
          <ThemeToggle value={theme} onChange={setTheme} target={null} showLabels={false} size="sm" />
        </div>
      </div>
    );
  },
};

export const SegmentedControlCard = {
  name: 'SegmentedControl card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [lang, setLang] = React.useState('KR');
    return (
      <div data-visual-crop-root style={{ width: 480, height: 120, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <SegmentedControl options={['KR', 'EN']} value={lang} onChange={setLang} />
          <SegmentedControl options={[{ value: 'list', label: '리스트' }, { value: 'grid', label: '그리드' }, { value: 'preview', label: '미리보기' }]} defaultValue="grid" />
        </div>
      </div>
    );
  },
};

export const ToggleButtonCard = {
  name: 'ToggleButton card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [route, setRoute] = React.useState(true);
    return (
      <div data-visual-crop-root style={{ width: 380, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <ToggleButton pressed={route} onChange={setRoute} icon={<Icon name="eye" size={18} />}>미리보기</ToggleButton>
          <ToggleButton defaultPressed icon={<Icon name="star" size={18} />} />
        </div>
      </div>
    );
  },
};

export const StatusInventory = {
  name: '상태 컴포넌트',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <Banner tone="info" title="데이터 동기화 진행 중" action={<Button size="sm" variant="ghost">상세 보기</Button>}>
        최신 데이터를 불러오고 있습니다.
      </Banner>
      <Callout tone="cautionary" title="필수 항목 확인" icon={<Icon name="triangle-exclamation" />}>
        저장 전 필수 입력값을 확인합니다.
      </Callout>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', alignItems: 'center' }}>
        <CircularProgress value={72} showValue />
        <Meter label="완료율" value={47} max={100} />
        <ProgressBar label="진행률" value={64} showValue />
        <Spinner label="동기화 중" />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="circle" width={56} />
        <EmptyState
          icon={<Icon name="search" />}
          title="결과 없음"
          description="선택한 조건에 해당하는 항목이 없습니다."
          action={<Button size="sm">필터 초기화</Button>}
        />
      </section>
    </main>
  ),
};

export const BannerCard = {
  name: 'Banner card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 460, height: 180, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Banner tone="info" title="문서 업데이트" onClose={() => {}}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
        <Banner tone="warning">일부 항목에 검토가 필요합니다.</Banner>
      </div>
    </div>
  ),
};

export const CircularProgressCard = {
  name: 'CircularProgress card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 560, height: 200, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <CircularProgress value={72} showValue />
        <CircularProgress value={100} tone="positive" size={40} />
        <CircularProgress value={34} tone="cautionary" size={40} />
        <CircularProgress value={58} size={64} thickness={6} showValue />
      </div>
    </div>
  ),
};

export const SkeletonCard = {
  name: 'Skeleton card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', padding: 16, width: 300 }}>
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
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <Spinner />
      <Spinner size={18} label="불러오는 중…" />
    </div>
  ),
};

export const ProgressBarCard = {
  name: 'ProgressBar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 140, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ProgressBar value={68} label="업로드" showValue />
        <ProgressBar indeterminate />
      </div>
    </div>
  ),
};

export const EmptyStateCard = {
  name: 'EmptyState card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 420, height: 260, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', padding: 16, width: 360 }}>
        <EmptyState
          icon={<Icon name="search" size={26} />}
          title="검색 결과가 없습니다"
          description="다른 조건으로 다시 검색해 보세요."
          action={<Button variant="flat">필터 초기화</Button>}
        />
      </div>
    </div>
  ),
};

export const SwitchCard = {
  name: 'Switch card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 480, height: 120, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Switch defaultChecked label="변경 알림" />
        <Switch size="sm" defaultChecked />
        <Switch label="준비 중" disabled />
      </div>
    </div>
  ),
};

export const StepperCard = {
  name: 'Stepper card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [count, setCount] = React.useState(2);
    return <Stepper value={count} min={0} max={9} onChange={setCount} />;
  },
};
