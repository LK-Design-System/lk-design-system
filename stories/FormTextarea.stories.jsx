import React from 'react';
import { Textarea } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const fieldGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'var(--space-4)',
  alignItems: 'start',
};

const meta = {
  title: 'LDS Core/Components/Selection and Input/Textarea',
  component: Textarea,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-textarea--textarea-overview',
      eyebrow: 'Core / Textarea',
      title: '텍스트 영역은 여러 줄의 설명과 메모를 안정적으로 입력합니다',
      description:
        '검토 메모·설명처럼 줄바꿈과 충분한 작성 공간이 필요한 값에 적합합니다. 이름·검색어처럼 한 줄 값에는 Textarea 대신 Input을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'WDS Textinput/Textarea 정의에 맞춘 여러 줄 입력입니다. rows, resize 정책, helper/error와 interaction 상태를 소유합니다.',
      },
    },
  },
};

export default meta;

export const TextareaOverview = {
  name: '개요',
  parameters: storyDescription(
    '모바일 화면 검토 메모가 입력된 4행 Textarea입니다. 긴 문장이 자연스럽게 줄바꿈되고 label과 입력 영역이 한 필드로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 620 }}>
      <Textarea label="검토 메모" defaultValue="모바일 화면에서 줄바꿈과 도움말 위치를 확인합니다." rows={4} />
    </main>
  ),
};

export const CharacterCounter = {
  name: '사용법 · 문자 수 제한',
  parameters: storyDescription(
    '100자 제한 메모의 현재 문자 수를 helper 영역에 표시합니다. 입력을 줄여도 counter가 값과 동기화되고 오류 메시지 자리를 침범하지 않는지 확인하세요.',
  ),
  render: function Example() {
    const max = 100;
    const [value, setValue] = React.useState('로봇 관제 시스템 검토 메모입니다.');
    return (
      <main style={{ maxWidth: 620 }}>
        <Textarea
          label="문자 수 카운터"
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, max))}
          rows={3}
          helper={`${value.length}/${max}`}
        />
      </main>
    );
  },
};

export const TextareaStateMatrix = {
  name: 'Textarea states',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={fieldGrid}>
        <Textarea label="Textarea" helper="긴 문장 입력 상태입니다." defaultValue="청춘이 느끼는 등기한 하여도 가슴이 설레는 말이다." rows={3} />
        <Textarea label="Textarea 오류" error="메시지를 확인해 주세요." defaultValue="청춘이 느끼는 등기한 하여도 가슴이 설레는 말이다." rows={3} />
      </section>
    </main>
  ),
};

export const TextareaInteractionMatrix = {
  name: 'Textarea interaction',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1020 }}>
      <section style={fieldGrid}>
        <Textarea label="textarea hover" defaultValue="긴 텍스트 값" interaction="hovered" rows={3} />
        <Textarea label="textarea focus" defaultValue="긴 텍스트 값" interaction="focused" rows={3} />
        <Textarea label="textarea disabled" defaultValue="긴 텍스트 값" disabled rows={3} />
        <Textarea label="textarea read only" defaultValue="읽기 전용 값" readOnly rows={3} />
        <Textarea label="textarea positive" defaultValue="검증 완료" status="positive" helper="사용할 수 있는 값입니다." rows={3} />
        <Textarea label="textarea fixed" defaultValue="고정 크기" resize="fixed" rows={3} />
        <Textarea label="textarea limit" defaultValue="제한 크기" resize="limit" rows={3} />
      </section>
    </main>
  ),
};

export const TextareaDescriptionContract = {
  name: '설명 연결 계약',
  tags: ['!dev'],
  render: () => (
    <>
      <span id="external-textarea-description">External description</span>
      <Textarea label="메모" helper="Internal helper" aria-describedby="external-textarea-description" />
    </>
  ),
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea');
    const ids = textarea?.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    if (!ids.includes('external-textarea-description') || ids.length < 2) {
      throw new Error('Textarea must merge consumer and internal description ids.');
    }
  },
};
