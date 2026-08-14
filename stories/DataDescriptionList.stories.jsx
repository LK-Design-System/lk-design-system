import { DescriptionList, TextButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Display/Description List',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-display-description-list--description-list-patterns',
      eyebrow: 'Product / Data / Description List',
      title: '사용자가 항목의 작은 메타데이터 묶음을 라벨과 값으로 읽습니다',
      description:
        '한 객체의 제원·담당자·점검일처럼 소수의 용어와 값을 설명할 때 적합합니다. 많은 행을 정렬·탐색하거나 여러 객체를 비교해야 하면 Description List 대신 Table 또는 Data Grid를 사용하세요.',
    },
    docs: {
      description: {
        component: '표로 만들기에는 작은 용어-값 쌍 메타데이터를 나열하는 DescriptionList 패턴입니다.',
      },
    },
  },
};

export default meta;

export const DescriptionListPatterns = {
  name: '개요',
  parameters: storyDescription(
    '한 열과 두 열 레이아웃으로 문서 및 로봇 메타데이터를 보여 주는 상황입니다. 용어와 값의 대응이 분명하고 열 수가 달라도 읽기 순서가 자연스러운지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 420 }}>
        <DescriptionList
          columns={1}
          items={[
            { term: '문서 유형', description: '컴포넌트 가이드' },
            { term: '검토 주기', description: '주간' },
            { term: '검증 상태', description: '완료' },
          ]}
        />
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <DescriptionList
          columns={2}
          items={[
            { term: '로봇 ID', description: 'AMR-021' },
            { term: '가동 구역', description: 'B동 2층' },
            { term: '최근 점검', description: '2026-07-02' },
            { term: '담당자', description: '설비운영팀' },
          ]}
        />
      </section>
    </main>
  ),
};

/* 제출 전 확인(check answers)의 값 표현 계약. 단계 이동과 복귀 focus는 Wizard가
   소유하므로 여기서는 DescriptionList가 소유하는 부분만 고정한다 —
   dl/dt/dd 읽기 순서, 항목마다 고유한 변경 액션 이름, 해당 없는 행의 생략,
   긴 한국어 값의 줄바꿈. 규칙은 docs/CHECK_ANSWERS_PATTERN.md가 소유한다. */
export const ReviewValuesWithChangeActions = {
  name: '사용법 · 제출 전 확인의 값과 변경 액션',
  tags: ['!dev'],
  parameters: storyDescription(
    '제출 전 확인 화면에서 각 값 옆에 그 항목만 가리키는 변경 액션을 둡니다. 변경 액션의 접근 가능한 이름이 항목마다 고유한지, 해당 없는 행은 임의 placeholder 없이 사라지는지, 320px에서 긴 값이 액션과 겹치지 않고 줄바꿈하는지 확인하세요.',
  ),
  render: () => {
    const answers = [
      { key: 'type', term: '보고서 유형', value: '주간 운영 보고서' },
      { key: 'period', term: '대상 기간', value: '2026-08-01 ~ 2026-08-13' },
      { key: 'records', term: '활동 기록', value: '자율주행 시험 3건 · 설비 점검 1건 · 그 외 27건' },
      /* 선택 입력이라 값이 없는 행. 확인 화면에서는 행 자체를 만들지 않는다. */
      { key: 'note', term: '보조 설명', value: '' },
    ];
    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <section data-testid="review-normal" style={{ maxWidth: 640 }}>
          <DescriptionList
            items={answers
              .filter((answer) => answer.value)
              .map((answer) => ({
                term: answer.term,
                description: (
                  <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                    <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{answer.value}</span>
                    <TextButton size="sm" data-change={answer.key} style={{ flexShrink: 0 }}>
                      {answer.term} 변경
                    </TextButton>
                  </span>
                ),
              }))}
          />
        </section>
        <section data-testid="review-narrow" style={{ maxWidth: 320 }}>
          <DescriptionList
            variant="stacked"
            items={answers
              .filter((answer) => answer.value)
              .map((answer) => ({
                term: answer.term,
                description: (
                  <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                    <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{answer.value}</span>
                    <TextButton size="sm" style={{ flexShrink: 0 }}>{answer.term} 변경</TextButton>
                  </span>
                ),
              }))}
          />
        </section>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const normal = canvasElement.querySelector('[data-testid="review-normal"]');
    const list = normal.querySelector('dl');
    if (!list) throw new Error('Check-answers values must render as a semantic description list.');

    const terms = [...list.querySelectorAll('dt')].map((node) => node.textContent.trim());
    if (terms.length !== 3 || terms.includes('보조 설명')) {
      throw new Error('A conditional answer with no value must omit its row instead of rendering a placeholder.');
    }
    if (/(^|\s)-(\s|$)/.test(list.textContent)) {
      throw new Error('An omitted answer must not be replaced with a dash placeholder.');
    }

    for (const row of list.querySelectorAll('div')) {
      const term = row.querySelector('dt');
      const value = row.querySelector('dd');
      if (!term || !value) continue;
      if (!(term.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        throw new Error('Each row must read term first, then value and its change action.');
      }
    }

    const actions = [...normal.querySelectorAll('button')];
    const names = actions.map((action) => action.textContent.trim());
    if (names.length !== 3 || new Set(names).size !== names.length) {
      throw new Error('Every change action must carry a unique accessible name.');
    }
    for (const [index, term] of terms.entries()) {
      if (!names[index].includes(term)) {
        throw new Error(`The change action for ${term} must name its own answer, not a bare 변경.`);
      }
    }

    const narrow = canvasElement.querySelector('[data-testid="review-narrow"]');
    const longRow = [...narrow.querySelectorAll('dd')].find((node) => node.textContent.includes('그 외 27건'));
    const longValue = longRow?.firstElementChild?.firstElementChild;
    const longAction = longRow?.querySelector('button');
    if (!longValue || !longAction) throw new Error('The narrow review must keep the long value and its change action.');
    if (longValue.getBoundingClientRect().right > longAction.getBoundingClientRect().left + 1) {
      throw new Error('At 320px a long Korean answer must wrap instead of colliding with its change action.');
    }
  },
};
