
const meta = {
  id: 'lds-core-foundation-effects',
  title: 'LDS Core/Foundation/Gradient',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-foundation-effects--gradient-tokens',
      eyebrow: 'Foundation / Gradient',
      title: 'Gradient는 제한된 전환·fade·브랜드 강조에만 사용합니다',
      description:
        '승인된 유형·방향·stop token을 재사용하고 상태 의미나 텍스트 대비를 gradient에 의존하지 않습니다.',
    },
    docs: {
      description: {
        component:
          '장식 효과 토큰입니다. Gradient와 Mask를 유형(Solid/Multiple/Mask)과 방향(top/right/bottom/left)으로 토큰화해 컴포넌트가 임의의 그라디언트·페이드를 만들지 않도록 합니다.',
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

const gradientTokens = [
  ['Solid top', '--decorate-gradient-solid-top'],
  ['Solid right', '--decorate-gradient-solid-right'],
  ['Solid bottom', '--decorate-gradient-solid-bottom'],
  ['Solid left', '--decorate-gradient-solid-left'],
  ['Multiple top', '--decorate-gradient-multiple-top'],
  ['Multiple right', '--decorate-gradient-multiple-right'],
  ['Multiple bottom', '--decorate-gradient-multiple-bottom'],
  ['Multiple left', '--decorate-gradient-multiple-left'],
];

const maskTokens = [
  ['Mask top', '--decorate-mask-fade-top'],
  ['Mask right', '--decorate-mask-fade-right'],
  ['Mask bottom', '--decorate-mask-fade-bottom'],
  ['Mask left', '--decorate-mask-fade-left'],
];

function TokenCard({ label, token, children }) {
  return (
    <article style={{ ...panelStyle, display: 'grid', gap: 'var(--space-3)' }}>
      {children}
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{label}</strong>
        <code style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{token}</code>
      </div>
    </article>
  );
}

function GradientSwatch({ label, token }) {
  return (
    <TokenCard label={label} token={token}>
      <div
        style={{
          height: 104,
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: `var(${token})`,
        }}
      />
    </TokenCard>
  );
}

function MaskSwatch({ label, token }) {
  return (
    <TokenCard label={label} token={token}>
      <div
        style={{
          height: 104,
          borderRadius: 'var(--radius-frame-md)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-background-normal-alternative)',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            width: '78%',
            height: 56,
            borderRadius: 'var(--radius-frame-md)',
            background: 'var(--color-semantic-label-normal)',
            WebkitMaskImage: `var(${token})`,
            maskImage: `var(${token})`,
          }}
        />
      </div>
    </TokenCard>
  );
}

export const GradientTokens = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          'Solid·Multiple 그라디언트와 Mask 페이드를 유형·방향별로 봅니다. 같은 유형 안에서 방향 토큰이 일관된 각도·세기를 유지하는지, 마스크가 콘텐츠를 가리지 않는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1120 }}>
      {/*
        No eyebrow and no title here. `parameters.storyGuide` already puts a masthead above this
        story with the same eyebrow and a title of its own, so a second one made the page
        introduce itself twice. What stays is the part the masthead does not say: where this
        classification comes from.
      */}
      <p style={{ margin: 0, maxWidth: 820, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
        Decorate 소스는 Solid, Multiple, Mask 그라디언트를 구분합니다. LDS는 같은 분류를 유지하면서 top,
        right, bottom, left 방향 토큰을 제공합니다.
      </p>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Solid와 Multiple
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
          {gradientTokens.map(([label, token]) => (
            <GradientSwatch key={token} label={label} token={token} />
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          마스크
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)' }}>
          {maskTokens.map(([label, token]) => (
            <MaskSwatch key={token} label={label} token={token} />
          ))}
        </div>
      </section>
    </main>
  ),
};
