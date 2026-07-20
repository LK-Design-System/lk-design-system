import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Select } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Select',
  component: Select,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-selection-and-input-select--selects',
      eyebrow: 'Core / Select',
      title: '사용자가 정해진 옵션 중 하나를 제한된 공간에서 선택합니다',
      description:
        '옵션을 항상 펼쳐 둘 필요가 없는 단일 선택 폼에 적합합니다. 검색·자유 입력·다중 선택이 필요할 때는 Select 대신 AutoComplete, Combobox 또는 Searchable Multi Select를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Select는 단일 값을 고르는 combobox 트리거와 listbox 옵션, 탐색 중 상태와 확정 값을 소유합니다.',
      },
    },
  },
};

export default meta;

export const Selects = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 초안·검토·게시 중 하나의 작업 유형을 선택하는 상황입니다. 라벨과 현재 값이 연결되고 키보드 탐색 상태와 확정된 값이 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 360, maxWidth: '100%' }}>
      <Select
        label="작업 유형"
        helper="현재 작업의 처리 단계를 하나 선택하세요."
        defaultValue="review"
        options={[
          { value: 'draft', label: '초안' },
          { value: 'review', label: '검토' },
          { value: 'publish', label: '게시' },
        ]}
      />
    </main>
  ),
};

export const SelectStateContract = {
  name: 'Select 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', maxWidth: 820 }}>
      <Select label="정상" defaultValue="value" options={[{ value: 'value', label: '값' }, { value: 'text', label: '텍스트' }]} />
      <Select label="오류" status="negative" error="메시지를 확인해 주세요." options={[{ value: 'value', label: '값' }]} />
      <Select label="Disabled" disabled options={[{ value: 'value', label: '값' }]} />
      <Select label="Read only" readOnly defaultValue="value" options={[{ value: 'value', label: '고정 값' }, { value: 'other', label: '변경 불가' }]} />
    </main>
  ),
};

export const SelectKeyboardContract = {
  name: 'Select 키보드 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ width: 320, maxWidth: '100%' }}>
      <Select
        aria-label="게시 상태"
        defaultValue="review"
        options={[
          { value: 'draft', label: '초안' },
          { value: 'review', label: '검토' },
          { value: 'publish', label: '게시' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"][aria-label="게시 상태"]');
    if (!trigger) throw new Error('Select must expose its trigger as an accessible combobox.');
    if (trigger.hasAttribute('aria-controls')) {
      throw new Error('A closed Select must not reference an unmounted listbox.');
    }

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const listboxId = trigger.getAttribute('aria-controls');
    if (!listboxId) throw new Error('An open Select must reference its mounted listbox.');
    const listbox = listboxId ? canvasElement.ownerDocument.getElementById(listboxId) : null;
    if (trigger.getAttribute('aria-expanded') !== 'true' || !listbox || listbox.getAttribute('role') !== 'listbox') {
      throw new Error('ArrowDown must open the controlled listbox.');
    }

    await userEvent.keyboard('{End}');
    const endOption = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-activedescendant'));
    if (endOption?.textContent?.trim() !== '게시') throw new Error('End must move active focus to the last option.');

    await userEvent.keyboard('{Escape}');
    if (trigger.hasAttribute('aria-controls')) {
      throw new Error('Closing Select must remove the stale listbox relationship.');
    }
    if (trigger.getAttribute('aria-expanded') !== 'false' || canvasElement.ownerDocument.activeElement !== trigger || !trigger.textContent?.includes('검토')) {
      throw new Error('Escape must retain the value, close the listbox, and restore trigger focus.');
    }

    await userEvent.keyboard('{Enter}{Home}{ArrowDown}{ArrowUp}{End} ');
    if (trigger.getAttribute('aria-expanded') !== 'false' || !trigger.textContent?.includes('게시')) {
      throw new Error('Home, Arrow keys, and Space must navigate then commit the active option.');
    }
  },
};

function SelectDisabledOptionsFixture() {
  const [value, setValue] = React.useState('draft');
  const [reviewDisabled, setReviewDisabled] = React.useState(false);
  const [controlDisabled, setControlDisabled] = React.useState(false);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 320, maxWidth: '100%' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button type="button" data-contract="toggle-option" onClick={() => setReviewDisabled((current) => !current)}>
          검토 옵션 전환
        </button>
        <button type="button" data-contract="toggle-control" onClick={() => setControlDisabled((current) => !current)}>
          Select 비활성 전환
        </button>
      </div>
      <Select
        data-contract="dynamic-select"
        aria-label="동적 게시 상태"
        value={value}
        onChange={setValue}
        defaultOpen
        disabled={controlDisabled}
        options={[
          { value: 'draft', label: '초안' },
          { value: 'review', label: '검토', disabled: reviewDisabled },
          { value: 'publish', label: '게시' },
        ]}
      />
      <output data-contract="selected-value">{value}</output>
      <Select
        data-contract="locked-default-open"
        aria-label="초기 비활성 Select"
        disabled
        defaultOpen
        options={['하나', '둘']}
      />
    </main>
  );
}

export const SelectDisabledOptionContract = {
  name: '비활성 옵션과 동적 잠금 계약',
  tags: ['!dev'],
  render: () => <SelectDisabledOptionsFixture />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-contract="dynamic-select"]');
    const locked = canvasElement.querySelector('[data-contract="locked-default-open"]');
    const toggleOption = canvasElement.querySelector('[data-contract="toggle-option"]');
    const toggleControl = canvasElement.querySelector('[data-contract="toggle-control"]');
    const selectedValue = canvasElement.querySelector('[data-contract="selected-value"]');
    if (!trigger || !locked || !toggleOption || !toggleControl || !selectedValue) {
      throw new Error('Select disabled-option contract targets are required.');
    }
    if (locked.getAttribute('aria-expanded') !== 'false' || locked.hasAttribute('aria-controls')) {
      throw new Error('A disabled Select must ignore defaultOpen and keep its listbox closed.');
    }

    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'true' || !trigger.getAttribute('aria-activedescendant')) {
        throw new Error('An enabled defaultOpen Select must expose an active option.');
      }
    });
    await userEvent.click(toggleOption);

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const active = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-activedescendant'));
      if (active?.textContent?.trim() !== '초안') throw new Error('The selected enabled option must receive active focus.');
    });
    await userEvent.keyboard('{ArrowDown}');
    const activeAfterDisabled = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-activedescendant'));
    if (activeAfterDisabled?.textContent?.trim() !== '게시') {
      throw new Error('Arrow navigation must skip an option disabled after initial render.');
    }

    const listbox = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-controls'));
    const disabledOption = [...(listbox?.querySelectorAll('[role="option"]') ?? [])]
      .find((option) => option.textContent?.trim() === '검토');
    if (disabledOption?.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled Select options must expose aria-disabled.');
    }
    await userEvent.click(disabledOption);
    if (selectedValue.textContent?.trim() !== 'draft' || trigger.getAttribute('aria-expanded') !== 'true') {
      throw new Error('A disabled option must not commit a value or close the listbox.');
    }

    toggleControl.click();
    await waitFor(() => {
      if (!trigger.disabled || trigger.getAttribute('aria-expanded') !== 'false'
        || trigger.hasAttribute('aria-controls')) {
        throw new Error('A Select disabled while open must close immediately and remove the popup.');
      }
    });
  },
};
