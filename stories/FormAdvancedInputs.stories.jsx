import {
  FormField,
  NumberField,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Number Field',
  component: NumberField,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-number-field--number-input',
      eyebrow: 'Product / Number Field',
      title: '숫자 필드는 허용 범위와 증감 단위를 함께 제어합니다',
      description:
        '수량·속도처럼 최소·최대와 일정한 step이 있는 값을 입력할 때 적합합니다. 범위가 없거나 숫자 외 형식을 함께 받는 값에는 Number Field 대신 Input을 사용하세요.',
    },
    docs: {
      description: {
        component: '증감 스텝과 범위를 가진 숫자 입력 NumberField 제품 확장 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const NumberInput = {
  name: '개요',
  parameters: storyDescription(
    '0~20대 범위의 로봇 투입 수를 증감하는 Number Field입니다. helper의 단위·한계와 step 제어가 같은 값 계약을 설명하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="투입 대수" helper="한 번에 투입할 로봇 수, 최대 20대">
        <NumberField aria-label="투입 대수" defaultValue={5} min={0} max={20} />
      </FormField>
    </main>
  ),
};
