import { ActionArea, Button, Checkbox, Chip, Icon, IconButton, TextButton, ToggleIcon } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Action/Action Overview',
  parameters: {
    docs: {
      description: {
        component: '버튼, 텍스트 버튼, 아이콘 버튼, 칩, 토글 아이콘을 아우르는 액션 분류 개요와 ActionArea 하단 액션 영역 패턴입니다.',
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

export const ActionTaxonomy = {
  name: '액션 분류',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Action
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          액션 컨트롤은 하나의 체계를 공유합니다
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          액션 시스템은 Action Area, Button, Text Button, Icon Button, Chip, Toggle Icon을 하나로 묶어 관리합니다.
          LDS는 각 역할을 명시적으로 유지해 스토리마다 액션 스타일이 어긋나지 않도록 합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Button</h2>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <Button>로봇 등록</Button>
            <Button variant="outlined" color="primary">Outlined</Button>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Text Button</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <TextButton color="primary">더보기</TextButton>
            <TextButton color="assistive">취소</TextButton>
            <TextButton loading loadingLabel="불러오는 중">Loading</TextButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Icon Button</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <IconButton label="검색" size="small"><Icon name="search" size={18} /></IconButton>
            <IconButton label="추가" size="medium" variant="solid"><Icon name="plus" size={18} /></IconButton>
            <IconButton label="설정" size="custom" variant="ghost"><Icon name="settings" size={16} /></IconButton>
          </div>
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Toggle Icon</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <ToggleIcon label="미리보기 표시" defaultPressed><Icon name="eye" size={18} /></ToggleIcon>
            <ToggleIcon label="즐겨찾기"><Icon name="star" size={18} /></ToggleIcon>
          </div>
        </article>
      </section>

      <p style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 13, lineHeight: 1.6 }}>
        Chip 변형은 Selection and Input/Chip 페이지와 Content/Badges and Tags 페이지에서 확인합니다.
      </p>
    </main>
  ),
};

export const BottomActionArea = {
  name: '하단 액션 영역',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 880 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Action / Action Area
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Action Area가 하단 배치, 구분선, 캡션, 스티키, 세이프 에어리어 패딩을 담당합니다
        </h1>
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
            <Button variant="solid" color="primary" style={{ flex: 1 }}>배차 시작</Button>
            <Button variant="outlined" color="assistive" style={{ flex: 1 }}>나중에</Button>
          </ActionArea>
        </div>
      </section>
    </main>
  ),
};

export const ActionAreaStates = {
  name: '액션 영역 상태',
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
              <ActionArea compact divider={false} align="end">
                <Button variant="outlined" color="assistive">취소</Button>
                <Button variant="solid" color="primary">저장</Button>
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
                <Button variant="solid" color="primary" style={{ flex: 1 }}>예약</Button>
                <Button variant="outlined" color="assistive" style={{ flex: 1 }}>지금 발송</Button>
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
              <ActionArea sticky>
                <Button variant="solid" color="primary" style={{ flex: 1 }}>배차 시작</Button>
                <Button variant="outlined" color="assistive" style={{ flex: 1 }}>나중에</Button>
              </ActionArea>
            </div>
          </div>
        </section>
      </main>
    );
  },
};
