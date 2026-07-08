import {
  FileUpload,
  Icon,
  Input,
  InputGroup,
  NumberField,
  PasswordInput,
  PinInput,
  Select,
  Textarea,
} from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Text Input',
  parameters: {
    docs: {
      description: {
        component: '텍스트, 숫자, 비밀번호, 코드, 파일, 긴 문장을 입력하는 기본 폼 요소입니다.',
      },
    },
  },
};

export default meta;

export const TextInputs = {
  name: '텍스트 입력',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Input label="프로젝트 이름" defaultValue="Design System" iconLeft={<Icon name="document" size={18} />} />
        <PasswordInput defaultValue="design-system" />
        <InputGroup prefix="ID" suffix="개" defaultValue="12" />
        <NumberField defaultValue={5} min={0} max={20} />
        <PinInput defaultValue="1205" length={6} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Textarea label="검토 메모" defaultValue="모바일 화면에서 줄바꿈과 도움말 위치를 확인합니다." rows={4} />
        <FileUpload accept="image/*,.pdf" multiple hint="이미지 또는 문서 업로드" />
      </section>
    </main>
  ),
};

const fieldMatrixStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 'var(--space-4)',
  alignItems: 'start',
};

export const TextInputStateMatrix = {
  name: '텍스트 입력 상태',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={fieldMatrixStyle}>
        <Input label="기본" placeholder="텍스트를 입력해 주세요." helper="메시지와 도움말을 표시합니다." />
        <Input label="포커스 예시" defaultValue="값" iconLeft={<Icon name="search" size={17} />} helper="왼쪽 아이콘 슬롯" />
        <Input label="정상" defaultValue="검증 완료" status="positive" helper="사용 가능한 값입니다." />
        <Input label="오류" placeholder="텍스트를 입력해 주세요." error="메시지를 확인해 주세요." required />
      </section>

      <section style={fieldMatrixStyle}>
        <Input label="Small" size="sm" placeholder="small" />
        <Input label="Medium" size="md" placeholder="medium" />
        <Input label="Large" size="lg" placeholder="large" />
        <Input
          label="우측 액션"
          defaultValue="검색어"
          actionRight={<button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--lk-accent-ink)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>확인</button>}
        />
      </section>

      <section style={fieldMatrixStyle}>
        <Textarea label="Textarea" helper="긴 문장 입력 상태입니다." defaultValue="청춘이 느끼는 등기한 하여도 가슴이 설레는 말이다." rows={3} />
        <Textarea label="Textarea 오류" error="메시지를 확인해 주세요." defaultValue="청춘이 느끼는 등기한 하여도 가슴이 설레는 말이다." rows={3} />
        <Select
          label="Select text"
          defaultValue="value"
          options={[{ value: 'value', label: '값' }, { value: 'review', label: '검토' }]}
          helper="텍스트 렌더"
        />
        <Select
          label="Select chip"
          render="chip"
          defaultValue="review"
          options={[{ value: 'value', label: '값' }, { value: 'review', label: '텍스트' }]}
          iconLeft={<Icon name="filter" size={16} />}
          helper="칩 렌더와 leading icon"
        />
      </section>
    </main>
  ),
};

export const TextInputInteractionMatrix = {
  name: 'Text input interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1020 }}>
      <section style={fieldMatrixStyle}>
        <Input label="normal" placeholder="Type text" />
        <Input label="hovered" placeholder="Type text" interaction="hovered" />
        <Input label="focused" defaultValue="Focused value" interaction="focused" />
        <Input label="disabled" placeholder="Disabled" disabled />
      </section>

      <section style={fieldMatrixStyle}>
        <Input label="active" defaultValue="Active value" active />
        <Input label="focus alias" defaultValue="Focus value" focus />
        <Input
          label="trailing button"
          defaultValue="Selected keyword"
          leadingIcon={<Icon name="search" size={16} />}
          trailingButton={<button type="button" style={{ border: 0, background: 'transparent', color: 'var(--lk-accent-ink)', fontWeight: 'var(--fw-bold)' }}>Clear</button>}
        />
        <Input label="disable alias" placeholder="Disabled" disable />
      </section>

      <section style={fieldMatrixStyle}>
        <Input label="required" placeholder="Required" required />
        <Input label="positive" defaultValue="Validated" status="positive" helper="Available value." />
        <Input label="negative" placeholder="Error value" status="negative" error="Check this message." />
        <Input label="readonly" defaultValue="Read only value" readOnly helper="Read-only treatment." />
      </section>

      <section style={fieldMatrixStyle}>
        <Textarea label="textarea hover" defaultValue="Long text value" interaction="hovered" rows={3} />
        <Textarea label="textarea focus" defaultValue="Long text value" interaction="focused" rows={3} />
        <Textarea label="textarea disabled" defaultValue="Long text value" disabled rows={3} />
        <Textarea label="textarea fixed" defaultValue="Fixed resize" resize="fixed" rows={3} />
        <Textarea label="textarea limit" defaultValue="Limited resize" resize="limit" rows={3} />
      </section>

      <section style={fieldMatrixStyle}>
        <Select
          label="select normal"
          defaultValue="alpha"
          options={[{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }]}
        />
        <Select
          label="select hovered"
          interaction="hovered"
          options={[{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }]}
        />
        <Select
          label="select open"
          defaultValue="alpha"
          interaction="open"
          options={[{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }, { value: 'gamma', label: 'Gamma' }]}
        />
        <Select
          label="select overflow chip"
          render="chip"
          active
          defaultValue="long"
          iconLeft={<Icon name="filter" size={16} />}
          options={[{ value: 'long', label: 'Very long selected value for overflow' }, { value: 'short', label: 'Short' }]}
        />
        <Select
          label="select negative alias"
          negative
          error="Check this message."
          options={[{ value: 'alpha', label: 'Alpha' }]}
        />
        <Select
          label="select disable alias"
          disable
          options={[{ value: 'alpha', label: 'Alpha' }]}
        />
      </section>
    </main>
  ),
};
