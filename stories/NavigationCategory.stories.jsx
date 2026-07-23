import React from 'react';
import { Category } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Category',
  component: Category,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-category--category-patterns',
      eyebrow: 'Core / Navigation',
      title: 'Category는 같은 화면 안에서 주제나 콘텐츠 묶음을 빠르게 전환합니다',
      description:
        '서로 배타적인 상위 분류를 한 줄에서 오가며 현재 선택을 계속 보여줘야 할 때 적합합니다. 단계 이동에는 Tabs를, 많은 옵션이나 폼 값 선택에는 Select를 사용하고, 단순 필터가 여러 개 동시에 적용되는 경우에는 Chip이나 별도 필터 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Category의 WDS 원본 축(variant, size, padding, vertical padding, scroll)을 따르는 주제 내비게이션입니다.',
      },
    },
  },
};

export default meta;

const categoryItems = [
  '전체',
  '로봇',
  '설비',
  '배차',
  '원격 제어',
  '텔레메트리',
  '이벤트',
];

export const CategoryPatterns = {
  name: '개요',
  parameters: storyDescription(
    '크기, alternative 표면, 안쪽 여백과 가로 스크롤 조합을 비교합니다. 선택된 항목이 각 배경에서 명확한지, 긴 항목 목록이 좁은 영역에서 잘리지 않고 탐색되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 920 }}>
      <Category items={categoryItems} defaultValue="전체" size="small" />
      <Category items={categoryItems} defaultValue="로봇" variant="alternative" size="medium" padding />
      <Category items={categoryItems} defaultValue="배차" size="xlarge" padding verticalPadding scroll />
    </main>
  ),
};

function ControlledCategoryDemo() {
  const [category, setCategory] = React.useState('로봇');
  return (
    <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
      <Category
        items={categoryItems.map((item) => (item === '이벤트' ? { value: item, label: item, disabled: true } : item))}
        value={category}
        onChange={setCategory}
        ariaLabel="콘텐츠 카테고리"
      />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-neutral)' }}>
        현재 선택: {category}
      </span>
    </div>
  );
}

export const RadioGroupSemantics = {
  name: '라디오그룹 시맨틱 · 제어형과 초기 선택 시드',
  parameters: storyDescription(
    '제어형 예시와 item.active 초기 선택 시드를 함께 보여줍니다. Arrow 키가 포커스 이동과 동시에 선택하는지, 그룹마다 aria-checked가 정확히 하나인지, 비활성 칩을 건너뛰는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 920 }}>
      <ControlledCategoryDemo />
      <Category
        items={[
          { value: '전체', label: '전체' },
          { value: '로봇', label: '로봇', active: true },
          { value: '설비', label: '설비' },
        ]}
        ariaLabel="초기 선택 시드"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const controlledGroup = canvasElement.querySelector('[role="radiogroup"][aria-label="콘텐츠 카테고리"]');
    const chips = Array.from(controlledGroup?.querySelectorAll('[role="radio"]') ?? []);
    if (!controlledGroup || chips.length === 0) {
      throw new Error('Category must render a role="radiogroup" container with role="radio" chips.');
    }
    const checkedCount = (group) =>
      group.querySelectorAll('[role="radio"][aria-checked="true"]').length;
    if (checkedCount(controlledGroup) !== 1) {
      throw new Error('Exactly one chip may be aria-checked in a group.');
    }
    if (chips.filter((chip) => chip.tabIndex === 0).length !== 1) {
      throw new Error('Exactly one chip may be the Tab stop (roving tabindex).');
    }
    // Arrow keys move focus AND select (APG radio behavior).
    const selectedChip = chips.find((chip) => chip.getAttribute('aria-checked') === 'true');
    selectedChip.focus();
    const nextChip = chips[chips.indexOf(selectedChip) + 1];
    await userEvent.keyboard('{ArrowRight}');
    if (nextChip?.getAttribute('aria-checked') !== 'true' || document.activeElement !== nextChip) {
      throw new Error('ArrowRight must select and focus the next enabled chip.');
    }
    if (checkedCount(controlledGroup) !== 1) {
      throw new Error('Arrow selection must keep the single aria-checked invariant.');
    }
    // End skips the trailing disabled chip.
    await userEvent.keyboard('{End}');
    const lastEnabled = chips.filter((chip) => !chip.disabled).at(-1);
    if (lastEnabled?.getAttribute('aria-checked') !== 'true' || document.activeElement !== lastEnabled) {
      throw new Error('End must select the last enabled chip, skipping disabled chips.');
    }
    // item.active seeds the uncontrolled initial selection only.
    const seededGroup = canvasElement.querySelector('[role="radiogroup"][aria-label="초기 선택 시드"]');
    const seededChecked = seededGroup?.querySelector('[role="radio"][aria-checked="true"]');
    if (seededChecked?.textContent !== '로봇' || checkedCount(seededGroup) !== 1) {
      throw new Error('item.active must seed exactly one initially checked chip.');
    }
    await userEvent.click(seededGroup.querySelector('[data-category-value="설비"]'));
    if (
      seededGroup.querySelector('[role="radio"][aria-checked="true"]')?.textContent !== '설비' ||
      checkedCount(seededGroup) !== 1
    ) {
      throw new Error('After user selection, item.active must not force a second checked chip.');
    }
  },
};
