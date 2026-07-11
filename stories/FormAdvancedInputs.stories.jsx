import {
  FormField,
  NumberField,
  PinInput,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Advanced Inputs',
  parameters: {
    docs: {
      description: {
        component: '숫자와 인증 코드처럼 일반 Text Input보다 구체적인 입력 계약이 필요한 제품 확장 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const AdvancedInputs = {
  name: '고급 입력',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 520 }}>
      <FormField label="투입 대수" helper="한 번에 투입할 로봇 수, 최대 20대">
        <NumberField aria-label="투입 대수" defaultValue={5} min={0} max={20} />
      </FormField>
      <FormField label="인증 코드" helper="6자리 코드를 입력하세요.">
        <PinInput aria-label="인증 코드" defaultValue="1205" length={6} />
      </FormField>
    </main>
  ),
};
