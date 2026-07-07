import {
  Checkbox,
  CheckboxGroup,
  ColorSwatch,
  FormField,
  Radio,
  RadioGroup,
  Select,
} from '../src/index.js';

const semanticSwatchColors = [
  'var(--lk-accent-ink)',
  'var(--color-positive)',
  'var(--color-cautionary)',
  'var(--color-danger)',
  'var(--surface-inverse)',
];

const meta = {
  title: 'WDS Core/3 Component/3 Selection and Input/Selection Groups',
  parameters: {
    docs: {
      description: {
        component: '드롭다운, 체크박스, 라디오, 색상 선택처럼 정해진 옵션 중 값을 고르는 폼 요소입니다.',
      },
    },
  },
};

export default meta;

export const SelectionGroups = {
  name: '선택 그룹',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        <Select
          label="작업 유형"
          defaultValue="review"
          options={[
            { value: 'draft', label: '초안' },
            { value: 'review', label: '검토' },
            { value: 'publish', label: '게시' },
          ]}
        />
        <FormField label="알림 옵션" helper="여러 항목을 동시에 선택할 수 있습니다.">
          <CheckboxGroup
            defaultValue={['email', 'a11y']}
            options={[
              { value: 'email', label: '이메일 알림' },
              { value: 'log', label: '변경 로그' },
              { value: 'a11y', label: '접근성 검토' },
            ]}
          />
        </FormField>
        <FormField label="처리 방식" required>
          <RadioGroup
            defaultValue="now"
            name="apply-mode"
            options={[
              { value: 'now', label: '즉시 적용', description: '현재 선택한 항목에 바로 반영' },
              { value: 'schedule', label: '예약 적용', description: '지정 시간에 자동 반영' },
            ]}
          />
        </FormField>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Checkbox label="완료 후 요약 생성" defaultChecked />
        <Radio label="대표 항목" name="single-radio" value="primary" checked onChange={() => {}} />
        <ColorSwatch colors={semanticSwatchColors} defaultValue={semanticSwatchColors[0]} />
      </section>
    </main>
  ),
};
