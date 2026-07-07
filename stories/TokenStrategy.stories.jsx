import React from 'react';

const meta = {
  title: 'Documents/WDS Alignment/Token Strategy',
  parameters: {
    docs: {
      description: {
        component: 'AI, Figma 워크플로, CSS 런타임 토큰, 컴포넌트 계약이 함께 사용하는 기계 판독용 토큰 계층입니다.',
      },
    },
  },
};

export default meta;

const fallbackTokenSource = {
  primitive: {
    description: '브랜드 원값, 스케일, 효과 값입니다. primitive 토큰은 semantic 토큰을 정의하거나 수정할 때만 사용합니다.',
  },
  semantic: {
    description: '앱 UI에서 쓰는 의미 기반 토큰입니다. 화면 구현에서는 primitive보다 semantic 토큰을 우선 사용합니다.',
  },
  component: {
    description: '컴포넌트별 시각 결정입니다. 컴포넌트 구현은 hardcoded hex, rgba, px, shadow 대신 이 토큰을 사용해야 합니다.',
    button: {
      component: 'components/buttons/Button.jsx',
      tokens: {},
    },
    input: {
      component: 'components/forms/Input.jsx',
      tokens: {},
    },
    card: {
      component: 'components/cards/Card.jsx',
      tokens: {},
    },
  },
  metadata: {
    runtimeCssFiles: [
      'tokens/fonts.css',
      'tokens/colors.css',
      'tokens/typography.css',
      'tokens/spacing.css',
      'tokens/grid.css',
      'tokens/effects.css',
      'tokens/components.css',
      'tokens/base.css',
    ],
  },
};

function useTokenSource() {
  const [tokenSource, setTokenSource] = React.useState(fallbackTokenSource);

  React.useEffect(() => {
    let isMounted = true;

    fetch('/tokens/source.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Token source request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((source) => {
        if (isMounted) {
          setTokenSource(source);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTokenSource(fallbackTokenSource);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return tokenSource;
}

const getLayerSummaries = (tokenSource) => [
  {
    name: 'Primitive 원천 토큰',
    description: tokenSource.primitive.description,
    example: 'primitive.color.brandNavy -> --bw-ink',
  },
  {
    name: 'Semantic 의미 토큰',
    description: tokenSource.semantic.description,
    example: 'semantic.action.primary -> --color-primary',
  },
  {
    name: 'Component 컴포넌트 토큰',
    description: tokenSource.component.description,
    example: 'component.button.tokens.primaryBg -> --component-button-primary-bg',
  },
];

const componentNames = ['button', 'input', 'card'];

function TokenCode({ children }) {
  return (
    <code style={{ fontSize: 12, color: 'var(--label-alternative)', wordBreak: 'break-word' }}>
      {children}
    </code>
  );
}

function TokenSwatch({ token }) {
  const value = token.$value;
  const isColor = token.$type === 'color';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isColor ? '28px 1fr' : '1fr', gap: 'var(--space-2)', alignItems: 'center' }}>
      {isColor && (
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-hairline)',
            background: value,
          }}
        />
      )}
      <TokenCode>{Array.isArray(token.css) ? token.css.join(', ') : token.css}</TokenCode>
    </div>
  );
}

export const Hierarchy = {
  name: '토큰 계층',
  render: () => {
    const tokenSource = useTokenSource();
    const layerSummaries = getLayerSummaries(tokenSource);

    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
        <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
            토큰 전략
          </p>
          <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)' }}>
            Primitive에서 semantic, component까지
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: 'var(--label-neutral)' }}>
            `tokens/source.json`은 AI 도구와 Figma 워크플로가 런타임 CSS 계약을 구조적으로 이해하도록 돕습니다.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {layerSummaries.map((layer) => (
            <article key={layer.name} style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', background: 'var(--surface-card)' }}>
              <h2 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
                {layer.name}
              </h2>
              <p style={{ margin: '0 0 var(--space-4)', color: 'var(--label-neutral)' }}>{layer.description}</p>
              <TokenCode>{layer.example}</TokenCode>
            </article>
          ))}
        </section>
      </main>
    );
  },
};

export const ComponentContracts = {
  name: '컴포넌트 계약',
  render: () => {
    const tokenSource = useTokenSource();

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1080 }}>
        {componentNames.map((componentName) => {
          const component = tokenSource.component[componentName];
          const tokens = Object.entries(component.tokens);

          return (
            <section key={componentName} style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div>
                <h2 style={{ margin: 0, textTransform: 'capitalize', fontSize: 'var(--title3-size)', lineHeight: 'var(--title3-line)' }}>
                  {componentName}
                </h2>
                <TokenCode>{component.component}</TokenCode>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
                {tokens.map(([name, token]) => (
                  <article key={name} style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--surface-card)' }}>
                    <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>{name}</strong>
                    <TokenSwatch token={token} />
                    {token.ref && (
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <TokenCode>{token.ref}</TokenCode>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    );
  },
};

export const RuntimeFiles = {
  name: '런타임 파일',
  render: () => {
    const tokenSource = useTokenSource();

    return (
      <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          런타임 import 순서
        </h1>
        <ol style={{ margin: 0, paddingLeft: 22, display: 'grid', gap: 'var(--space-2)' }}>
          {tokenSource.metadata.runtimeCssFiles.map((file) => (
            <li key={file}>
              <TokenCode>{file}</TokenCode>
            </li>
          ))}
        </ol>
      </main>
    );
  },
};
