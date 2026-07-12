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
        component: '선택 가능한 색상 스와치 행입니다. 테마·상태 색 지정에 쓰며, 선택된 스와치는 시그널 링으로 표시됩니다.',
      },
    },
  },
};

export default meta;

const semanticSwatchColors = [
  'var(--color-semantic-primary-normal)',
  'var(--color-semantic-status-positive)',
  'var(--color-semantic-status-cautionary)',
  'var(--color-semantic-status-negative)',
  'var(--color-semantic-inverse-background)',
];

const accentSwatchColors = [
  'var(--color-semantic-accent-background-light-blue)',
  'var(--color-semantic-accent-background-violet)',
  'var(--color-semantic-accent-background-lime)',
  'var(--color-semantic-accent-background-red-orange)',
];

export const SemanticColors = {
  name: '개요',
  parameters: storyDescription(
    '상태와 브랜드 역할이 정해진 semantic token 목록에서 하나를 선택합니다. 선택 링이 색 자체와 충분히 구분되고 값의 의미가 색상명 없이도 제공되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch colors={semanticSwatchColors} defaultValue={semanticSwatchColors[0]} />
    </main>
  ),
};

export const CircleShape = {
  name: '시나리오 · 원형 모양',
  parameters: storyDescription(
    '같은 선택 계약을 원형 32px 스와치로 표현합니다. 모양이 달라져도 선택 표시와 클릭 영역이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 360 }}>
      <ColorSwatch colors={accentSwatchColors} defaultValue={accentSwatchColors[0]} shape="circle" size={32} />
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
      <ColorSwatch colors={accentSwatchColors} />
    </main>
  ),
};
