import {
  RangeSlider,
  Slider,
} from '../src/index.js';
import { SliderCard as SliderCardStory } from './FormsFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Slider and Range',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-slider-and-range--range-controls',
      eyebrow: 'Core / Slider and Range',
      title: '사용자가 연속 값이나 허용 범위를 직접 움직여 조절합니다',
      description:
        '볼륨·비율·임계값처럼 값의 상대적 위치와 범위를 함께 이해해야 할 때 적합합니다. 정확한 숫자 입력에는 Number Field를, 작은 정수 단계에는 Stepper를 사용하세요.',
    },
    docs: {
      description: {
        component: '비율, 범위, 임계값처럼 연속 값을 조절하는 Slider와 RangeSlider 패턴입니다. 로컬 WDS 스냅샷은 Slider 단일 패밀리만 정의하며(Range 심볼 없음), RangeSlider는 같은 슬라이더 계약을 공유하는 LDS 확장이라 한 페이지에서 유지합니다.',
      },
    },
  },
};

export default meta;

export const RangeControls = {
  name: '개요',
  parameters: storyDescription(
    '단일 현재값과 두 끝점 범위를 나란히 조절하는 상황입니다. 손잡이 위치와 표시 값이 동기화되고 최소·최대 관계가 뒤집히지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <Slider defaultValue={72} showValue />
      <RangeSlider defaultValue={[20, 80]} showValue />
    </main>
  ),
};

export const SliderCard = { ...SliderCardStory, name: 'Slider card parity', tags: ['!dev', 'visual-parity'] };
