import { Timeline } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Timeline',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-timeline--timeline-events',
      eyebrow: 'Core / Content / Timeline',
      title: '시간순 사건과 상태 변화를 하나의 연속된 기록으로 보여줍니다',
      description:
        '검토 이력, 배포 기록, 장비 이벤트처럼 발생 시각과 순서가 중요한 읽기 전용 기록에 적합합니다. 사용자가 완료해야 할 절차는 Step List나 Stepper를, 단순 알림 목록은 List를 사용하고 상태 색만으로 사건의 의미를 구분하지 마세요.',
    },
    docs: {
      description: {
        component: '시간 순서로 일어난 이벤트를 상태 색과 함께 읽는 Timeline 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TimelineEvents = {
  name: '개요',
  parameters: storyDescription(
    '검토 시작, 수정 요청, 게시 완료로 이어지는 사건 기록을 시간순으로 확인하는 상황입니다. 시각, 제목, 설명, 상태 톤이 같은 사건 단위로 읽히고 색 없이도 변화의 의미와 순서를 이해할 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 560 }}>
      <Timeline
        label="검토 기록"
        items={[
          { time: '09:12', title: '검토 시작', description: '초안이 담당자에게 전달됨', tone: 'signal' },
          { time: '09:18', title: '수정 요청', description: '설명 문구 보완 필요', tone: 'cautionary' },
          { time: '09:26', title: '게시 완료', description: '변경 이력 기록', tone: 'positive' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    if (!list || list.querySelectorAll(':scope > li').length !== 3) {
      throw new Error('시간순 사건은 ol/li로 렌더링되어야 순서와 개수가 전달됩니다(WCAG 1.3.1).');
    }
    const stamps = [...list.querySelectorAll('time')];
    if (stamps.length !== 3 || !stamps.every((t) => t.getAttribute('datetime'))) {
      throw new Error('각 시각 표기는 dateTime을 가진 <time> 요소여야 합니다.');
    }
  },
};

/* 가로 방향은 표현 축이다 — ol/time 시맨틱은 세로와 동일하고, 사건이 등분
   컬럼을 나눠 가지며 레일 세그먼트가 그리드 gap을 건너 다음 노드까지 잇는다.
   마지막 노드 뒤에는 레일이 없다: 연대기가 거기서 끝난다
   (Timeline.prompt.md의 orientation 절). */
export const HorizontalChronology = {
  name: '변형·상태 · 가로 연대기',
  parameters: storyDescription(
    '단계가 적은 연대기(로드맵, 마일스톤)를 좌→우로 읽는 상황입니다. 사건들이 폭을 등분해 나눠 갖는지, 레일이 노드 사이에서 끊기지 않고 마지막 노드에서 멈추는지, 세로와 같은 순서·시맨틱이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 960 }}>
      <Timeline
        orientation="horizontal"
        label="분기 마일스톤"
        items={[
          { time: '2026-08', title: '파일럿 착수', description: '지연 민감 구간 우선', tone: 'signal' },
          { time: '2026-10', title: '운영 검증', description: '지연·비용 이중 추적' },
          { time: '2026-11', title: '확대 결정', description: '4주 지표 검토 후' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    const items = list ? [...list.querySelectorAll(':scope > li')] : [];
    if (items.length !== 3) {
      throw new Error('가로 방향도 ol/li 시맨틱이어야 순서와 개수가 전달됩니다(WCAG 1.3.1).');
    }
    const stamps = [...list.querySelectorAll('time')];
    if (stamps.length !== 3 || !stamps.every((t) => t.getAttribute('datetime'))) {
      throw new Error('각 시각 표기는 dateTime을 가진 <time> 요소여야 합니다.');
    }
    const widths = items.map((li) => li.getBoundingClientRect().width);
    if (Math.max(...widths) - Math.min(...widths) > 1) {
      throw new Error('가로 사건은 등분 컬럼이어야 합니다 — 사건이 적을수록 한 칸이 넓어지는 공간 적응.');
    }
    const rails = items.map((li) => li.querySelectorAll('[aria-hidden] span').length);
    if (rails[items.length - 1] !== 1) {
      throw new Error('마지막 노드 뒤에는 레일 세그먼트가 없어야 합니다 — 연대기는 거기서 끝납니다.');
    }
  },
};

/* 매체 재지정 훅: 타입은 --lk-timeline-* 를 경유하고 폴백이 곧 제품 램프
   값이라 제품 화면은 바이트 동일하다. 이 스토리는 읽기 거리가 먼 매체가 자기
   스코프에서 세 단을 함께 옮기는 모습을 보인다 — 옮기는 것은 크기가 아니라
   단(rank)이라, 재지정 후에도 시각 표기는 제목보다 조용하다
   (Timeline.prompt.md의 재지정 훅 절). */
export const MediumRepoint = {
  name: '변형·상태 · 매체 재지정',
  parameters: storyDescription(
    '투영·전시처럼 읽기 거리가 먼 매체가 타임라인의 타입 단을 자기 스코프에서 올린 상황입니다. 세 단이 함께 올라가 시각 표기가 여전히 제목보다 조용한지, 시맨틱과 레일은 그대로인지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 960 }}>
      <Timeline
        orientation="horizontal"
        label="제품 기본"
        items={[
          { time: '2026-08', title: '파일럿 착수', description: '지연 민감 구간 우선', tone: 'signal' },
          { time: '2026-10', title: '운영 검증', description: '지연·비용 이중 추적' },
        ]}
      />
      <div
        data-medium-scope
        style={{
          '--lk-timeline-time-size': 'var(--label1-size)',
          '--lk-timeline-title-size': 'var(--heading2-size)',
          '--lk-timeline-desc-size': 'var(--body1-size)',
        }}
      >
        <Timeline
          orientation="horizontal"
          label="재지정된 매체"
          items={[
            { time: '2026-08', title: '파일럿 착수', description: '지연 민감 구간 우선', tone: 'signal' },
            { time: '2026-10', title: '운영 검증', description: '지연·비용 이중 추적' },
          ]}
        />
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const [productList, mediumList] = [...canvasElement.querySelectorAll('ol')];
    const scope = canvasElement.querySelector('[data-medium-scope]');
    if (!productList || !mediumList || !scope) throw new Error('두 매체를 나란히 렌더해야 비교가 성립합니다.');
    const sizeOf = (list, selector) => parseFloat(getComputedStyle(list.querySelector(selector)).fontSize);
    const titleSelector = 'li > div:not([aria-hidden])';
    const productTitle = sizeOf(productList, titleSelector);
    const mediumTitle = sizeOf(mediumList, titleSelector);
    if (!(mediumTitle > productTitle)) {
      throw new Error('매체가 훅을 재지정하면 타입 단이 따라 올라가야 합니다 — 재지정이 닿지 않았습니다.');
    }
    // 재지정해도 단의 순서는 유지된다: 시각 표기는 제목보다 조용하다.
    for (const list of [productList, mediumList]) {
      const stamp = parseFloat(getComputedStyle(list.querySelector('time')).fontSize);
      const title = sizeOf(list, titleSelector);
      if (!(stamp < title)) {
        throw new Error('어느 매체에서든 시각 표기는 제목보다 작아야 합니다 — 매체가 옮기는 것은 크기가 아니라 단입니다.');
      }
    }
  },
};
