import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const foundationRoot = path.join(root, 'docs', 'foundations');
const sourcePath = path.join(foundationRoot, 'foundation-content.json');
const tokenSourcePath = path.join(root, 'tokens', 'source.json');
const check = process.argv.includes('--check');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function table(headers, rows) {
  const render = (row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`;
  return [
    render(headers),
    render(headers.map(() => '---')),
    ...rows.map(render),
  ].join('\n');
}

function bullets(values) {
  return values.map((value) => `- ${value}`).join('\n');
}

function references(foundation) {
  return foundation.sources.map((source) => {
    if (source.url) return `- [${source.label}](${source.url})`;
    return `- ${source.label}: \`${source.path}\``;
  }).join('\n');
}

function renderFoundation(foundation) {
  return `# ${foundation.title}

| Field | Value |
| --- | --- |
| Type | Foundation guide |
| Status | Current |
| Owner | Foundation owner |
| Source | \`foundation-content.json#${foundation.slug}\` |

${foundation.purpose}

## 목적과 원리

${bullets(foundation.principles)}

## Semantic model

${table(['역할', '의미'], foundation.semanticModel)}

## 선택 기준

${table(['상황', '사용', '피함'], foundation.selectionCriteria)}

## 정량 규칙

${table(['항목', '기준'], foundation.quantitativeRules)}

## Do / Don't

${table(['구분', '지침'], foundation.doDont)}

## 예외

${bullets(foundation.exceptions)}

## 접근성

${bullets(foundation.accessibility)}

## 국제화

${bullets(foundation.internationalization)}

## LDS 예시

${table(['상황', '결정'], foundation.examples)}

## 토큰과 API

### Tokens

${bullets(foundation.tokens.map((token) => `\`${token}\``))}

### Components and checks

${bullets(foundation.apis.map((api) => `\`${api}\``))}

## 참고 자료

${references(foundation)}
`;
}

function tokenValue(token) {
  if ('$value' in token) {
    return typeof token.$value === 'object' ? JSON.stringify(token.$value) : String(token.$value);
  }
  if (token.modes) return Object.entries(token.modes).map(([mode, value]) => `${mode}: ${value}`).join('; ');
  return '';
}

function collectTokens(value, pathParts = [], result = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectTokens(item, [...pathParts, String(index)], result));
    return result;
  }
  if (!value || typeof value !== 'object') return result;
  if (value.$type && (value.css || value.$value || value.modes)) {
    result.push({
      path: pathParts.join('.'),
      type: value.$type,
      css: Array.isArray(value.css) ? value.css.join(', ') : (value.css || ''),
      value: tokenValue(value),
      description: value.description || value.note || '',
    });
    return result;
  }
  for (const [key, child] of Object.entries(value)) collectTokens(child, [...pathParts, key], result);
  return result;
}

async function emit(relativePath, next) {
  const absolute = path.join(foundationRoot, relativePath);
  if (check) {
    const current = await readFile(absolute, 'utf8').catch(() => '');
    assert(current === next, `Generated foundation artifact is stale: docs/foundations/${relativePath}`);
    return;
  }
  await writeFile(absolute, next);
}

const content = JSON.parse(await readFile(sourcePath, 'utf8'));
const expectedSlugs = [
  'design-token', 'color', 'typography', 'iconography', 'elevation',
  'gradient', 'inclusive-design', 'international-design', 'layout', 'motion',
  'radius', 'spacing', 'state', 'voice-and-tone', 'writing',
];
assert(content.schemaVersion === 1, 'foundation-content.json schemaVersion must be 1.');
assert(content.completionCriteria.length >= 10, 'Foundation completion criteria must contain at least 10 requirements.');
assert(content.foundations.length === expectedSlugs.length, `Expected ${expectedSlugs.length} foundations.`);
assert(new Set(content.foundations.map(({ slug }) => slug)).size === expectedSlugs.length, 'Foundation slugs must be unique.');
assert(expectedSlugs.every((slug) => content.foundations.some((item) => item.slug === slug)), 'Foundation inventory does not match the required 15 areas.');

const requiredArrays = [
  'principles', 'semanticModel', 'selectionCriteria', 'quantitativeRules', 'doDont',
  'exceptions', 'accessibility', 'internationalization', 'examples', 'tokens', 'apis', 'sources',
];
for (const foundation of content.foundations) {
  assert(foundation.purpose?.length >= 40, `${foundation.slug}: purpose is too short.`);
  for (const field of requiredArrays) {
    assert(Array.isArray(foundation[field]) && foundation[field].length > 0, `${foundation.slug}: ${field} must not be empty.`);
  }
}

const index = `# LK Design System Foundations

| Field | Value |
| --- | --- |
| Type | Foundation guide index |
| Status | Current |
| Owner | Foundation owner |
| Source | \`foundation-content.json\` |

Foundation은 토큰 목록이 아니라 디자인 결정을 반복 가능하게 만드는 공개 계약입니다. 각 문서는 목적·semantic model·선택 기준·정량 규칙·Do/Don't·예외·접근성·국제화·LDS 예시·토큰/API 연결을 모두 포함해야 완료입니다.

## Completion contract

${content.completionCriteria.map((criterion, index) => `${index + 1}. \`${criterion}\``).join('\n')}

## Guides

${content.foundations.map((foundation) => `- [${foundation.title}](${foundation.slug}.md) — ${foundation.purpose}`).join('\n')}

## Machine-readable surfaces

- [Foundation content](foundation-content.json) — canonical structured guidance
- [JSON Schema](foundation-content.schema.json) — required section contract
- [Token reference](TOKEN_REFERENCE.md) — generated token index
- [LLM bundle](llms.txt) — generated full-text context

## Refresh and verification

\`\`\`bash
npm run generate:foundations
npm run check:foundations
\`\`\`
`;

await emit('README.md', index);
for (const foundation of content.foundations) await emit(`${foundation.slug}.md`, renderFoundation(foundation));

const llms = [
  '# LK Design System Foundations',
  '',
  'Canonical source: docs/foundations/foundation-content.json',
  '',
  ...content.foundations.flatMap((foundation) => [renderFoundation(foundation), '\n---\n']),
].join('\n');
await emit('llms.txt', llms);

const tokenSource = JSON.parse(await readFile(tokenSourcePath, 'utf8'));
const tokenRows = collectTokens(tokenSource)
  .sort((a, b) => a.path.localeCompare(b.path))
  .map((token) => [`\`${token.path}\``, token.type, token.css ? `\`${token.css}\`` : '—', `\`${token.value}\``, token.description || '—']);
for (const token of tokenSource.runtimeCoverage?.tokens || []) {
  tokenRows.push([
    '`runtimeCoverage`',
    token.classification,
    `\`${token.css}\``,
    `\`${token.values.join(' · ')}\``,
    `${token.reason} (${token.files.join(', ')})`,
  ]);
}
const tokenReference = `# LDS token reference

| Field | Value |
| --- | --- |
| Type | Generated reference |
| Status | Generated |
| Owner | Foundation owner |
| Source | \`../../tokens/source.json\` |

이 문서는 \`tokens/source.json\`에서 생성됩니다. 직접 수정하지 않습니다.

${table(['Path', 'Type', 'CSS', 'Value / modes', 'Note'], tokenRows)}
`;
await emit('TOKEN_REFERENCE.md', tokenReference);

console.log(`${check ? 'Validated' : 'Generated'} ${content.foundations.length} foundation guides, LLM bundle, and ${tokenRows.length} token reference rows.`);
