import React from 'react';
import {
  Icon,
  Input,
  InputGroup,
  PasswordInput,
  Select,
  Textarea,
} from '../src/index.js';

function CharCounterField() {
  const max = 100;
  const [value, setValue] = React.useState('로봇 관제 시스템 검토 메모입니다.');
  return (
    <Textarea
      label="문자 수 카운터"
      value={value}
      onChange={(e) => setValue(e.target.value.slice(0, max))}
      rows={3}
      helper={`${value.length}/${max}`}
    />
  );
}

const meta = {
  title: 'LDS Core/Components/Selection and Input/Text Input',
  parameters: {
    docs: {
      description: {
        component: '텍스트, 비밀번호, 그룹 입력, 긴 문장을 입력하는 기본 폼 요소입니다.',
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
        <Input label="프로젝트 이름" defaultValue="로봇 관제 시스템" iconLeft={<Icon name="document" size={18} />} />
        <PasswordInput defaultValue="design-system" />
        <InputGroup prefix="ID" suffix="개" defaultValue="12" />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <Textarea label="검토 메모" defaultValue="모바일 화면에서 줄바꿈과 도움말 위치를 확인합니다." rows={4} />
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
          actionRight={<button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--color-semantic-primary-normal)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>확인</button>}
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
        <Input label="normal" placeholder="텍스트를 입력해 주세요." />
        <Input label="hovered" placeholder="텍스트를 입력해 주세요." interaction="hovered" />
        <Input label="focused" defaultValue="포커스 값" interaction="focused" />
        <Input label="disabled" placeholder="비활성" disabled />
      </section>

      <section style={fieldMatrixStyle}>
        <Input label="active" defaultValue="활성 값" active />
        <Input label="focus alias" defaultValue="포커스 값" focus />
        <Input
          label="trailing button"
          defaultValue="선택된 키워드"
          leadingIcon={<Icon name="search" size={16} />}
          trailingButton={<button type="button" style={{ border: 0, background: 'transparent', color: 'var(--color-semantic-primary-normal)', fontWeight: 'var(--fw-bold)' }}>지우기</button>}
        />
        <Input label="disable alias" placeholder="비활성" disable />
      </section>

      <section style={fieldMatrixStyle}>
        <Input label="required" placeholder="필수 입력" required />
        <Input label="positive" defaultValue="검증 완료" status="positive" helper="사용 가능한 값입니다." />
        <Input label="negative" placeholder="오류 값" status="negative" error="메시지를 확인해 주세요." />
        <Input label="readonly" defaultValue="읽기 전용 값" readOnly helper="읽기 전용 상태입니다." />
      </section>

      <section style={fieldMatrixStyle}>
        <Textarea label="textarea hover" defaultValue="긴 텍스트 값" interaction="hovered" rows={3} />
        <Textarea label="textarea focus" defaultValue="긴 텍스트 값" interaction="focused" rows={3} />
        <Textarea label="textarea disabled" defaultValue="긴 텍스트 값" disabled rows={3} />
        <Textarea label="textarea fixed" defaultValue="고정 크기" resize="fixed" rows={3} />
        <Textarea label="textarea limit" defaultValue="제한 크기" resize="limit" rows={3} />
      </section>

      <section style={fieldMatrixStyle}>
        <Select
          label="select normal"
          defaultValue="alpha"
          options={[{ value: 'alpha', label: '옵션 A' }, { value: 'beta', label: '옵션 B' }]}
        />
        <Select
          label="select hovered"
          interaction="hovered"
          options={[{ value: 'alpha', label: '옵션 A' }, { value: 'beta', label: '옵션 B' }]}
        />
        <Select
          label="select open"
          defaultValue="alpha"
          interaction="open"
          options={[{ value: 'alpha', label: '옵션 A' }, { value: 'beta', label: '옵션 B' }, { value: 'gamma', label: '옵션 C' }]}
        />
        <Select
          label="select overflow chip"
          render="chip"
          active
          defaultValue="long"
          iconLeft={<Icon name="filter" size={16} />}
          options={[{ value: 'long', label: '오버플로 확인용으로 아주 길게 선택된 값' }, { value: 'short', label: '짧은 값' }]}
        />
        <Select
          label="select negative alias"
          negative
          error="메시지를 확인해 주세요."
          options={[{ value: 'alpha', label: '옵션 A' }]}
        />
        <Select
          label="select disable alias"
          disable
          options={[{ value: 'alpha', label: '옵션 A' }]}
        />
      </section>
    </main>
  ),
};

export const TextInputTimerAndCounter = {
  name: '타이머 · 문자 수 카운터',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <section style={fieldMatrixStyle}>
        <Input
          label="인증 코드"
          placeholder="6자리 코드"
          inputMode="numeric"
          actionRight={<span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-semantic-status-negative)', fontWeight: 'var(--fw-bold)', fontSize: 13 }}>02:59</span>}
          helper="타이머는 actionRight 슬롯으로 합성합니다."
        />
        <Input
          label="인증 코드 (만료됨)"
          placeholder="6자리 코드"
          actionRight={<button type="button" style={{ border: 0, background: 'transparent', color: 'var(--color-semantic-primary-normal)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>재전송</button>}
          helper="만료 후 actionRight를 재전송 버튼으로 전환합니다."
        />
        <CharCounterField />
      </section>
    </main>
  ),
};
