import { ActionArea, Button, Icon, IconButton, TextButton, ToggleIcon } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Action/Action Overview',
  parameters: {
    docs: {
      description: {
        component: 'Action Area, Button, Text Button, Icon Button, Chip, Toggle Icon을 아우르는 액션 컴포넌트 모음입니다.',
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
  name: 'Action taxonomy',
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
  name: 'Bottom action area',
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
