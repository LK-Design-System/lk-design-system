import React from 'react';
import { Callout, Stack, Table, Tag } from '../src/index.js';
import foundationContent from '../docs/foundations/foundation-content.json';
import { storyDescription } from './StoryGuide.shared.jsx';

/**
 * Every custom property the loaded stylesheets declare.
 *
 * A Foundation lists token *families* (`--space-*`), not individual names, so the specimen has
 * to expand a family into the tokens it covers. This reads the live stylesheets rather than
 * importing tokens/source.json: `tokens/` is a Storybook staticDir, so that import resolves to
 * a raw JSON response instead of a module and takes the whole story down in dev.
 */
function readDeclaredTokens() {
  if (typeof document === 'undefined') return [];
  const names = new Set();
  // styles.css pulls the token files in with @import, and themes nest declarations inside
  // media rules, so both have to be walked rather than only the top level.
  const collect = (sheet) => {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      return; // cross-origin sheet; nothing of ours lives there
    }
    for (const rule of rules ?? []) {
      if (rule.styleSheet) collect(rule.styleSheet);
      if (rule.cssRules) collect(rule);
      if (!rule.style) continue;
      for (const property of rule.style) {
        if (property.startsWith('--')) names.add(property);
      }
    }
  };
  for (const sheet of document.styleSheets) collect(sheet);
  return [...names].sort();
}

/** `--space-*` covers every declared token whose name starts with `--space-`. */
function expandTokenFamily(entry, declared) {
  if (!entry.includes('*')) return [entry];
  const pattern = new RegExp(`^${entry.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`);
  return declared.filter((name) => pattern.test(name));
}

/**
 * The canvas of a Foundation page shows the foundation itself — its tokens, resolved live,
 * with a preview appropriate to what the token controls. The prose that explains when and why
 * to reach for them lives on the Docs tab, the same split every component page uses.
 */

const foundations = new Map(foundationContent.foundations.map((f) => [f.slug, f]));

/** Token families render a different preview because they control different things. */
function tokenKind(name) {
  if (/^--color-/.test(name)) return 'color';
  if (/^--shadow-/.test(name)) return 'shadow';
  if (/^--radius-/.test(name)) return 'radius';
  if (/^--(space|gutter|container|header-h|control-h|mobile-)/.test(name)) return 'length';
  if (/^--(duration|ease|motion|transition)/.test(name)) return 'motion';
  if (/-(size|line|spacing)$/.test(name) || /^--(fw|fs|ls|font)/.test(name)) return 'type';
  if (/^--border-/.test(name)) return 'border';
  return 'raw';
}

function Preview({ name, value, kind }) {
  const box = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  if (kind === 'color') {
    return (
      <span
        aria-hidden="true"
        style={{
          ...box,
          width: 72,
          height: 24,
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          background: value,
        }}
      />
    );
  }
  if (kind === 'shadow') {
    return (
      <span
        aria-hidden="true"
        style={{
          ...box,
          width: 72,
          height: 32,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-background-elevated-normal)',
          boxShadow: value,
        }}
      />
    );
  }
  if (kind === 'radius') {
    return (
      <span
        aria-hidden="true"
        style={{
          ...box,
          width: 48,
          height: 32,
          borderRadius: value,
          border: '1px solid var(--color-semantic-line-solid-normal)',
          background: 'var(--color-semantic-fill-alternative)',
        }}
      />
    );
  }
  if (kind === 'length') {
    // Long page-scale values would blow out the column, so the bar is capped and labelled.
    const parsed = Number.parseFloat(value);
    const width = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 2), 220) : 2;
    return (
      <span
        aria-hidden="true"
        style={{
          ...box,
          width,
          height: 12,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-semantic-primary-normal)',
        }}
      />
    );
  }
  if (kind === 'border') {
    return (
      <span
        aria-hidden="true"
        style={{ ...box, width: 72, height: 0, borderTop: `${value} solid var(--color-semantic-label-strong)` }}
      />
    );
  }
  if (kind === 'type') {
    const isSize = /-size$/.test(name) || /^--fs/.test(name);
    return (
      <span style={isSize ? { fontSize: value, lineHeight: 1.2 } : { fontWeight: value }}>
        가나다 Ag
      </span>
    );
  }
  if (kind === 'motion') {
    return <code style={{ fontSize: 'var(--caption1-size)' }}>{value}</code>;
  }
  return <span style={{ color: 'var(--color-semantic-label-alternative)' }}>—</span>;
}

/**
 * Resolved during render, not in an effect: an effect leaves the first paint with an empty
 * table, and a play function that runs before it flushes sees a specimen with no rows.
 */
function useResolvedTokens(names) {
  return React.useMemo(() => {
    if (typeof document === 'undefined') return [];
    const computed = getComputedStyle(document.documentElement);
    return names.map((name) => ({
      name,
      value: computed.getPropertyValue(name).trim(),
      kind: tokenKind(name),
    }));
  }, [names]);
}

export function FoundationSpecimen({ slug }) {
  const foundation = foundations.get(slug);
  if (!foundation) throw new Error(`Unknown foundation: ${slug}`);

  // The tokens array mixes token families (`--space-*`) with prose references ("logical CSS
  // properties"). Families expand to the tokens they cover; prose stays a reference chip.
  const names = React.useMemo(() => {
    const declared = readDeclaredTokens();
    const expanded = foundation.tokens
      .filter((token) => token.startsWith('--'))
      .flatMap((entry) => expandTokenFamily(entry, declared));
    return [...new Set(expanded)];
  }, [foundation]);
  const notes = foundation.tokens.filter((token) => !token.startsWith('--'));
  const rows = useResolvedTokens(names);
  const undefinedTokens = rows.filter((row) => !row.value);

  return (
    <Stack as="main" gap="var(--space-6)" style={{ width: 'min(920px, 100%)', minWidth: 0 }}>
      <Callout tone="signal">{foundation.purpose}</Callout>

      {rows.length > 0 ? (
        <Table
          columns={[
            { key: 'name', label: '토큰', render: (row) => <code>{row.name}</code> },
            { key: 'value', label: '값', render: (row) => (row.value ? <code>{row.value}</code> : <Tag tone="red">미정의</Tag>) },
            { key: 'preview', label: '표현', render: (row) => <Preview name={row.name} value={row.value} kind={row.kind} /> },
          ]}
          rows={rows}
          size="sm"
          rowHeaderKey="name"
          tableLabel={`${foundation.title} 토큰`}
          role="region"
          aria-label={`${foundation.title} 토큰`}
          tabIndex={0}
          data-foundation-specimen
          getRowId={(row) => row.name}
        />
      ) : null}

      {notes.length > 0 ? (
        <Stack direction="row" gap="var(--space-2)" wrap data-foundation-references aria-label={`${foundation.title} 참조 토큰 계열`}>
          {notes.map((note) => <Tag key={note} tone="neutral">{note}</Tag>)}
        </Stack>
      ) : null}

      {undefinedTokens.length > 0 ? (
        <Callout tone="negative" title="정의되지 않은 토큰">
          {undefinedTokens.map((row) => row.name).join(', ')} — 런타임 CSS에 선언이 없어 이 토큰을 쓰는 선언은 통째로 무시됩니다.
        </Callout>
      ) : null}
    </Stack>
  );
}

export function foundationSpecimenStory(slug, name = '개요') {
  const foundation = foundations.get(slug);
  if (!foundation) throw new Error(`Unknown foundation: ${slug}`);
  return {
    name,
    parameters: storyDescription(
      `${foundation.title}가 실제로 노출하는 토큰과 현재 값을 확인합니다. 이름과 값이 런타임과 어긋나면 표가 바로 드러내며, 선택 기준과 정량 규칙은 이 페이지의 Docs 탭에 있습니다.`,
    ),
    render: () => <FoundationSpecimen slug={slug} />,
  };
}

export async function verifyFoundationSpecimenAtNarrowWidth({ canvasElement }) {
  const table = canvasElement.querySelector('[data-foundation-specimen]');
  if (!table) {
    // A foundation whose token list is all file references has no specimen to render; its page
    // is documentation only. It still has to say which sources define it.
    const references = canvasElement.querySelectorAll('[data-foundation-references] *');
    if (references.length === 0) {
      throw new Error('실물이 없는 Foundation 캔버스는 최소한 정의 출처를 가리켜야 합니다.');
    }
    return;
  }
  if (table.tabIndex !== 0) {
    throw new Error('넓은 토큰 표는 키보드로 접근 가능한 스크롤 영역을 가져야 합니다.');
  }
  const rows = table.querySelectorAll('tbody tr');
  if (rows.length === 0) throw new Error('토큰 실물 표에 행이 없습니다.');
  // A foundation page must not advertise a token the runtime never defines.
  const missing = [...table.querySelectorAll('tbody tr')].filter((row) => /미정의/.test(row.textContent || ''));
  if (missing.length > 0) {
    throw new Error(`정의되지 않은 토큰이 ${missing.length}개 있습니다 — 런타임 CSS 선언을 추가하거나 목록에서 제거하세요.`);
  }

  // Narrow (320px): the Layout foundation forbids page-level horizontal overflow, so a wide
  // token table has to scroll inside its own region rather than push the page sideways.
  const main = table.closest('main') ?? canvasElement.querySelector('main');
  if (!main) throw new Error('Foundation 실물은 main 영역 안에 있어야 합니다.');
  const previousWidth = main.style.width;
  try {
    main.style.width = '320px';
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (main.scrollWidth > main.clientWidth + 1) {
      throw new Error('320px에서 페이지가 가로로 넘칩니다 — 표는 자신의 영역 안에서 스크롤해야 합니다.');
    }
  } finally {
    main.style.width = previousWidth;
  }
}
