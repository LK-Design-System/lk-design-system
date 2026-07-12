import {
  Dimmer,
  Spinner,
} from '../src/index.js';
import { DimmerCard as DimmerCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Dimmer',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-dimmer--dimmer-overlay',
      eyebrow: 'Core / Overlay',
      title: 'Dimmer는 처리 중인 특정 영역을 잠시 가리고 상호작용을 멈춥니다',
      description:
        '패널이나 카드 단위의 비동기 작업이 끝날 때까지 해당 영역만 사용할 수 없음을 보여줄 때 적합합니다. 페이지 전체를 막지 않아도 되는 작업에 사용하고, 진행 정도를 알려야 하면 Progress를 함께 제공하며 단순 장식용 어두운 배경에는 사용하지 마세요.',
    },
    docs: {
      description: {
        component: '특정 영역을 일시적으로 차단하고 처리 중 상태를 표시하는 Dimmer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DimmerOverlay = {
  name: '개요',
  parameters: storyDescription(
    '데이터 동기화 중인 영역 위에 blur Dimmer와 Spinner를 배치한 예시입니다. 차단 범위가 컨테이너 안에 머무르고 배경 콘텐츠와 처리 중 레이블이 구분되며 로딩 상태가 명확한지 확인하세요.',
  ),
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
