import React from 'react';
import bundleSource from '../_ds_bundle.js?raw';
import baseCss from '../tokens/base.css?raw';
import colorsCss from '../tokens/colors.css?raw';
import componentsCss from '../tokens/components.css?raw';
import effectsCss from '../tokens/effects.css?raw';
import fontsCss from '../tokens/fonts.css?raw';
import gridCss from '../tokens/grid.css?raw';
import spacingCss from '../tokens/spacing.css?raw';
import typographyCss from '../tokens/typography.css?raw';

const meta = {
  title: '문서/원본 미리보기',
  parameters: {
    docs: {
      description: {
        component:
          '예전 정적 HTML 기반 디자인 시스템 카드와 지침을 Storybook 안에서 직접 렌더링합니다. 현재 React 스토리와 원본 시각 기준을 나란히 검증할 때 사용합니다.',
      },
    },
  },
};

export default meta;

const guidelineModules = import.meta.glob('../guidelines/**/*.html', { eager: true, import: 'default', query: '?raw' });
const componentModules = import.meta.glob('../components/**/*.card.html', { eager: true, import: 'default', query: '?raw' });
const templateModules = import.meta.glob('../templates-cards/**/*.html', { eager: true, import: 'default', query: '?raw' });

const previewCss = [
  fontsCss,
  colorsCss,
  typographyCss,
  spacingCss,
  gridCss,
  effectsCss,
  componentsCss,
  baseCss,
]
  .join('\n\n')
  .replaceAll("../assets/", "/assets/");

const previewScript = bundleSource.replaceAll('</script', '<\\/script');
const seededRandomResetScript = `<script>
(() => {
  let seed = 0x4f14ff >>> 0;
  Math.random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
})();
</script>`;

function fileName(path) {
  return path.split('/').pop()?.replace(/\.card\.html$/, '').replace(/\.html$/, '') || path;
}

function sourcePath(path) {
  return path.replace(/^\.\.\//, '');
}

function parseCardMeta(html, path) {
  const comment = html.match(/@dsCard\s+([^]*?)-->/)?.[1] || '';
  const attrs = {};

  for (const match of comment.matchAll(/(\w+)="([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }

  const displayName = attrs.name || fileName(path);
  const group = attrs.group || path.split('/')[1] || '원본';

  return {
    displayName,
    group,
    id: sourcePath(path),
    label: `${displayName} · ${sourcePath(path)}`,
    sourcePath: sourcePath(path),
    subtitle: attrs.subtitle || '원본 정적 HTML preview',
    viewport: attrs.viewport || '900x520',
    html,
  };
}

function parseViewport(viewport) {
  const match = String(viewport).match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { width: 900, height: 520 };
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function buildItems(modules) {
  return Object.entries(modules)
    .map(([path, html]) => parseCardMeta(html, path))
    .sort((a, b) => `${a.group} ${a.displayName}`.localeCompare(`${b.group} ${b.displayName}`, 'ko'));
}

const guidelineItems = buildItems(guidelineModules);
const componentItems = buildItems(componentModules);
const templateItems = buildItems(templateModules);

function createOptions(items) {
  return items.map((item) => item.id);
}

function createLabels(items) {
  return Object.fromEntries(items.map((item) => [item.id, item.label]));
}

function normalizeLegacyHtml(item) {
  return item.html
    .replace(/<link[^>]+href=["'][^"']*styles\.css["'][^>]*>/gi, `<style>${previewCss}</style>`)
    .replace(/<script[^>]+src=["'][^"']*_ds_bundle\.js["'][^>]*>\s*<\/script>/gi, `<script>${previewScript}</script>`)
    .replace(/<script\s+type=["']text\/babel["']>/i, `${seededRandomResetScript}<script type="text/babel">`)
    .replace(/(src|href)=["'](?:\.\.\/)+assets\//gi, '$1="/assets/')
    .replace(/url\((['"]?)(?:\.\.\/)+assets\//gi, 'url($1/assets/');
}

function LegacyPreview({ item }) {
  const { width, height } = parseViewport(item.viewport);
  const srcDoc = normalizeLegacyHtml(item);

  return (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1240, margin: '0 auto', letterSpacing: 0 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--accent-text)', fontSize: 13 }}>{item.group}</strong>
        <h1 style={{ margin: 0, color: 'var(--label-strong)', fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)' }}>
          {item.displayName}
        </h1>
        <p style={{ margin: 0, maxWidth: 880, color: 'var(--label-neutral)', lineHeight: 1.65 }}>{item.subtitle}</p>
        <code
          style={{
            color: 'var(--label-alternative)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            letterSpacing: 0,
          }}
        >
          {item.sourcePath} · {item.viewport}
        </code>
      </header>

      <section
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'auto',
          padding: 'var(--space-4)',
        }}
      >
        <iframe
          key={item.id}
          title={item.label}
          srcDoc={srcDoc}
          style={{
            display: 'block',
            width,
            maxWidth: '100%',
            height,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            background: 'white',
          }}
        />
      </section>
    </main>
  );
}

function PreviewStory({ items, selected }) {
  const querySelected =
    typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('selected');
  const externalSelected = querySelected || selected || items[0]?.id;
  const [currentId, setCurrentId] = React.useState(externalSelected);

  React.useEffect(() => {
    setCurrentId(externalSelected);
  }, [externalSelected]);

  const item = items.find((candidate) => candidate.id === currentId) || items[0];

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div
        style={{
          display: 'grid',
          gap: 'var(--space-2)',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
          letterSpacing: 0,
        }}
      >
        <label style={{ color: 'var(--label-alternative)', fontSize: 13, fontWeight: 800 }} htmlFor="legacy-preview-select">
          원본 파일 선택
        </label>
        <select
          id="legacy-preview-select"
          value={item.id}
          onChange={(event) => setCurrentId(event.target.value)}
          style={{
            width: 'min(720px, 100%)',
            minHeight: 44,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-card)',
            color: 'var(--label-normal)',
            font: '600 14px/1.2 var(--font-sans)',
            letterSpacing: 0,
            padding: '0 12px',
          }}
        >
          {items.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.label}
            </option>
          ))}
        </select>
      </div>
      <LegacyPreview item={item} />
    </div>
  );
}

export const FoundationGuidelines = {
  name: '원본 지침',
  args: {
    selected: guidelineItems[0]?.id,
  },
  argTypes: {
    selected: {
      name: '원본 지침',
      control: 'select',
      options: createOptions(guidelineItems),
      labels: createLabels(guidelineItems),
    },
  },
  render: ({ selected }) => <PreviewStory items={guidelineItems} selected={selected} />,
};

export const ComponentCards = {
  name: '원본 컴포넌트 카드',
  args: {
    selected: componentItems[0]?.id,
  },
  argTypes: {
    selected: {
      name: '원본 컴포넌트 카드',
      control: 'select',
      options: createOptions(componentItems),
      labels: createLabels(componentItems),
    },
  },
  render: ({ selected }) => <PreviewStory items={componentItems} selected={selected} />,
};

export const TemplateCards = {
  name: '원본 템플릿 카드',
  args: {
    selected: templateItems[0]?.id,
  },
  argTypes: {
    selected: {
      name: '원본 템플릿 카드',
      control: 'select',
      options: createOptions(templateItems),
      labels: createLabels(templateItems),
    },
  },
  render: ({ selected }) => <PreviewStory items={templateItems} selected={selected} />,
};
