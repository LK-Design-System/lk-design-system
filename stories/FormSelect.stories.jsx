import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Chip, Input, SearchField, Select } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Selection and Input/Select',
  tags: ['autodocs'],
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

export const SelectPopupDensities = {
  name: '사용법 · 팝업 밀도',
  parameters: storyDescription(
    '필드 트리거 크기는 유지하면서 sm은 기본 행 밀도, md와 lg는 더 여유로운 행 밀도를 사용합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', alignItems: 'start', gap: 'var(--space-6)', maxWidth: 820 }}>
      {[
        { size: 'sm', label: 'Small · 기본 행' },
        { size: 'md', label: 'Medium · 넉넉한 행' },
        { size: 'lg', label: 'Large · 넉넉한 행' },
      ].map(({ size, label }) => (
        <Select
          key={size}
          size={size}
          label={label}
          defaultValue="all"
          options={[
            { value: 'all', label: '내가 볼 수 있는 전체 지식' },
            { value: 'project', label: '현재 프로젝트' },
            { value: 'documents', label: '선택한 문서' },
          ]}
        />
      ))}
    </main>
  ),
};

export const SelectStateContract = {
  name: 'Select 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', maxWidth: 820 }}>
      <Select label="정상" defaultValue="value" options={[{ value: 'value', label: '값' }, { value: 'text', label: '텍스트' }]} />
      <Select label="오류" status="negative" error="사용할 수 없는 값입니다. 다른 항목을 선택해 주세요." options={[{ value: 'value', label: '값' }]} />
      <Select label="Disabled" disabled options={[{ value: 'value', label: '값' }]} />
      <Select label="Read only" readOnly defaultValue="value" options={[{ value: 'value', label: '고정 값' }, { value: 'other', label: '변경 불가' }]} />
    </main>
  ),
};

function SelectStableWidthFixture() {
  const [value, setValue] = React.useState('recent');
  return (
    <main data-select-stable-width-fixture style={{ display: 'grid', gap: 'var(--space-4)', width: 520, maxWidth: '100%' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '100%', flexWrap: 'wrap' }}>
        <Select
          aria-label="정렬"
          value={value}
          onChange={setValue}
          options={[
            { value: 'recent', label: '최근 변경순' },
            { value: 'name', label: '이름순' },
          ]}
        />
        <button type="button" data-contract="choose-recent" onClick={() => setValue('recent')}>긴 값 선택</button>
        <button type="button" data-contract="choose-name" onClick={() => setValue('name')}>짧은 값 선택</button>
      </div>
      <div data-contract="constrained-select-wrapper" style={{ width: 220, maxWidth: '100%', minWidth: 0 }}>
        <Select
          data-contract="constrained-select"
          aria-label="제약 폭 정렬"
          defaultValue="recent"
          options={[
            { value: 'recent', label: '최근 변경순' },
            { value: 'long', label: '아주 길어서 부모의 제약 폭을 넘어서는 옵션 이름' },
          ]}
          style={{ width: 220, minWidth: 0, maxWidth: '100%' }}
        />
      </div>
    </main>
  );
}

export const SelectStableOptionWidthContract = {
  name: '옵션 집합 기준 고정 폭 계약',
  tags: ['!dev'],
  render: () => <SelectStableWidthFixture />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"][aria-label="정렬"]');
    const widthSizer = canvasElement.querySelector('[data-select-width-sizer]');
    const chooseRecent = canvasElement.querySelector('[data-contract="choose-recent"]');
    const chooseName = canvasElement.querySelector('[data-contract="choose-name"]');
    const fixture = canvasElement.querySelector('[data-select-stable-width-fixture]');
    const root = trigger?.closest('[data-select-root]');
    const constrainedWrapper = canvasElement.querySelector('[data-contract="constrained-select-wrapper"]');
    const constrainedTrigger = canvasElement.querySelector('[data-contract="constrained-select"]');
    const constrainedRoot = constrainedTrigger?.closest('[data-select-root]');
    if (!trigger || !widthSizer || !chooseRecent || !chooseName || !fixture || !root
      || !constrainedWrapper || !constrainedTrigger || !constrainedRoot) {
      throw new Error('Select stable-width contract targets are required.');
    }
    if (widthSizer.getAttribute('aria-hidden') !== 'true') {
      throw new Error('The intrinsic width sizer must stay outside the accessibility tree.');
    }

    await userEvent.click(chooseRecent);
    const longWidth = trigger.getBoundingClientRect().width;
    await userEvent.click(chooseName);
    await waitFor(() => {
      if (!trigger.textContent?.includes('이름순')) throw new Error('The short option must be selected.');
    });
    const shortWidth = trigger.getBoundingClientRect().width;
    if (Math.abs(longWidth - shortWidth) > 0.5) {
      throw new Error(`Select width must remain stable across values (${longWidth}px -> ${shortWidth}px).`);
    }

    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    if (Math.abs(rootRect.height - triggerRect.height) > 1 || Math.abs(rootRect.top - triggerRect.top) > 1) {
      throw new Error('An unlabeled Select root must not reserve layout space outside its trigger.');
    }

    const constrainedRootWidth = constrainedRoot.getBoundingClientRect().width;
    const constrainedTriggerWidth = constrainedTrigger.getBoundingClientRect().width;
    if (constrainedRootWidth > 221 || constrainedTriggerWidth > 221) {
      throw new Error(`Select must honor a constrained parent width (root ${constrainedRootWidth}px, trigger ${constrainedTriggerWidth}px).`);
    }
    [fixture, constrainedWrapper, constrainedRoot].forEach((element) => {
      if (element.scrollWidth > element.clientWidth + 1) {
        throw new Error('The intrinsic width measurement must not create horizontal scroll overflow.');
      }
    });
  },
};

export const CompactFieldTypographyContract = {
  name: 'Compact field typography contract',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Input data-contract="compact-input" size="sm" aria-label="Compact input" defaultValue="Input" />
      <SearchField data-contract="compact-search" size="sm" aria-label="Compact search" defaultValue="Search" />
      <Select data-contract="compact-select" size="sm" aria-label="Compact select" defaultValue="one" options={[{ value: 'one', label: 'Select' }]} />
      <Chip data-contract="compact-chip" size="sm">Chip</Chip>
      <Input data-contract="medium-input" size="md" aria-label="Medium input" defaultValue="Input" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const compactFields = ['compact-input', 'compact-search', 'compact-select']
      .map((contract) => canvasElement.querySelector(`[data-contract="${contract}"]`));
    const compactSelectRoot = compactFields[2]?.closest('[data-select-root]');
    const compactChip = canvasElement.querySelector('[data-contract="compact-chip"]');
    const mediumInput = canvasElement.querySelector('[data-contract="medium-input"]');
    if (compactFields.some((field) => !field) || !compactSelectRoot || !compactChip || !mediumInput) {
      throw new Error('Compact typography contract targets are required.');
    }

    compactFields.forEach((field) => {
      const computed = getComputedStyle(field);
      if (computed.fontSize !== '14px' || computed.lineHeight !== '20px') {
        throw new Error(`Compact input typography must resolve to label1 (received ${computed.fontSize}/${computed.lineHeight}).`);
      }
    });
    const compactSelectRect = compactFields[2].getBoundingClientRect();
    const compactSelectRootRect = compactSelectRoot.getBoundingClientRect();
    if (Math.abs(compactSelectRect.height - 32) > 0.5 || Math.abs(compactSelectRootRect.height - 32) > 0.5) {
      throw new Error(`Compact Select root and trigger must both stay 32px tall (received ${compactSelectRootRect.height}px/${compactSelectRect.height}px).`);
    }
    const chipTypography = getComputedStyle(compactChip);
    if (chipTypography.fontSize !== '14px') {
      throw new Error(`Compact inputs must align with compact Chip typography (received ${chipTypography.fontSize}).`);
    }
    const mediumTypography = getComputedStyle(mediumInput);
    if (mediumTypography.fontSize !== '16px' || mediumTypography.lineHeight !== '24px') {
      throw new Error(`Medium input typography must retain body1 (received ${mediumTypography.fontSize}/${mediumTypography.lineHeight}).`);
    }
  },
};

export const SelectPopupDensityContract = {
  name: 'Select popup density contract',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      {[
        { size: 'sm', label: 'Density sm' },
        { size: 'md', label: 'Density md' },
        { size: 'lg', label: 'Density lg' },
      ].map(({ size, label }) => (
        <Select
          key={size}
          size={size}
          aria-label={label}
          defaultValue="one"
          options={[
            { value: 'one', label: 'Selected option' },
            { value: 'two', label: 'Available option' },
            { value: 'three', label: 'Another option' },
          ]}
        />
      ))}
    </main>
  ),
  play: async ({ canvasElement }) => {
    const cases = [
      { label: 'Density sm', density: 'default', rowHeight: 40, paddingY: 10, fontSize: 14, lineHeight: 20 },
      { label: 'Density md', density: 'comfortable', rowHeight: 48, paddingY: 12, fontSize: 16, lineHeight: 24 },
      { label: 'Density lg', density: 'comfortable', rowHeight: 48, paddingY: 12, fontSize: 16, lineHeight: 24 },
    ];

    for (const expected of cases) {
      const trigger = canvasElement.querySelector(`[role="combobox"][aria-label="${expected.label}"]`);
      if (!(trigger instanceof HTMLButtonElement)) {
        throw new Error(`${expected.label} trigger is required.`);
      }

      await userEvent.click(trigger);
      let listbox;
      await waitFor(() => {
        const listboxId = trigger.getAttribute('aria-controls');
        listbox = listboxId ? canvasElement.ownerDocument.getElementById(listboxId) : null;
        if (!listbox) throw new Error(`${expected.label} listbox must open.`);
        const positionedStyle = getComputedStyle(listbox);
        if (positionedStyle.pointerEvents === 'none' || positionedStyle.opacity === '0') {
          throw new Error(`${expected.label} listbox must finish Portal positioning before pointer assertions.`);
        }
      });

      const listboxStyle = getComputedStyle(listbox);
      if (listbox.dataset.density !== expected.density
        || listboxStyle.borderRadius !== '12px'
        || listboxStyle.paddingTop !== '8px'
        || listboxStyle.paddingRight !== '8px'
        || listboxStyle.paddingBottom !== '8px'
        || listboxStyle.paddingLeft !== '8px'
        || listboxStyle.rowGap !== '4px') {
        throw new Error(`${expected.label} must use the shared-menu shell and ${expected.density} density.`);
      }

      const rows = [...listbox.querySelectorAll('[role="option"]')];
      const selected = listbox.querySelector('[role="option"][aria-selected="true"]');
      const available = listbox.querySelector('[role="option"][aria-selected="false"]');
      if (rows.length !== 3 || !selected || !available) {
        throw new Error(`${expected.label} options are required.`);
      }

      rows.forEach((row) => {
        const style = getComputedStyle(row);
        const indicator = row.querySelector('[data-select-option-indicator]');
        if (Math.abs(row.getBoundingClientRect().height - expected.rowHeight) > 0.5
          || style.paddingTop !== `${expected.paddingY}px`
          || style.paddingRight !== '16px'
          || style.paddingBottom !== `${expected.paddingY}px`
          || style.paddingLeft !== '16px'
          || style.borderRadius !== '10px'
          || style.fontSize !== `${expected.fontSize}px`
          || style.lineHeight !== `${expected.lineHeight}px`
          || !indicator) {
          throw new Error(`${expected.label} option metrics must match its density contract.`);
        }
      });

      const selectedStyle = getComputedStyle(selected);
      const availableStyle = getComputedStyle(available);
      if (selectedStyle.fontWeight !== '500' || availableStyle.fontWeight !== '400'
        || getComputedStyle(selected.querySelector('[data-select-option-indicator]')).opacity !== '1'
        || getComputedStyle(available.querySelector('[data-select-option-indicator]')).opacity !== '0') {
        throw new Error(`${expected.label} must distinguish persistent selection from unselected options.`);
      }

      await userEvent.hover(available);
      await waitFor(() => {
        const hoveredStyle = getComputedStyle(available);
        if (hoveredStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || hoveredStyle.boxShadow !== 'none') {
          throw new Error(`${expected.label} pointer hover must use neutral fill without a focus ring.`);
        }
      });

      trigger.focus();
      await userEvent.keyboard('{Home}');
      await waitFor(() => {
        const activeId = trigger.getAttribute('aria-activedescendant');
        const activeOption = activeId ? canvasElement.ownerDocument.getElementById(activeId) : null;
        if (!activeOption || getComputedStyle(activeOption).boxShadow === 'none') {
          throw new Error(`${expected.label} keyboard active option must expose the primary inset ring.`);
        }
      });

      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        if (trigger.getAttribute('aria-expanded') !== 'false' || trigger.hasAttribute('aria-controls')) {
          throw new Error(`${expected.label} must close cleanly before the next density case.`);
        }
      });
    }
  },
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

export const SelectTypeaheadContract = {
  name: 'Select 타입어헤드 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    'APG Select-Only Combobox가 요구하는 인쇄 문자 타입어헤드를 검증합니다. 닫힌 상태에서는 값이 확정되고, 열린 상태에서는 탐색 위치만 옮겨야 합니다.',
  ),
  render: () => (
    <main style={{ width: 320, maxWidth: '100%' }}>
      <Select
        aria-label="담당 조직"
        options={[
          { value: 'seoul', label: '서울 본사' },
          { value: 'daejeon', label: '대전 연구소' },
          { value: 'daegu', label: '대구 공장' },
          { value: 'busan', label: '부산 지사', disabled: true },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"][aria-label="담당 조직"]');
    if (!trigger) throw new Error('Select must expose its trigger as an accessible combobox.');
    // The typeahead buffer clears after 500ms. Only the open-listbox phase
    // needs a guaranteed fresh buffer; the earlier phases hold either way.
    const flushBuffer = () => new Promise((resolve) => { setTimeout(resolve, 600); });
    trigger.focus();

    // Closed: a printable character commits the first matching option.
    await userEvent.keyboard('대');
    await waitFor(() => {
      if (!trigger.textContent?.includes('대전 연구소')) {
        throw new Error('Typeahead on a closed Select must set the value to the first match.');
      }
      if (trigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('Typeahead must not open the listbox.');
      }
    });

    // Pressing the same character again advances to the next option that
    // starts with it instead of re-matching the current one. This holds whether
    // or not the 500ms buffer has lapsed: a repeated character cycles, and a
    // fresh single character also searches from the option after the current.
    await userEvent.keyboard('대');
    await waitFor(() => {
      if (!trigger.textContent?.includes('대구 공장')) {
        throw new Error('Repeating a character must cycle to the next match.');
      }
    });

    // Disabled options are skipped: 부산 never becomes the match.
    await userEvent.keyboard('부');
    if (trigger.textContent?.includes('부산 지사')) {
      throw new Error('Typeahead must skip disabled options.');
    }

    // Open: typeahead moves the active option without committing.
    await userEvent.keyboard('{ArrowDown}');
    const before = trigger.textContent;
    await flushBuffer();
    await userEvent.keyboard('서');
    await waitFor(() => {
      const active = canvasElement.ownerDocument.getElementById(trigger.getAttribute('aria-activedescendant'));
      if (active?.textContent?.trim() !== '서울 본사') {
        throw new Error('Typeahead in an open Select must move the active option.');
      }
    });
    if (trigger.textContent !== before) {
      throw new Error('Typeahead in an open Select must not commit a value on its own.');
    }
    await userEvent.keyboard('{Enter}');
    if (!trigger.textContent?.includes('서울 본사') || trigger.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Enter must commit the option the typeahead navigated to.');
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

function SelectSurfaceRefFixture() {
  const triggerRef = React.useRef(null);
  const rootRef = React.useRef(null);
  React.useLayoutEffect(() => {
    triggerRef.current?.setAttribute('data-ref-target', 'select-trigger');
    rootRef.current?.setAttribute('data-root-ref-target', 'select-root');
  }, []);
  return (
    <Select
      ref={triggerRef}
      rootRef={rootRef}
      aria-label="Surface contract select"
      defaultValue="one"
      options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
      className="contract-select-root"
      triggerClassName="contract-select-trigger"
      classNames={{ value: 'contract-select-value' }}
      styles={{ value: { letterSpacing: '1px' } }}
      vars={{ '--lds-select-height': '44px' }}
    />
  );
}

export const SurfaceRefContract = {
  name: 'Surface and ref contract',
  tags: ['!dev'],
  render: () => <SelectSurfaceRefFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-root-ref-target="select-root"]');
    const trigger = canvasElement.querySelector('[data-ref-target="select-trigger"]');
    const value = trigger?.querySelector('[data-slot="value"]');
    if (!(trigger instanceof HTMLButtonElement) || root?.dataset.slot !== 'root') {
      throw new Error('Select default ref must target the native trigger and rootRef must target the public root.');
    }
    if (!root.classList.contains('contract-select-root') || !trigger.classList.contains('contract-select-trigger') || !value?.classList.contains('contract-select-value')) {
      throw new Error('Select root, trigger, and named-part classes must stay separated.');
    }
    if (getComputedStyle(trigger).height !== '44px' || getComputedStyle(value).letterSpacing !== '1px') {
      throw new Error('Select vars and named-part styles must reach the documented targets.');
    }
  },
};
