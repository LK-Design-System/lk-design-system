import React from 'react';
import { userEvent } from 'storybook/test';
import { Button, FieldAction, Input, InputGroup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

function assertAligned(root, expectedHeight) {
  const input = root.querySelector('input');
  const button = root.querySelector('button');
  if (!input || !button) throw new Error('FieldAction must render an input followed by a button.');
  const inputControl = input.parentElement;
  const inputHeight = Math.round(inputControl.getBoundingClientRect().height);
  const buttonHeight = Math.round(button.getBoundingClientRect().height);
  if (inputHeight !== expectedHeight || buttonHeight !== expectedHeight) {
    throw new Error(`FieldAction controls must both be ${expectedHeight}px; received ${inputHeight}px and ${buttonHeight}px.`);
  }
  if (!(input.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING)) {
    throw new Error('FieldAction DOM and focus order must keep the field before the action.');
  }
}

const meta = {
  title: 'LDS Product/Selection and Input/Field Action',
  tags: ['autodocs'],
  component: FieldAction,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-selection-and-input-field-action--field-action-overview',
      eyebrow: 'Product / Field Action',
      title: 'FieldAction은 입력과 그 값을 사용하는 한 개의 동작을 같은 밀도로 묶습니다',
      description:
        '발급·조회·추가처럼 입력값에 대한 명시적 action을 별도 동작 버튼으로 유지합니다. 좁은 폭에서는 입력 다음 줄에 전체 너비 action을 배치하며 값과 side effect는 제품이 소유합니다.',
    },
    docs: {
      description: {
        component: '입력 내부 addon이 아닌 별도 field + action form 조합입니다. 기존 입력과 동작 버튼의 상태 표현을 유지하고 높이·간격·reflow만 소유합니다.',
      },
    },
  },
};

export default meta;

export const FieldActionOverview = {
  name: '개요',
  parameters: storyDescription(
    '기본 md 입력과 제출 버튼이 모두 48px control row에 놓입니다. 입력에서 Enter를 눌러도 같은 native form submit 경로를 사용합니다.',
  ),
  render: () => (
    <FieldAction
      as="form"
      aria-label="AI 도구 연결"
      onSubmit={(event) => event.preventDefault()}
      style={{ maxWidth: 520 }}
      field={<Input aria-label="연결 이름" placeholder="예: 개발 PC" />}
      action={<Button type="submit">발급</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    assertAligned(canvasElement.querySelector('.lk-field-action'), 48);
  },
};

export const FieldActionStates = {
  name: '상태와 밀도',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <FieldAction
        size="sm"
        field={<Input aria-label="검색어" defaultValue="AMR" />}
        action={<Button type="button">조회</Button>}
      />
      <FieldAction
        field={<Input aria-label="비활성 연결 이름" defaultValue="운영 서버" disabled />}
        action={<Button type="button" disabled>발급</Button>}
      />
      <FieldAction
        field={<Input aria-label="처리 중 연결 이름" defaultValue="개발 PC" readOnly />}
        action={<Button type="button" loading loadingLabel="연결 코드를 발급하는 중">연결 코드 발급</Button>}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('.lk-field-action');
    assertAligned(rows[0], 32);
    assertAligned(rows[1], 48);
    assertAligned(rows[2], 48);
  },
};

export const FieldActionNarrow = {
  name: '좁은 폭·긴 문구·오류',
  parameters: storyDescription(
    '320px에서 긴 label·error와 action이 겹치지 않고 입력 다음 줄로 reflow합니다. action은 전체 너비가 되고 DOM·Tab 순서는 변하지 않습니다.',
  ),
  render: () => (
    <FieldAction
      as="form"
      aria-label="외부 자동화 서버 연결"
      onSubmit={(event) => event.preventDefault()}
      label="외부 자동화 서버에서 사용할 연결 이름"
      htmlFor="field-action-narrow-input"
      error="이미 사용 중인 이름입니다. 다른 연결 이름을 입력하세요."
      style={{ width: 320, maxWidth: '100%' }}
      field={(
        <Input
          id="field-action-narrow-input"
          aria-invalid="true"
          defaultValue="사내 자동화 서버"
        />
      )}
      action={<Button type="submit">새 연결 코드를 안전하게 발급</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.lk-field-action');
    const fieldSlot = root.querySelector('.lk-field-action__field');
    const actionSlot = root.querySelector('.lk-field-action__action');
    const button = actionSlot.querySelector('button');
    if (actionSlot.getBoundingClientRect().top < fieldSlot.getBoundingClientRect().bottom) {
      throw new Error('A narrow FieldAction must place the action below the field.');
    }
    if (Math.abs(actionSlot.getBoundingClientRect().width - fieldSlot.getBoundingClientRect().width) > 1) {
      throw new Error('A narrow FieldAction action must expand to the field width.');
    }
    const input = fieldSlot.querySelector('input');
    input.focus();
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== button) {
      throw new Error('Tab order must move from the field directly to the action.');
    }
  },
};

function SubmitContractFixture() {
  const [submitCount, setSubmitCount] = React.useState(0);
  return (
    <>
      <FieldAction
        as="form"
        aria-label="제출 계약"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitCount((count) => count + 1);
        }}
        field={<Input aria-label="이름" defaultValue="개발 PC" />}
        action={<Button type="submit">발급</Button>}
      />
      <span data-testid="submit-count" hidden>{submitCount}</span>
    </>
  );
}

export const FieldActionSubmitContract = {
  name: 'native 제출 계약',
  tags: ['!dev'],
  render: () => <SubmitContractFixture />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    input.focus();
    await userEvent.keyboard('{Enter}');
    if (canvasElement.querySelector('[data-testid="submit-count"]').textContent !== '1') {
      throw new Error('Enter in the field must use the native form submit path.');
    }
  },
};

export const FieldActionVisualParity = {
  name: 'FieldAction visual parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-6)', width: 'min(100%, 960px)' }}>
      <section style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-3)', gridColumn: '1 / -1', maxWidth: 468 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)' }}>FieldAction</h2>
        <FieldAction
          field={<Input aria-label="연결 이름" defaultValue="개발 PC" />}
          action={<Button type="button">발급</Button>}
        />
      </section>
      <section style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)' }}>Stack + 기본 control</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Input aria-label="연결 이름 비교" defaultValue="개발 PC" style={{ flex: '1 1 auto' }} />
          <Button type="button">발급</Button>
        </div>
      </section>
      <section style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--body1-size)' }}>InputGroup 고정 suffix</h2>
        <InputGroup aria-label="하중" defaultValue="24" suffix="kg" />
      </section>
    </main>
  ),
};
