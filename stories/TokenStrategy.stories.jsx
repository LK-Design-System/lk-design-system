import React from 'react';
import tokenSource from '../tokens/source.json';

const meta = {
  title: 'Foundations/Token Strategy',
  parameters: {
    docs: {
      description: {
        component: 'Machine-readable token hierarchy used by AI, Figma workflows, CSS runtime tokens, and component contracts.',
      },
    },
  },
};

export default meta;

const layerSummaries = [
  {
    name: 'Primitive',
    description: tokenSource.primitive.description,
    example: 'primitive.color.brandNavy -> --bw-ink',
  },
  {
    name: 'Semantic',
    description: tokenSource.semantic.description,
    example: 'semantic.action.primary -> --color-primary',
  },
  {
    name: 'Component',
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
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Token strategy
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)' }}>
          Primitive to semantic to component
        </h1>
        <p style={{ margin: 0, maxWidth: 760, color: 'var(--label-neutral)' }}>
          `tokens/source.json` gives AI tools and Figma workflows a structured map of the runtime CSS contract.
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
  ),
};

export const ComponentContracts = {
  render: () => (
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
  ),
};

export const RuntimeFiles = {
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
      <h1 style={{ margin: 0, fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
        Runtime import order
      </h1>
      <ol style={{ margin: 0, paddingLeft: 22, display: 'grid', gap: 'var(--space-2)' }}>
        {tokenSource.metadata.runtimeCssFiles.map((file) => (
          <li key={file}>
            <TokenCode>{file}</TokenCode>
          </li>
        ))}
      </ol>
    </main>
  ),
};
