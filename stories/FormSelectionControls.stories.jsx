import {
  Checkbox,
  CheckboxGroup,
  ChoiceCard,
  ColorSwatch,
  FormField,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from '../src/index.js';

const semanticSwatchColors = [
  'var(--lk-accent-ink)',
  'var(--color-positive)',
  'var(--color-cautionary)',
  'var(--color-danger)',
  'var(--surface-inverse)',
];

const meta = {
  title: 'LDS Core/Components/Selection and Input/Selection Groups',
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

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <ChoiceCard presentation="frame" selected padding="lg">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <strong style={{ fontSize: 14, color: 'var(--label-normal)' }}>Framed selection</strong>
            <Checkbox label="Checkbox treatment" defaultChecked />
            <Checkbox variant="mark" label="Check mark treatment" defaultChecked />
          </div>
        </ChoiceCard>
        <ChoiceCard presentation="frame" interaction="focused" padding="lg">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <strong style={{ fontSize: 14, color: 'var(--label-normal)' }}>Focused control group</strong>
            <Input aria-label="group label" defaultValue="Selected option" />
            <Switch label="Enabled" defaultChecked />
          </div>
        </ChoiceCard>
      </section>
    </main>
  ),
};

export const ControlStateMatrix = {
  name: '컨트롤 상태',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)' }}>
        <FormField label="Checkbox states">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <Checkbox label="unchecked" state="unchecked" />
            <Checkbox label="checked" state="checked" />
            <Checkbox label="indeterminate" state="indeterminate" />
            <Checkbox label="disabled" state="checked" disable />
            <Checkbox label="small tight" size="small" tight state="checked" />
          </div>
        </FormField>
        <FormField label="Radio states">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <Radio label="unchecked" name="radio-state" value="off" state="unchecked" />
            <Radio label="checked" name="radio-state" value="on" state="checked" />
            <Radio label="disabled" name="radio-disabled" value="disabled" state="checked" disable />
            <Radio label="small tight" name="radio-tight" value="tight" state="checked" size="small" tight />
          </div>
        </FormField>
        <FormField label="Switch platform">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <Switch label="normal off" state="off" />
            <Switch label="normal on" state="on" />
            <Switch label="iOS off" platform="ios" />
            <Switch label="iOS on" platform="ios" state="on" />
            <Switch label="disabled on" state="on" disable />
          </div>
        </FormField>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Select label="정상" defaultValue="value" options={[{ value: 'value', label: '값' }, { value: 'text', label: '텍스트' }]} />
        <Select label="오류" status="negative" error="메시지를 확인해 주세요." options={[{ value: 'value', label: '값' }]} />
        <Select label="Disabled" disabled options={[{ value: 'value', label: '값' }]} />
      </section>
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
  color: 'var(--label-alternative)',
};

export const MarkTreatmentMatrix = {
  name: 'Check mark states',
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
            labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--lk-accent-ink)' }}
          />
        </div>
      </section>
    </main>
  ),
};

export const ControlInteractionMatrix = {
  name: 'Control interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={matrixGridStyle}>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Checkbox</span>
          <Checkbox label="normal" />
          <Checkbox label="hovered" interaction="hovered" />
          <Checkbox label="focused" interaction="focused" />
          <Checkbox label="custom typography" defaultChecked labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--lk-accent-ink)' }} />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Radio</span>
          <Radio label="normal" name="radio-interaction" value="normal" />
          <Radio label="hovered" name="radio-interaction" value="hovered" interaction="hovered" />
          <Radio label="focused" name="radio-interaction" value="focused" interaction="focused" />
          <Radio label="custom typography" name="radio-interaction" value="custom" checked onChange={() => {}} labelStyle={{ fontWeight: 'var(--fw-bold)', color: 'var(--lk-accent-ink)' }} />
        </div>
        <div style={matrixCellStyle}>
          <span style={matrixCaptionStyle}>Switch</span>
          <Switch label="normal" />
          <Switch label="hovered" interaction="hovered" />
          <Switch label="focused" interaction="focused" />
          <Switch label="iOS disabled" platform="ios" defaultChecked disabled />
        </div>
      </section>
    </main>
  ),
};

const FrameSample = ({ title, caption, children, ...props }) => (
  <ChoiceCard presentation="frame" tabIndex={0} {...props}>
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <strong style={{ fontSize: 14, color: 'var(--label-normal)' }}>{title}</strong>
      {caption && <span style={{ fontSize: 13, color: 'var(--label-alternative)', lineHeight: 1.45 }}>{caption}</span>}
      {children}
    </div>
  </ChoiceCard>
);

export const FrameTreatmentMatrix = {
  name: 'Framed style states',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1020 }}>
      <section style={matrixGridStyle}>
        <FrameSample title="default" caption="selected=false" />
        <FrameSample title="selected" caption="selected=true" selected />
        <FrameSample title="disabled" caption="disabled=true" disabled />
        <FrameSample title="negative" caption="status=negative" status="negative" />
        <FrameSample title="hovered" caption="interaction=hovered" interaction="hovered" />
        <FrameSample title="focused" caption="interaction=focused" interaction="focused" />
      </section>

      <section style={matrixGridStyle}>
        <FrameSample title="radius sm" radius="sm" selected />
        <FrameSample title="radius md" radius="md" selected />
        <FrameSample title="radius lg" radius="lg" selected />
        <FrameSample title="radius xl" radius="xl" selected />
      </section>

      <section style={matrixGridStyle}>
        <FrameSample title="padding sm" padding="sm" selected />
        <FrameSample title="padding md" padding="md" selected />
        <FrameSample title="padding lg" padding="lg" selected />
        <FrameSample title="padding xl" padding="xl" selected />
      </section>

      <section style={matrixGridStyle}>
        <FrameSample title="shadow none" shadow="none" selected />
        <FrameSample title="shadow sm" shadow="sm" selected />
        <FrameSample title="shadow md" shadow="md" selected />
        <FrameSample title="shadow lg" shadow="lg" selected />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <FrameSample title="input resource" caption="frame + text field" selected padding="lg">
          <Input aria-label="framed input" defaultValue="Framed input" />
        </FrameSample>
        <FrameSample title="select resource" caption="frame + open select" interaction="focused" padding="lg">
          <Select aria-label="framed select" defaultValue="value" defaultOpen options={[{ value: 'value', label: 'Value' }, { value: 'next', label: 'Next value' }]} />
        </FrameSample>
        <FrameSample title="control resource" caption="frame + checkbox/check mark" status="negative" padding="lg">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <Checkbox label="checkbox" defaultChecked />
            <Checkbox variant="mark" label="check mark" defaultChecked status="negative" />
          </div>
        </FrameSample>
      </section>
    </main>
  ),
};
