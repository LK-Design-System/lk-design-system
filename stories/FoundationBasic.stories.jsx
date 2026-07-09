import { AspectRatio } from '../src/index.js';

const meta = {
  title: 'LDS Core/Foundation/Basic',
  parameters: {
    docs: {
      description: {
        component: '로컬 소스에서 내보내는 비율(ratio) 프리미티브를 다루는 파운데이션 커버리지입니다.',
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

const horizontalRatios = [
  ['1:1', '--ratio-1-1'],
  ['5:4', '--ratio-5-4'],
  ['4:3', '--ratio-4-3'],
  ['3:2', '--ratio-3-2'],
  ['16:10', '--ratio-16-10'],
  ['Golden', '--ratio-golden'],
  ['16:9', '--ratio-16-9'],
  ['2:1', '--ratio-2-1'],
  ['21:9', '--ratio-21-9'],
];

const verticalRatios = [
  ['1:2', '--ratio-1-2'],
  ['4:5', '--ratio-4-5'],
  ['3:4', '--ratio-3-4'],
  ['2:3', '--ratio-2-3'],
  ['10:16', '--ratio-10-16'],
  ['Golden vertical', '--ratio-golden-vertical'],
  ['9:16', '--ratio-9-16'],
  ['9:21', '--ratio-9-21'],
];

function RatioTile({ label, token, vertical = false }) {
  return (
    <article
      style={{
        ...panelStyle,
        display: 'grid',
        gap: 'var(--space-3)',
        minWidth: 0,
      }}
    >
      <AspectRatio
        ratio={`var(${token})`}
        style={{
          width: vertical ? 92 : '100%',
          maxWidth: '100%',
          justifySelf: vertical ? 'center' : 'stretch',
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background:
            'linear-gradient(135deg, var(--color-semantic-background-normal-alternative) 0%, var(--color-semantic-fill-normal) 54%, var(--color-semantic-background-elevated-normal) 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 'var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-semantic-line-normal-normal)',
          }}
        />
      </AspectRatio>
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{label}</strong>
        <code style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
      </div>
    </article>
  );
}

export const RatioTokens = {
  name: '비율 토큰',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1180 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Basic / Ratio
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          비율은 임의의 레이아웃 값이 아니라 파운데이션 토큰입니다
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          파운데이션 소스는 가로·세로 비율 프리셋을 정의합니다. LDS는 이를 CSS aspect-ratio 토큰으로 노출하고
          AspectRatio 프리미티브를 통해 사용하도록 안내합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          가로 비율
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
          {horizontalRatios.map(([label, token]) => (
            <RatioTile key={token} label={label} token={token} />
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          세로 비율
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
          {verticalRatios.map(([label, token]) => (
            <RatioTile key={token} label={label} token={token} vertical />
          ))}
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>커스터마이즈 규칙</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.65 }}>
            가로 예시는 너비를 지정하고 높이는 선택한 비율 토큰을 따르게 합니다.
          </p>
          <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.65 }}>
            세로 예시는 높이나 감싸는 컬럼을 지정하고 너비는 토큰에서 계산되도록 유지합니다.
          </p>
        </div>
      </section>
    </main>
  ),
};
