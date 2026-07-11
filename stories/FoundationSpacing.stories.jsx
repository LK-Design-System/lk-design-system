import { Button } from '../src/index.js';
import { SpacingScale as SpacingScaleStory } from './Foundations.shared.jsx';

const meta = {
  title: 'LDS Core/Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          '간격 스케일 토큰과 상태 바, 홈 인디케이터, 하단 내비게이션, 하단 액션 등 세이프 에어리어 간격을 다루는 Spacing 커버리지입니다.',
      },
    },
  },
};

export default meta;

export const SpacingScale = { ...SpacingScaleStory, name: '간격 스케일' };

const panelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-xs)',
};

const phoneStyle = {
  width: 220,
  height: 420,
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-xl)',
  background: 'var(--color-semantic-background-elevated-normal)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-md)',
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto auto',
};

const statusBarStyle = {
  minHeight: 'var(--mobile-status-bar-min-height)',
  paddingInline: 'var(--space-4)',
  paddingTop: 'var(--mobile-safe-area-top)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: 'var(--color-semantic-label-alternative)',
  fontSize: 11,
  fontWeight: 800,
  borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
  background: 'var(--color-semantic-fill-alternative)',
};

const appBarStyle = {
  height: 48,
  paddingInline: 'var(--space-4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 800,
  color: 'var(--color-semantic-label-normal)',
};

const bottomNavStyle = {
  minHeight: 'var(--mobile-bottom-bar-min-height)',
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-2) var(--space-2) var(--mobile-safe-area-bottom)',
  borderTop: '1px solid var(--color-semantic-line-normal-normal)',
  background: 'var(--color-semantic-background-elevated-normal)',
};

const homeIndicatorStyle = {
  height: 'var(--mobile-home-indicator-height)',
  display: 'grid',
  placeItems: 'center',
  borderTop: '1px solid var(--color-semantic-line-normal-normal)',
  background: 'var(--color-semantic-fill-alternative)',
};

const navItems = ['홈', '모니터링', '배차', '알림', '메뉴'];

function HomeIndicator() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 78,
        height: 4,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-semantic-label-assistive)',
      }}
    />
  );
}

function NavItem({ label }) {
  return (
    <span
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 3,
        minWidth: 0,
        color: 'var(--color-semantic-label-alternative)',
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-semantic-fill-normal)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
        }}
      />
      <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  );
}

function PhoneFrame({ variant = 'status', actionInset = false }) {
  return (
    <div style={phoneStyle}>
      <div style={statusBarStyle}>
        <span>9:41</span>
        <span>LTE 100%</span>
      </div>
      <div style={appBarStyle}>
        <span>뒤로</span>
        <span>제목</span>
        <span>더보기</span>
      </div>
      <div style={{ background: 'var(--color-semantic-background-normal-normal)' }} />
      {variant === 'bottom' ? (
        <div style={bottomNavStyle}>
          {navItems.map((item) => (
            <NavItem key={item} label={item} />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: actionInset
              ? 'var(--space-3) var(--space-4) var(--mobile-bottom-action-padding-bottom)'
              : 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--color-semantic-line-normal-normal)',
            background: 'var(--color-semantic-background-elevated-normal)',
          }}
        >
          <Button full size="sm">주요 액션</Button>
        </div>
      )}
      <div style={homeIndicatorStyle}>
        <HomeIndicator />
      </div>
    </div>
  );
}

const tokenRows = [
  ['상태 영역 세이프 에어리어', '--mobile-safe-area-top', 'env(safe-area-inset-top)'],
  ['상태 바 최소 높이', '--mobile-status-bar-min-height', '44px'],
  ['하단 세이프 에어리어', '--mobile-safe-area-bottom', 'env(safe-area-inset-bottom)'],
  ['홈 인디케이터', '--mobile-home-indicator-height', '34px'],
  ['하단 바 최소 높이', '--mobile-bottom-bar-min-height', '64px'],
  ['하단 액션 패딩', '--mobile-bottom-action-padding-bottom', 'space-4 + safe-area-bottom'],
];

export const MobileSafeAreaSpacing = {
  name: '모바일 세이프 에어리어 간격',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Spacing / Safe Area
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          상태 영역과 하단 세이프 에어리어는 간격 토큰입니다
        </h1>
        <p style={{ margin: 0, maxWidth: 780, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          Spacing 소스는 상태 영역과 하단 영역을 구분합니다. LDS는 이 오프셋을 개별 모바일 컴포넌트 안에 숨기지 않고
          런타임 간격 토큰으로 유지합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--color-semantic-label-strong)' }}>상태 영역</h2>
          <PhoneFrame />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
            상단 상태 영역은 상태 바 최소 높이와 세이프 에어리어 상단 인셋을 합쳐 구성합니다.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--color-semantic-label-strong)' }}>하단 내비게이션</h2>
          <PhoneFrame variant="bottom" />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
            하단 내비게이션은 홈 인디케이터와 하단 세이프 에어리어를 레이아웃 리듬의 일부로 유지합니다.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--color-semantic-label-strong)' }}>하단 액션</h2>
          <PhoneFrame actionInset />
          <p style={{ margin: 'var(--space-4) 0 0', color: 'var(--color-semantic-label-neutral)', lineHeight: 1.6 }}>
            고정된 하단 액션은 하단 세이프 에어리어를 포함해 터치 영역이 항상 보이고 닿을 수 있게 합니다.
          </p>
        </article>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 18, color: 'var(--color-semantic-label-strong)' }}>런타임 토큰</h2>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {tokenRows.map(([label, token, note]) => (
            <div
              key={token}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(160px, 1fr) minmax(220px, 1fr) minmax(160px, 1fr)',
                gap: 'var(--space-3)',
                alignItems: 'center',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-semantic-line-normal-normal)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-semantic-fill-alternative)',
              }}
            >
              <strong style={{ color: 'var(--color-semantic-label-normal)' }}>{label}</strong>
              <code style={{ color: 'var(--color-semantic-label-alternative)', wordBreak: 'break-word' }}>{token}</code>
              <span style={{ color: 'var(--color-semantic-label-neutral)' }}>{note}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  ),
};
