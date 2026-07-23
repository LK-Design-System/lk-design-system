import { userEvent, waitFor } from 'storybook/test';
import { ColorSwatch } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Color Swatch',
  component: ColorSwatch,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-color-swatch--semantic-colors',
      eyebrow: 'Product / Color Swatch',
      title: '색상 스와치는 제한된 선택지에서 의미 있는 색 하나를 고르게 합니다',
      description:
        '테마·상태처럼 제품이 허용한 소수의 색상 토큰을 선택할 때 적합합니다. 임의 색상 값 입력이나 색상 조합 편집에는 Color Swatch 대신 전용 색상 편집기를 사용하세요.',
    },
    docs: {
      description: {
        component: '선택 가능한 색상 스와치 행입니다. 테마·상태 색 지정에 쓰며, 선택된 스와치는 시그널 링과 체크 표시로 함께 표시됩니다.',
      },
    },
  },
};

export default meta;

const semanticSwatchColors = [
  { value: 'var(--color-semantic-primary-normal)', label: '브랜드 파랑' },
  { value: 'var(--color-semantic-status-positive)', label: '정상 초록' },
  { value: 'var(--color-semantic-status-cautionary)', label: '주의 노랑' },
  { value: 'var(--color-semantic-status-negative)', label: '오류 빨강' },
  { value: 'var(--color-semantic-inverse-background)', label: '반전 먹색' },
];

const accentSwatchColors = [
  { value: 'var(--color-semantic-accent-background-light-blue)', label: '연한 파랑' },
  { value: 'var(--color-semantic-accent-background-violet)', label: '보라' },
  { value: 'var(--color-semantic-accent-background-lime)', label: '라임' },
  { value: 'var(--color-semantic-accent-background-red-orange)', label: '주홍' },
];

export const SemanticColors = {
  name: '개요',
  parameters: storyDescription(
    '상태와 브랜드 역할이 정해진 semantic token 목록에서 하나를 선택합니다. 선택 링이 색 자체와 충분히 구분되고 값의 의미가 색상명 없이도 제공되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch colors={semanticSwatchColors} defaultValue={semanticSwatchColors[0].value} label="상태 색 선택" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="radiogroup"]');
    const radios = [...(group?.querySelectorAll('[role="radio"]') ?? [])];
    if (!group || radios.length !== semanticSwatchColors.length) {
      throw new Error('ColorSwatch must expose one radio per colour inside a single radiogroup.');
    }
    if (group.getAttribute('aria-label') !== '상태 색 선택') {
      throw new Error('The swatch group must carry its own accessible name.');
    }

    radios.forEach((radio, index) => {
      const name = radio.getAttribute('aria-label');
      if (name !== semanticSwatchColors[index].label) {
        throw new Error(`Swatch ${index} must be named by its Korean colour name, but it is named "${name}".`);
      }
      if (/^(#|var\(|rgb|hsl)/.test(name ?? '')) {
        throw new Error('A raw CSS colour value must never be used as the accessible name.');
      }
    });

    const checked = radios.filter((radio) => radio.getAttribute('aria-checked') === 'true');
    if (checked.length !== 1 || checked[0] !== radios[0]) {
      throw new Error('The selected swatch must be the only one exposing aria-checked="true".');
    }
    /* WCAG 1.4.1 — 선택을 링 색만으로 전달하지 않도록 체크 표시가 함께 있어야 한다. */
    if (!checked[0].querySelector('svg')) {
      throw new Error('The selected swatch needs a non-colour cue (check mark), not only a coloured ring.');
    }
    if (radios.some((radio) => radio !== checked[0] && radio.querySelector('svg'))) {
      throw new Error('Only the selected swatch may paint the check mark.');
    }

    const tabStops = radios.filter((radio) => radio.tabIndex === 0);
    if (tabStops.length !== 1) {
      throw new Error(`An APG radio group must keep exactly one Tab stop, but found ${tabStops.length}.`);
    }
  },
};

export const CircleShape = {
  name: '시나리오 · 원형 모양',
  parameters: storyDescription(
    '같은 선택 계약을 원형 32px 스와치로 표현합니다. 모양이 달라져도 선택 표시와 클릭 영역이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch
        colors={accentSwatchColors}
        defaultValue={accentSwatchColors[0].value}
        shape="circle"
        size={32}
        label="강조 색 선택"
      />
    </main>
  ),
};

export const NoSelection = {
  name: '변형·상태 · 선택 전 상태',
  parameters: storyDescription(
    '아직 기본값을 정하지 않은 스와치 목록입니다. 어떤 항목도 선택된 것으로 오인되지 않고 첫 선택이 명확히 반영되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch colors={accentSwatchColors} label="강조 색 선택" />
    </main>
  ),
};

const keyboardSwatchColors = [
  { value: 'var(--color-semantic-primary-normal)', label: '브랜드 파랑' },
  { value: 'var(--color-semantic-status-positive)', label: '정상 초록' },
  { value: 'var(--color-semantic-status-cautionary)', label: '주의 노랑', disabled: true },
  { value: 'var(--color-semantic-status-negative)', label: '오류 빨강' },
];

export const KeyboardContract = {
  name: '색상 선택 키보드 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch
        colors={keyboardSwatchColors}
        defaultValue={keyboardSwatchColors[0].value}
        label="키보드 계약 색 선택"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const radios = [...canvasElement.querySelectorAll('[role="radio"]')];
    if (radios.length !== 4) throw new Error('The ColorSwatch keyboard fixture is incomplete.');

    const disabledRadio = radios[2];
    if (!disabledRadio.disabled || disabledRadio.tabIndex !== -1) {
      throw new Error('A disabled swatch must stay out of the Tab order.');
    }
    if (radios.filter((radio) => radio.tabIndex === 0).length !== 1 || radios[0].tabIndex !== 0) {
      throw new Error('The single Tab stop must start on the selected swatch.');
    }

    radios[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (doc.activeElement !== radios[1] || radios[1].getAttribute('aria-checked') !== 'true') {
        throw new Error('ArrowRight must move focus and selection to the next enabled swatch.');
      }
    });

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => {
      if (doc.activeElement !== radios[3] || radios[3].getAttribute('aria-checked') !== 'true') {
        throw new Error('Arrow navigation must skip disabled swatches.');
      }
    });

    if (radios.filter((radio) => radio.tabIndex === 0).length !== 1) {
      throw new Error('Moving the roving focus must never create a second Tab stop.');
    }

    await userEvent.keyboard('{End}');
    await waitFor(() => {
      if (doc.activeElement !== radios[3]) throw new Error('End must land on the last enabled swatch.');
    });

    /* 시각 스냅샷은 play 종료 상태를 캡처하므로 스토리의 이름난 상태로 복구한다. */
    await userEvent.keyboard('{Home}');
    await waitFor(() => {
      if (radios[0].getAttribute('aria-checked') !== 'true' || radios[3].getAttribute('aria-checked') !== 'false') {
        throw new Error('Home must restore the first swatch so the story finishes in its named state.');
      }
    });
    doc.activeElement?.blur();
  },
};
