import { ActionArea, Button, Checkbox, Chip, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Action Area',
  component: ActionArea,
  parameters: {
    docs: {
      description: {
        component: '하단 배치, 구분선, 캡션, 스티키, 세이프 에어리어 패딩을 담당하는 ActionArea 패턴입니다.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-xs)',
};

export const BottomActionArea = {
  name: '개요',
  parameters: storyDescription(
    '콘텐츠를 검토한 뒤 화면 하단에서 취소와 주요 행동을 완료하는 상황입니다. 요약은 버튼보다 먼저, 결과 캡션은 버튼 다음에 읽히며 주요 행동이 일관된 위치와 강조로 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 880 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Action / Action Area
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Action Area가 하단 배치, 구분선, 캡션, 스티키, 세이프 에어리어 패딩을 담당합니다
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          검토가 끝난 뒤 화면이나 패널 하단에서 취소와 주요 완료 행동을 한 단위로 유지할 때 적합합니다. 본문 안의 단일 즉시 행동에는 Action Area를 사용하지 말고 Button이나 Text Button을 배치하세요.
        </p>
      </header>

      <section style={panelStyle}>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: '1fr auto',
            minHeight: 420,
            border: '1px solid var(--color-semantic-line-normal-normal)',
            borderRadius: 'var(--radius-frame-lg)',
            overflow: 'hidden',
            background: 'var(--color-semantic-background-normal-alternative)',
          }}
        >
          <div style={{ padding: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
            콘텐츠 영역
          </div>
          <ActionArea
            safeArea
            summary={<><strong>요약</strong><span style={{ color: 'var(--color-semantic-label-neutral)' }}>값과 상태를 액션 위에 표시할 수 있습니다.</span></>}
            caption="캡션은 주요 동작의 결과를 설명하는 선택 요소입니다."
          >
            <Button variant="outlined" color="assistive" style={{ flex: 1 }}>나중에</Button>
            <Button variant="solid" color="primary" style={{ flex: 1 }}>배차 시작</Button>
          </ActionArea>
        </div>
      </section>
    </main>
  ),
};

export const ActionAreaStates = {
  name: '변형·상태 · 밀도와 고정 배치',
  parameters: storyDescription(
    '밀도, 구분선, 정렬, 동의 정보, 예약 안내, 스크롤 고정처럼 하단 행동 영역의 조합을 선택하는 상황입니다. ActionArea는 children의 DOM·키보드 순서를 유지하므로 자동 줄바꿈이 액션 우선순위를 재배열하지 않는다는 점도 함께 확인하세요.',
  ),
  render: () => {
    const frame = {
      border: '1px solid var(--color-semantic-line-normal-normal)',
      borderRadius: 'var(--radius-frame-lg)',
      overflow: 'hidden',
      background: 'var(--color-semantic-background-normal-alternative)',
    };
    const label = (text) => (
      <span style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-alternative)' }}>{text}</span>
    );
    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 880 }}>
        <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>Action / Action Area</p>
          <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
            compact · divider · sticky · 부가 콘텐츠(체크박스 · 칩 · 안내)
          </h1>
        </header>

        <section style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {label('compact + divider={false} + align="end"')}
            <div style={frame}>
              <ActionArea data-testid="action-area-plain" compact divider={false} align="end">
                <Button data-action="dismiss" variant="outlined" color="assistive">취소</Button>
                <Button data-action="commit" variant="solid" color="primary">저장</Button>
              </ActionArea>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {label('aria-label — 이름 있는 region landmark')}
            <div style={frame}>
              <ActionArea data-testid="action-area-named" aria-label="주문 확정 액션" compact align="end">
                <Button variant="outlined" color="assistive">취소</Button>
                <Button variant="solid" color="primary">주문 확정</Button>
              </ActionArea>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {label('부가 콘텐츠 — 약관 동의 체크박스')}
            <div style={frame}>
              <ActionArea summary={<Checkbox label="전체 약관에 동의합니다" defaultChecked />}>
                <Button variant="solid" color="primary" style={{ flex: 1 }}>동의하고 계속</Button>
              </ActionArea>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {label('부가 콘텐츠 — 칩 + 안내 캡션')}
            <div style={frame}>
              <ActionArea
                summary={
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <Chip size="sm" leading={<Icon name="clock" size={14} />}>예약 발송</Chip>
                    <Chip size="sm">우선순위 높음</Chip>
                  </div>
                }
                caption="안내: 예약 발송은 대기열 상태에 따라 최대 2분 지연될 수 있습니다."
              >
                <Button variant="outlined" color="assistive" style={{ flex: 1 }}>지금 발송</Button>
                <Button variant="solid" color="primary" style={{ flex: 1 }}>예약</Button>
              </ActionArea>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {label('sticky — 스크롤 시 하단 고정')}
            <div style={{ ...frame, height: 260, overflowY: 'auto' }}>
              <div style={{ padding: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
                {Array.from({ length: 8 }, (_, i) => (
                  <p key={i} style={{ margin: '0 0 var(--space-4)' }}>스크롤 콘텐츠 {i + 1} — 액션 영역이 아래에 고정된 상태로 유지됩니다.</p>
                ))}
              </div>
              <ActionArea data-testid="action-area-sticky" sticky>
                <Button variant="outlined" color="assistive" style={{ flex: 1 }}>나중에</Button>
                <Button variant="solid" color="primary" style={{ flex: 1 }}>배차 시작</Button>
              </ActionArea>
            </div>
          </div>
        </section>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const plain = canvasElement.querySelector('[data-testid="action-area-plain"]');
    const named = canvasElement.querySelector('[data-testid="action-area-named"]');
    const sticky = canvasElement.querySelector('[data-testid="action-area-sticky"]');
    if (!plain || !named || !sticky) {
      throw new Error('ActionArea contract requires every target region.');
    }

    // Element contract: an unnamed action area must not render a meaningless
    // <section>; a named one becomes a real region landmark.
    if (plain.tagName !== 'DIV') {
      throw new Error(`An unnamed ActionArea must render a plain div, not <${plain.tagName.toLowerCase()}>.`);
    }
    if (named.tagName !== 'SECTION' || named.getAttribute('aria-label') !== '주문 확정 액션') {
      throw new Error('A named ActionArea must render a <section> carrying its aria-label as a region landmark.');
    }

    // DOM order contract: the dismissive action stays first and the commit
    // action last, and flex wrapping never reorders them.
    const actions = Array.from(plain.querySelectorAll('button'));
    if (actions.length !== 2) throw new Error('ActionArea must preserve both wrapped actions.');
    if (actions[0].dataset.action !== 'dismiss' || actions[1].dataset.action !== 'commit') {
      throw new Error('ActionArea must preserve children DOM order: dismissive first, primary last.');
    }
    const dismissRect = actions[0].getBoundingClientRect();
    const commitRect = actions[1].getBoundingClientRect();
    if (commitRect.left < dismissRect.left) {
      throw new Error('ActionArea must not visually reorder the primary action ahead of the dismissive action.');
    }

    // Keyboard order follows DOM order.
    actions[0].focus();
    actions[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    if (canvasElement.ownerDocument.activeElement === actions[1]) {
      throw new Error('ActionArea must not move keyboard focus ahead of the dismissive action.');
    }

    // Sticky contract.
    const stickyStyle = getComputedStyle(sticky);
    if (stickyStyle.position !== 'sticky' || parseFloat(stickyStyle.bottom) !== 0) {
      throw new Error('A sticky ActionArea must stay attached to the bottom of its scroll container.');
    }
    if (getComputedStyle(plain).position === 'sticky') {
      throw new Error('A non-sticky ActionArea must not be pinned.');
    }
    if (stickyStyle.boxShadow === 'none') {
      throw new Error('A sticky ActionArea must separate itself from the scrolled content.');
    }
  },
};
