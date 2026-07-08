import {
  Icon,
  SegmentedControl,
  ToggleButton,
} from '../src/index.js';
import {
  SegmentedControlCard as SegmentedControlCardStory,
  ToggleButtonCard as ToggleButtonCardStory,
} from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Segmented and Toggle',
  parameters: {
    docs: {
      description: {
        component: '상호 배타적인 보기 전환과 단일 기능 온오프에 쓰는 SegmentedControl, ToggleButton 패턴입니다.',
      },
    },
  },
};

export default meta;

export const SegmentedAndToggle = {
  name: '세그먼트와 토글',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <SegmentedControl options={['상태', '목록', '로그']} defaultValue="목록" full />
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <ToggleButton defaultPressed icon={<Icon name="layers" size={17} />}>옵션</ToggleButton>
        <ToggleButton icon={<Icon name="eye" size={17} />}>미리보기</ToggleButton>
      </div>
    </main>
  ),
};

export const SegmentedControlMatrix = {
  name: '세그먼트 상태',
  tags: ['!dev'],
  render: () => {
    const iconOptions = [
      { value: 'list', label: '목록', icon: <Icon name="list" size={15} /> },
      { value: 'grid', label: '그리드', icon: <Icon name="apps" size={15} /> },
      { value: 'map', label: '지도', icon: <Icon name="globe" size={15} /> },
    ];
    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
        <SegmentedControl options={['상태', '목록', '로그']} defaultValue="목록" variant="solid" />
        <SegmentedControl options={['상태', '목록', '로그']} defaultValue="목록" variant="outlined" />
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <SegmentedControl options={['Small', 'Default', 'Large']} defaultValue="Small" size="small" resize="hug" />
          <SegmentedControl options={['Small', 'Default', 'Large']} defaultValue="Default" size="medium" resize="hug" />
          <SegmentedControl options={['Small', 'Default', 'Large']} defaultValue="Large" size="large" resize="hug" />
        </div>
        <SegmentedControl options={iconOptions} defaultValue="grid" variant="outlined" resize="fill" />
      </main>
    );
  },
};

export const SegmentedInteractionMatrix = {
  name: 'Segmented interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <SegmentedControl
        variant="solid"
        options={[
          { value: 'inactive', label: 'Inactive' },
          { value: 'hovered', label: 'Hovered', interaction: 'hovered' },
          { value: 'active', label: 'Active', interaction: 'active' },
          { value: 'focus', label: 'Focus', interaction: 'focused' },
        ]}
        defaultValue="inactive"
        full
      />
      <SegmentedControl
        variant="outlined"
        options={[
          { value: 'inactive', label: 'Inactive' },
          { value: 'active', label: 'Active', interaction: 'active' },
          { value: 'active-focus', label: 'Active focus', interaction: 'active-focused' },
        ]}
        defaultValue="inactive"
        full
      />
      <SegmentedControl
        variant="outlined"
        options={[
          { value: 'list', label: 'List', icon: <Icon name="list" size={15} /> },
          { value: 'grid', label: 'Grid', icon: <Icon name="apps" size={15} />, interaction: 'active-focused' },
          { value: 'map', label: 'Map', icon: <Icon name="globe" size={15} /> },
        ]}
        defaultValue="list"
        full
      />
    </main>
  ),
};

export const SegmentedControlCard = { ...SegmentedControlCardStory, name: 'SegmentedControl card parity', tags: ['!dev', 'visual-parity'] };
export const ToggleButtonCard = { ...ToggleButtonCardStory, name: 'ToggleButton card parity', tags: ['!dev', 'visual-parity'] };
