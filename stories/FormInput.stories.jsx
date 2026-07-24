import { Icon, Input } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const fieldGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 'var(--space-4)',
  alignItems: 'start',
};

const inlineActionStyle = {
  minWidth: 24,
  minHeight: 24,
  padding: '0 2px',
  border: 0,
  background: 'transparent',
  color: 'var(--color-semantic-primary-normal)',
  fontWeight: 'var(--fw-bold)',
  cursor: 'pointer',
};

const meta = {
  title: 'LDS Core/Components/Selection and Input/Input',
  component: Input,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-input--input-overview',
      eyebrow: 'Core / Input',
      title: '입력 필드는 짧은 한 줄 값을 label·상태·도움말과 함께 받습니다',
      description:
        '이름·검색어·코드처럼 한 줄로 끝나는 텍스트를 입력할 때 적합합니다. 긴 문장은 Textarea를, 민감한 비밀번호는 Password Input을, 단위가 결합된 값은 Input Group을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'WDS Textinput/Textfield 정의에 맞춘 한 줄 입력입니다. label, helper/error, leading icon, trailing action, size와 interaction 상태를 소유합니다.',
      },
    },
  },
};

export default meta;

export const InputOverview = {
  name: '개요',
  parameters: storyDescription(
    '프로젝트 이름을 문서 아이콘과 함께 입력한 기본 상태입니다. label·현재 값·leading icon이 하나의 필드로 읽히고 텍스트 영역을 방해하지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 520 }}>
      <Input label="프로젝트 이름" defaultValue="로봇 관제 시스템" iconLeft={<Icon name="document" size={18} />} />
    </main>
  ),
};

export const TimerAndActions = {
  name: '사용법 · 남은 시간과 우측 동작',
  parameters: storyDescription(
    '인증 코드 입력의 남은 시간을 actionRight로 표시하고 만료 후 재전송 버튼으로 전환합니다. 상태 변화 뒤에도 label·helper·action의 관계가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <section style={fieldGrid}>
        <Input
          label="인증 코드"
          placeholder="6자리 코드"
          inputMode="numeric"
          actionRight={<span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-semantic-status-negative-text)', fontWeight: 'var(--fw-bold)', fontSize: 13 }}>02:59</span>}
          helper="타이머는 actionRight 슬롯으로 합성합니다."
        />
        <Input
          label="인증 코드 (만료됨)"
          placeholder="6자리 코드"
          actionRight={<button type="button" style={inlineActionStyle}>재전송</button>}
          helper="만료 후 actionRight를 재전송 버튼으로 전환합니다."
        />
      </section>
    </main>
  ),
};

export const InputStateMatrix = {
  name: 'Input states',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={fieldGrid}>
        <Input label="기본" placeholder="텍스트를 입력해 주세요." helper="메시지와 도움말을 표시합니다." />
        <Input label="포커스 예시" defaultValue="값" iconLeft={<Icon name="search" size={17} />} helper="왼쪽 아이콘 슬롯" />
        <Input label="정상" defaultValue="검증 완료" status="positive" helper="사용 가능한 값입니다." />
        <Input label="오류" placeholder="텍스트를 입력해 주세요." error="메시지를 확인해 주세요." required />
      </section>
      <section style={fieldGrid}>
        <Input label="Small" size="sm" placeholder="small" />
        <Input label="Medium" size="md" placeholder="medium" />
        <Input label="Large" size="lg" placeholder="large" />
        <Input
          label="우측 액션"
          defaultValue="검색어"
          actionRight={<button type="button" style={inlineActionStyle}>확인</button>}
        />
      </section>
    </main>
  ),
};

export const InputInteractionMatrix = {
  name: 'Input interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1020 }}>
      <section style={fieldGrid}>
        <Input label="normal" placeholder="텍스트를 입력해 주세요." />
        <Input label="hovered" placeholder="텍스트를 입력해 주세요." interaction="hovered" />
        <Input label="focused" defaultValue="포커스 값" interaction="focused" />
        <Input label="disabled" placeholder="비활성" disabled />
      </section>
      <section style={fieldGrid}>
        <Input label="active" defaultValue="활성 값" active />
        <Input label="focus alias" defaultValue="포커스 값" focus />
        <Input
          label="trailing button"
          defaultValue="선택된 키워드"
          leadingIcon={<Icon name="search" size={16} />}
          trailingButton={<button type="button" style={inlineActionStyle}>지우기</button>}
        />
        <Input label="disable alias" placeholder="비활성" disable />
      </section>
      <section style={fieldGrid}>
        <Input label="required" placeholder="필수 입력" required />
        <Input label="positive" defaultValue="검증 완료" status="positive" helper="사용 가능한 값입니다." />
        <Input label="negative" placeholder="오류 값" status="negative" error="메시지를 확인해 주세요." />
        <Input label="readonly" defaultValue="읽기 전용 값" readOnly helper="읽기 전용 상태입니다." />
      </section>
    </main>
  ),
};

export const InputDescriptionContract = {
  name: '설명 연결 계약',
  tags: ['!dev'],
  render: () => (
    <>
      <span id="external-input-description">External description</span>
      <Input label="이름" helper="Internal helper" aria-describedby="external-input-description" />
    </>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    const ids = input?.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!ids.includes('external-input-description') || ids.length < 2) {
      throw new Error('Input must merge consumer and internal description ids.');
    }
  },
};
