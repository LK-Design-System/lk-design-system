import { ChecklistItem } from '../src/index.js';
import { ChecklistItemCard as ChecklistItemCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Checklist Item',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-checklist-item--checklist-items',
      eyebrow: 'Product / Checklist Item',
      title: '사용자가 해야 할 항목과 제외된 항목을 한 줄씩 구분합니다',
      description:
        '작업 기준이나 준비 항목처럼 짧은 목록의 완료·제외 상태를 읽게 할 때 적합합니다. 순서가 있는 절차나 직접 체크해야 하는 입력에는 정적 ChecklistItem 대신 Steps 또는 Checkbox를 사용하세요.',
    },
    docs: {
      description: {
        component: '할 일과 완료·제외 상태를 한 줄로 표시하는 ChecklistItem 패턴입니다.',
      },
    },
  },
};

export default meta;

const listStyle = { display: 'grid', gap: 'var(--space-3)', listStyle: 'none', margin: 0, padding: 0 };

export const ChecklistItems = {
  name: '개요',
  parameters: storyDescription(
    '작업 기준 목록에서 일반 항목과 제외된 항목을 함께 보여 주는 상황입니다. 취소선과 약한 톤이 상태를 보조하되 텍스트 의미만으로도 차이를 이해할 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ maxWidth: 560 }}>
      <ul style={listStyle}>
        <ChecklistItem>상태 라벨 표시</ChecklistItem>
        <ChecklistItem>권한별 액션 분리</ChecklistItem>
        <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
      </ul>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ul');
    const rows = list ? Array.from(list.children) : [];
    if (!list || rows.length !== 3) {
      throw new Error('체크리스트는 ul/li 목록 시맨틱으로 렌더되어야 합니다.');
    }
    if (rows.some((row) => row.tagName !== 'LI')) {
      throw new Error('각 ChecklistItem은 li로 렌더되어야 목록 위치와 개수가 전달됩니다.');
    }
    if (list.querySelector('svg:not([aria-hidden="true"])')) {
      throw new Error('체크·엑스 글리프는 장식이므로 aria-hidden이어야 합니다.');
    }
    const texts = rows.map((row) => row.textContent.replace(/\s+/g, ' ').trim());
    if (!texts[0].startsWith('포함') || !texts[1].startsWith('포함')) {
      throw new Error('포함 항목은 색·아이콘 외에 "포함" 텍스트 대안을 노출해야 합니다(WCAG 1.4.1).');
    }
    if (!texts[2].startsWith('제외')) {
      throw new Error('cross 항목은 취소선·색 외에 "제외" 텍스트 대안을 노출해야 합니다(WCAG 1.3.1).');
    }
  },
};

export const ChecklistItemStateContract = {
  name: 'ChecklistItem 상태 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
      <ul style={listStyle}>
        <ChecklistItem data-contract="default">기본 포함 항목</ChecklistItem>
        <ChecklistItem data-contract="excluded" cross>제외된 항목</ChecklistItem>
        <ChecklistItem data-contract="custom" stateLabel="미지원">사용자 정의 테마</ChecklistItem>
        <ChecklistItem data-contract="silent" stateLabel={null}>상태를 문맥이 이미 설명함</ChecklistItem>
      </ul>
      <ChecklistItem data-contract="standalone" as="div">목록 밖 단독 행</ChecklistItem>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const read = (contract) => {
      const row = canvasElement.querySelector(`[data-contract="${contract}"]`);
      if (!row) throw new Error(`${contract} 행이 필요합니다.`);
      return row.textContent.replace(/\s+/g, ' ').trim();
    };
    if (!read('default').startsWith('포함') || !read('excluded').startsWith('제외')) {
      throw new Error('기본 상태 어휘는 "포함"/"제외"여야 합니다.');
    }
    if (!read('custom').startsWith('미지원')) {
      throw new Error('stateLabel은 기본 "포함"/"제외" 어휘를 대체해야 합니다.');
    }
    const silent = read('silent');
    if (silent.includes('포함') || silent.includes('제외')) {
      throw new Error('stateLabel={null}은 상태 텍스트 대안을 꺼야 합니다.');
    }
    const standalone = canvasElement.querySelector('[data-contract="standalone"]');
    if (standalone.tagName !== 'DIV') {
      throw new Error('as="div"는 목록 밖 단독 행을 위한 탈출구여야 합니다.');
    }
  },
};

export const ChecklistItemCard = { ...ChecklistItemCardStory, name: 'ChecklistItem card parity', tags: ['!dev', 'visual-parity'] };
