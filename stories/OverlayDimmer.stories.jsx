import {
  Dimmer,
  Spinner,
} from '../src/index.js';
import { DimmerCard as DimmerCardStory } from './Overlay.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Presentation/Dimmer',
  parameters: {
    docs: {
      description: {
        component: '특정 영역을 일시적으로 차단하고 처리 중 상태를 표시하는 Dimmer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DimmerOverlay = {
  name: '디머',
  render: () => (
    <main style={{ position: 'relative', minHeight: 180, width: 320, display: 'grid', placeItems: 'center', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
      <span style={{ color: 'var(--color-semantic-label-neutral)' }}>데이터를 동기화 중입니다.</span>
      <Dimmer open blur>
        <Spinner color="var(--color-semantic-inverse-label)" label="처리 중" />
      </Dimmer>
    </main>
  ),
};

export const DimmerCard = { ...DimmerCardStory, name: 'Dimmer card parity', tags: ['!dev', 'visual-parity'] };
