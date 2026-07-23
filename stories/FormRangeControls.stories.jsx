import { fireEvent, userEvent, waitFor } from 'storybook/test';
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
      <Slider aria-label="현재 속도" defaultValue={72} showValue />
      <RangeSlider label="허용 범위" defaultValue={[20, 80]} showValue />
    </main>
  ),
};

export const RangeStates = {
  name: '상태',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <RangeSlider label="가격 범위" minLabel="하한" maxLabel="상한" defaultValue={[30, 70]} showValue />
      <RangeSlider label="비활성 범위" defaultValue={[30, 70]} showValue disabled />
    </main>
  ),
};

export const RangeKeyboardContract = {
  name: '범위 키보드·경계 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '두 노브의 이름, 교차 금지, 경계 클램프, disabled를 키보드로 검증합니다. 노브를 끝까지 밀어도 최솟값·최댓값 노브의 정체성이 바뀌지 않아야 합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <div data-contract="range">
        <RangeSlider label="허용 범위" defaultValue={[78, 80]} min={0} max={100} showValue />
      </div>
      <div data-contract="range-disabled">
        <RangeSlider label="비활성 범위" defaultValue={[10, 40]} disabled />
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-contract="range"]');
    const group = host?.querySelector('[role="group"]');
    const [lo, hi] = host?.querySelectorAll('input[type="range"]') ?? [];
    if (!group || !lo || !hi) throw new Error('RangeSlider must expose a labelled group with two thumbs.');
    if (group.getAttribute('aria-label') !== '허용 범위') {
      throw new Error('RangeSlider must expose a group label.');
    }
    if (lo.getAttribute('aria-label') !== '허용 범위 최솟값' || hi.getAttribute('aria-label') !== '허용 범위 최댓값') {
      throw new Error('Each thumb must carry a contextual Korean name, not a hardcoded English one.');
    }

    // Both thumbs are separate keyboard stops in visual order.
    lo.focus();
    if (canvasElement.ownerDocument.activeElement !== lo) throw new Error('The low thumb must be focusable.');
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== hi) {
      throw new Error('Tab must reach the high thumb as its own stop.');
    }

    // Value moves are driven with change events: an arrow key on a native range
    // input produces one, and synthetic key events cannot trigger the browser's
    // own default action.
    lo.focus();
    fireEvent.change(lo, { target: { value: '79' } });
    await waitFor(() => {
      if (lo.value !== '79') throw new Error('One step must move the low thumb.');
    });

    // The thumbs must not cross or swap identity: the low thumb stops at the
    // high thumb's value and keeps its own name.
    fireEvent.change(lo, { target: { value: '95' } });
    await waitFor(() => {
      if (lo.value !== '80' || hi.value !== '80') {
        throw new Error(`The low thumb must stop at the high thumb (got ${lo.value} / ${hi.value}).`);
      }
    });
    if (lo.getAttribute('aria-label') !== '허용 범위 최솟값' || hi.getAttribute('aria-label') !== '허용 범위 최댓값') {
      throw new Error('A blocked thumb must keep its identity instead of swapping with its sibling.');
    }
    if (canvasElement.ownerDocument.activeElement !== lo) {
      throw new Error('Reaching the constraint must not move focus.');
    }

    // Range bound clamps on the high thumb.
    hi.focus();
    fireEvent.change(hi, { target: { value: '100' } });
    await waitFor(() => {
      if (hi.value !== '100') throw new Error('The high thumb must reach max.');
    });
    fireEvent.change(hi, { target: { value: '0' } });
    await waitFor(() => {
      if (hi.value !== '80' || lo.value !== '80') {
        throw new Error(`The high thumb must stop at the low thumb (got ${lo.value} / ${hi.value}).`);
      }
    });
    fireEvent.change(lo, { target: { value: '-20' } });
    await waitFor(() => {
      if (lo.value !== '0') throw new Error('The low thumb must clamp to min.');
    });

    const disabledThumbs = canvasElement.querySelectorAll('[data-contract="range-disabled"] input[type="range"]');
    if (disabledThumbs.length !== 2 || [...disabledThumbs].some((thumb) => !thumb.disabled)) {
      throw new Error('A disabled RangeSlider must lock both thumbs.');
    }
  },
};

export const SliderCard = { ...SliderCardStory, name: 'Slider card parity', tags: ['!dev', 'visual-parity'] };
