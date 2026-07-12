import { InputGroup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Input Group',
  component: InputGroup,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-input-group--input-group-overview',
      eyebrow: 'Product / Input Group',
      title: '입력 그룹은 편집할 값과 고정된 접두사·접미사를 하나의 필드로 읽히게 합니다',
      description:
        '통화, 단위, 프로토콜처럼 사용자가 바꾸지 않는 문맥이 값 해석에 필수적일 때 사용하세요. 단순한 안내 텍스트는 Input 설명으로 제공하세요.',
    },
  },
};

export default meta;

export const InputGroupOverview = {
  name: '개요',
  parameters: storyDescription(
    '접두사와 접미사는 편집 영역과 시각적으로 연결되지만 입력값에 포함되지 않습니다.',
  ),
  render: () => (
    <main style={{ maxWidth: 520 }}>
      <InputGroup label="자산 번호" helper="ID와 개 단위는 고정된 문맥입니다." prefix="ID" suffix="개" defaultValue="12" />
    </main>
  ),
};

export const InputGroupStates = {
  name: '상태와 좁은 너비',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: 280, maxWidth: '100%' }}>
      <InputGroup label="오류" prefix="https://" suffix=".com" defaultValue="lk" error="사용할 수 없는 주소입니다." />
      <InputGroup label="완료" suffix="kg" defaultValue="24" status="positive" helper="저장되었습니다." />
      <InputGroup label="읽기 전용" prefix="ID" defaultValue="A-102" readOnly />
      <InputGroup label="비활성" suffix="ms" defaultValue="250" disabled />
    </main>
  ),
};

export const InputGroupDescriptionContract = {
  name: '설명 연결 계약',
  tags: ['!dev'],
  render: () => (
    <>
      <span id="external-input-group-description">External description</span>
      <InputGroup label="지연 시간" helper="Internal helper" suffix="ms" aria-describedby="external-input-group-description" />
    </>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const describedBy = input?.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!describedBy.includes('external-input-group-description') || describedBy.length < 2) {
      throw new Error('Consumer and internal descriptions must both remain connected.');
    }
  },
};
