import React from 'react';
import { userEvent } from 'storybook/test';
import {
  PageIndicator,
  Pagination,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Pagination',
  tags: ['autodocs'],
  component: Pagination,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-pagination--synchronized-page-jump',
      eyebrow: 'Core / Navigation',
      title: 'Pagination은 나뉜 결과 묶음 사이를 예측 가능하게 이동하게 합니다',
      description:
        '검색 결과나 표처럼 전체 개수와 현재 페이지를 알고 앞·뒤 또는 특정 페이지로 이동해야 할 때 적합합니다. 소량의 연속 콘텐츠에서 위치만 알려주려면 Page Indicator를, 더 불러오기 방식의 피드에는 별도 로딩 패턴을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Pagination의 extended·compact·block·minimize 변형과 카운터·페이지 이동 입력을 보여줍니다.',
      },
    },
  },
};

export default meta;

function SynchronizedPaginationDemo() {
  const [page, setPage] = React.useState(2);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <button type="button" onClick={() => setPage(7)}>외부에서 7페이지</button>
      <Pagination
        page={page}
        count={128}
        onChange={setPage}
        pageSize={20}
        showPageJump
        pageJumpLabel="페이지 이동"
        navigationLabel="결과 페이지 탐색"
        previousPageLabel="이전 결과 페이지"
        nextPageLabel="다음 결과 페이지"
        pageSizeLabel="페이지당 결과 수"
      />
    </div>
  );
}

export const SynchronizedPageJump = {
  name: '개요',
  parameters: storyDescription(
    '외부 상태 변경과 페이지 이동 입력이 같은 현재 페이지를 유지하는 제어형 예시입니다. 페이지 이동 입력은 이 예시처럼 페이지 수가 많아 숫자 목록만으로 도달이 느린 표에서만 켭니다. 7페이지로 이동한 뒤 입력값이 동기화되는지, 직접 입력과 Enter 제출이 현재 페이지·접근 가능한 레이블에 함께 반영되는지 확인하세요.',
  ),
  render: () => <SynchronizedPaginationDemo />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="number"]');
    await userEvent.click([...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('7페이지')));
    if (input?.value !== '7') throw new Error('External page changes must synchronize the page-jump input.');
    await userEvent.clear(input);
    await userEvent.type(input, '4{enter}');
    if (input.value !== '4' || !canvasElement.querySelector('button[aria-current="page"]')?.textContent?.includes('4')) {
      throw new Error('Submitting a page jump must update both the controlled page and input value.');
    }
    if (!canvasElement.querySelector('nav[aria-label="결과 페이지 탐색"] button[aria-label="이전 결과 페이지"]') || !canvasElement.querySelector('select[aria-label="페이지당 결과 수"]')) {
      throw new Error('Pagination must expose localizable landmark and compact-control names.');
    }
  },
};

export const PaginationPatterns = {
  name: '변형·상태 · 이동 방식과 제어 영역',
  parameters: storyDescription(
    'extended·compact·block·minimize 변형과 카운터, 페이지 이동 입력, 앞뒤 슬롯을 한 화면에서 비교합니다. extended·compact는 마지막 페이지가 항상 보이므로 카운터를 겹치지 않고, 전체 페이지 수가 화면에 없는 block·minimize에서만 카운터로 위치를 보완하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 880 }}>
      <Pagination page={6} count={24} variant="extended" pageSize={20} showFirstLast />
      <Pagination page={6} count={24} variant="compact" />
      <Pagination page={13} count={42} variant="block" showCounter />
      <Pagination page={6} count={24} variant="minimize" leadingContent={<span />} trailingContent={<PageIndicator page={6} count={24} />} />
    </main>
  ),
};

function BlockPaginationDemo() {
  const [page, setPage] = React.useState(8);
  return <Pagination variant="block" page={page} count={42} onChange={setPage} showCounter />;
}

export const StableWindowAndBlocks = {
  name: '안정 윈도우 · 블록 이동',
  parameters: storyDescription(
    'extended·compact는 위치와 무관하게 항목 수가 고정된 윈도우를 유지해 클릭 사이에 숫자가 밀리지 않고, 전체 페이지가 윈도우에 들어오면 말줄임 없이 전부 표시됩니다. block 변형은 10페이지 블록 전체를 클릭 가능하게 유지하고 겹화살표로 블록을 이동합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 880 }}>
      <Pagination page={1} count={10} variant="extended" />
      <Pagination page={20} count={40} variant="extended" />
      <BlockPaginationDemo />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('nav');
    const numbers = (nav) => [...nav.querySelectorAll('button')]
      .filter((b) => /^\d+$/.test(b.textContent ?? ''))
      .map((b) => Number(b.textContent));
    const first = numbers(navs[0]);
    if (first.length !== 10 || first.some((n, i) => n !== i + 1)) {
      throw new Error('extended must list every page without ellipsis when count fits the window.');
    }
    const mid = numbers(navs[1]);
    if (mid[0] !== 1 || mid[mid.length - 1] !== 40 || mid.length !== 9) {
      throw new Error('extended must keep a constant-length window with first/last pages reachable.');
    }
    const block = numbers(navs[2]);
    if (block.length !== 10 || block[0] !== 1 || block[9] !== 10) {
      throw new Error('block must list the full current block.');
    }
    await userEvent.click(navs[2].querySelector('button[aria-label="next pages"]'));
    const nextBlock = numbers(canvasElement.querySelectorAll('nav')[2]);
    if (nextBlock[0] !== 11 || nextBlock[nextBlock.length - 1] !== 20) {
      throw new Error('the next-block command must jump to the following fixed block.');
    }
  },
};
