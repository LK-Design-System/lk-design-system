import { Checkbox, CheckboxGroup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Checkbox',
  component: Checkbox,
  subcomponents: { CheckboxGroup },
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-checkbox--checkboxes',
      eyebrow: 'Core / Checkbox',
      title: '사용자가 서로 독립적인 옵션을 하나 이상 선택합니다',
      description:
        '여러 항목을 각각 켜거나 끌 수 있고 선택 조합이 허용될 때 적합합니다. 반드시 하나만 골라야 하거나 즉시 적용되는 단일 설정에는 Checkbox 대신 Radio 또는 Switch를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Checkbox와 Checkbox Group은 독립적인 다중 선택, 혼합 상태, mark 표현과 상호작용 계약을 함께 소유합니다.',
      },
    },
  },
};

export default meta;

export const Checkboxes = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 받을 알림 채널을 여러 개 선택하고 완료 후 요약 생성 여부를 별도로 정하는 상황입니다. 그룹의 다중 선택과 독립 Checkbox가 같은 mark·focus·disabled 언어를 공유하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)', color: 'var(--color-semantic-label-strong)' }}>알림 옵션</h2>
        <CheckboxGroup
          aria-label="알림 옵션"
          defaultValue={['email', 'a11y']}
          options={[
            { value: 'email', label: '이메일 알림' },
            { value: 'log', label: '변경 로그' },
            { value: 'a11y', label: '접근성 검토' },
          ]}
        />
      </section>
      <Checkbox label="완료 후 요약 생성" defaultChecked />
    </main>
  ),
};

const matrixGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 'var(--space-4)',
  alignItems: 'start',
};

const matrixCellStyle = {
  display: 'grid',
  gap: 'var(--space-3)',
  alignContent: 'start',
};

const matrixCaptionStyle = {
  fontSize: 13,
  fontWeight: 'var(--fw-bold)',
  color: 'var(--color-semantic-label-alternative)',
};

export const CheckboxStateContract = {
  name: 'Checkbox 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Checkbox label="unchecked" state="unchecked" />
      <Checkbox label="checked" state="checked" />
      <Checkbox label="indeterminate" state="indeterminate" />
      <Checkbox label="disabled" state="checked" disabled />
      <Checkbox label="small tight" size="small" tight state="checked" />
    </main>
  ),
};

export const CheckboxMarkContract = {
  name: 'Checkbox mark 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section style={matrixGridStyle}>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>State</span>
          <Checkbox variant="mark" label="unchecked" />
          <Checkbox variant="mark" label="checked" defaultChecked />
          <Checkbox variant="mark" label="negative" defaultChecked status="negative" />
          <Checkbox variant="mark" label="disabled" defaultChecked disabled />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Size and tight</span>
          <Checkbox variant="mark" label="small" size="sm" />
          <Checkbox variant="mark" label="small checked" size="sm" defaultChecked />
          <Checkbox variant="mark" label="tight label" size="sm" tight defaultChecked />
          <Checkbox variant="mark" aria-label="mark only checked" defaultChecked />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Interaction</span>
          <Checkbox variant="mark" label="normal" defaultChecked />
          <Checkbox variant="mark" label="hovered" defaultChecked interaction="hovered" />
          <Checkbox variant="mark" label="focused" defaultChecked interaction="focused" />
          <Checkbox
            variant="mark"
            label="custom label"
            defaultChecked
            labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-primary-normal)' }}
          />
        </div>
      </section>
    </main>
  ),
};

export const CheckboxInteractionContract = {
  name: 'Checkbox 상호작용 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 360 }}>
      <Checkbox label="normal" />
      <Checkbox label="hovered" interaction="hovered" />
      <Checkbox label="focused" interaction="focused" />
      <Checkbox
        label="custom typography"
        defaultChecked
        labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-primary-normal)' }}
      />
    </main>
  ),
};
