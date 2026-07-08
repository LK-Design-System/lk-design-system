import {
  FileUpload,
  NumberField,
  PinInput,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Selection and Input/Advanced Inputs',
  parameters: {
    docs: {
      description: {
        component: '숫자, 인증 코드, 파일처럼 특수한 값을 다루는 제품 확장 입력 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const AdvancedInputs = {
  name: '고급 입력',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <NumberField aria-label="투입 대수" defaultValue={5} min={0} max={20} />
        <PinInput defaultValue="1205" length={6} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <FileUpload accept="image/*,.pdf" multiple hint="이미지 또는 문서 업로드" />
      </section>
    </main>
  ),
};
