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
        component: 'Pagination의 extended·compact·minimize 변형과 카운터·페이지 이동 입력을 보여줍니다.',
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
        count={12}
        onChange={setPage}
        pageSize={20}
        showCounter
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
    '외부 상태 변경과 페이지 이동 입력이 같은 현재 페이지를 유지하는 제어형 예시입니다. 7페이지로 이동한 뒤 입력값이 동기화되는지, 직접 입력과 Enter 제출이 현재 페이지·접근 가능한 레이블에 함께 반영되는지 확인하세요.',
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
    'extended·compact·minimize 변형과 카운터, 페이지 이동 입력, 앞뒤 슬롯을 한 화면에서 비교합니다. 정보 밀도에 따라 필요한 제어만 남고 현재 위치와 이동 가능 방향이 계속 분명한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 880 }}>
      <Pagination page={6} count={24} variant="extended" pageSize={20} showCounter showPageJump />
      <Pagination page={6} count={24} variant="compact" showCounter />
      <Pagination page={6} count={24} variant="minimize" leadingContent={<span />} trailingContent={<PageIndicator page={6} count={24} />} />
    </main>
  ),
};
