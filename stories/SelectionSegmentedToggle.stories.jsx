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
  title: 'WDS Core/3 Component/3 Selection and Input/Segmented and Toggle',
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

export const SegmentedControlCard = { ...SegmentedControlCardStory, name: 'SegmentedControl card parity', tags: ['!dev', 'visual-parity'] };
export const ToggleButtonCard = { ...ToggleButtonCardStory, name: 'ToggleButton card parity', tags: ['!dev', 'visual-parity'] };
