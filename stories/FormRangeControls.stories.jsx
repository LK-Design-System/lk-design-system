import {
  RangeSlider,
  Slider,
} from '../src/index.js';
import { SliderCard as SliderCardStory } from './FormsFull.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/3 Selection and Input/Slider and Range',
  parameters: {
    docs: {
      description: {
        component: '비율, 범위, 임계값처럼 연속 값을 조절하는 Slider와 RangeSlider 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RangeControls = {
  name: '슬라이더와 범위',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <Slider defaultValue={72} showValue />
      <RangeSlider defaultValue={[20, 80]} showValue />
    </main>
  ),
};

export const SliderCard = { ...SliderCardStory, name: 'Slider card parity', tags: ['!dev', 'visual-parity'] };
