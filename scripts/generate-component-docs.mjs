import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const docsRoot = path.join(root, 'docs', 'components');
const guidesRoot = path.join(docsRoot, 'guides');
const runtimeRoot = path.join(docsRoot, 'runtime');
const compiledPath = path.join(docsRoot, 'component-content.json');
const check = process.argv.includes('--check');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function compactText(value) {
  return String(value ?? '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentence(value) {
  const normalized = compactText(value);
  if (!normalized) return '';
  // An ellipsis already terminates the text; appending a period produced the "….' artifact.
  return /[.!?。…다요함됨]$/.test(normalized) ? normalized : `${normalized}.`;
}

function truncate(value, limit = 320) {
  const normalized = compactText(value);
  if (normalized.length <= limit) return normalized;

  const window = normalized.slice(0, limit);
  // Prefer the last complete sentence: a guide that stops mid-thought reads as broken output,
  // and a hard character cut lands mid-word far more often than not.
  const boundaries = [...window.matchAll(/[.!?。](?=\s)/g)];
  const lastBoundary = boundaries.at(-1);
  if (lastBoundary && lastBoundary.index >= limit * 0.4) {
    return window.slice(0, lastBoundary.index + 1);
  }
  // No sentence break worth keeping — fall back to a word boundary and mark the cut once.
  // A single unbroken token would swallow the whole window, so keep the hard cut in that case.
  const onWord = window.replace(/\s+\S*$/, '').trimEnd();
  return `${onWord.length >= limit * 0.6 ? onWord : window.slice(0, limit - 1).trimEnd()}…`;
}

function slugify(value) {
  return value
    .replace(/^LDS\s+/, '')
    .replaceAll('&', ' and ')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function markdownTable(headers, rows) {
  const escape = (cell) => String(cell ?? '—').replaceAll('|', '\\|').replaceAll('\n', '<br>');
  const render = (row) => `| ${row.map(escape).join(' | ')} |`;
  return [
    render(headers),
    render(headers.map(() => '---')),
    ...rows.map(render),
  ].join('\n');
}

function markdownBullets(values) {
  return values.map((value) => `- ${value}`).join('\n');
}

function extractPrompt(prompt) {
  const codeExamples = [...prompt.matchAll(/```(?:jsx|tsx)?\s*([\s\S]*?)```/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);
  const withoutCode = prompt.replace(/```[\s\S]*?```/g, '\n');
  const blocks = withoutCode
    .split(/\n\s*\n/)
    .map(compactText)
    .filter((block) => block.length >= 12 && !block.startsWith('http'));
  const bullets = [];
  let current = '';
  for (const rawLine of withoutCode.split('\n')) {
    const line = rawLine.trim();
    const match = line.match(/^[-*]\s+(.+)/);
    if (match) {
      if (current) bullets.push(compactText(current));
      current = match[1];
    } else if (current && line && !line.startsWith('#')) {
      current += ` ${line}`;
    } else if (!line && current) {
      bullets.push(compactText(current));
      current = '';
    }
  }
  if (current) bullets.push(compactText(current));

  const headings = [...withoutCode.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => compactText(match[1]));
  const links = [...prompt.matchAll(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/g)]
    .map((match) => ({ label: compactText(match[1]), url: match[2] }));

  return {
    lead: blocks.find((block) => !/^(Contrast evidence|근거와 유지 차이|API|Props)/i.test(block)) || '',
    blocks,
    bullets: unique(bullets),
    headings,
    links: unique(links.map((link) => JSON.stringify(link))).map((link) => JSON.parse(link)),
    codeExamples,
  };
}

function propertyName(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return node.getText().replace(/^['"]|['"]$/g, '');
}

function literalText(node) {
  if (!node) return '';
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return `${literalText(node.left)}${literalText(node.right)}`;
  }
  if (ts.isParenthesizedExpression(node)) return literalText(node.expression);
  return '';
}

function storyGuideFromSource(source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  let result = {};
  const metadataKeys = new Set(['omitGuideFields', 'canonicalGuide', 'guideDeltaFields']);
  function visit(node) {
    if (ts.isPropertyAssignment(node) && propertyName(node.name) === 'storyGuide') {
      assert(
        ts.isObjectLiteralExpression(node.initializer),
        `${fileName}: storyGuide must be an object literal.`,
      );
      const next = {};
      const properties = [...node.initializer.properties];
      assert(
        !properties.some((property) => ts.isSpreadAssignment(property)),
        `${fileName}: storyGuide does not support spread properties.`,
      );

      const metadataPositions = [];
      const seenMetadata = new Set();
      for (const [index, property] of properties.entries()) {
        const computedName = ts.isComputedPropertyName(property.name)
          && ts.isStringLiteralLike(property.name.expression)
          ? property.name.expression.text
          : '';
        const key = computedName || propertyName(property.name);
        if (!metadataKeys.has(key)) continue;
        assert(
          !computedName,
          `${fileName}: storyGuide.${key} must use a direct property name.`,
        );
        assert(
          ts.isPropertyAssignment(property),
          `${fileName}: storyGuide.${key} must be a property assignment.`,
        );
        assert(
          !seenMetadata.has(key),
          `${fileName}: storyGuide contains duplicate reserved metadata "${key}".`,
        );
        assert(
          ts.isStringLiteralLike(property.initializer),
          `${fileName}: storyGuide.${key} must be a string literal.`,
        );
        seenMetadata.add(key);
        metadataPositions.push(index);
      }
      if (metadataPositions.length > 1) {
        const first = metadataPositions[0];
        const last = metadataPositions.at(-1);
        assert(
          last - first + 1 === metadataPositions.length,
          `${fileName}: reserved storyGuide metadata keys must be contiguous.`,
        );
      }

      for (const property of properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = propertyName(property.name);
        if (metadataKeys.has(key)) {
          next[key] = property.initializer.text;
          continue;
        }
        const value = literalText(property.initializer);
        if (
          !Object.prototype.hasOwnProperty.call(next, key)
          && (ts.isStringLiteralLike(property.initializer) || value)
        ) {
          next[key] = value;
        }
      }
      const hasMetadata = [...metadataKeys].some((key) =>
        Object.prototype.hasOwnProperty.call(next, key));
      const resultHasMetadata = [...metadataKeys].some((key) =>
        Object.prototype.hasOwnProperty.call(result, key));
      if (
        (hasMetadata && !resultHasMetadata)
        || (hasMetadata === resultHasMetadata && Object.keys(next).length > Object.keys(result).length)
      ) {
        result = next;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return result;
}

const guideFields = [
  'purpose',
  'useWhen',
  'avoidWhen',
  'anatomy',
  'properties',
  'states',
  'behavior',
  'quantitativeRules',
  'responsive',
  'contentGuidance',
  'accessibility',
  'exceptions',
  'related',
  'examples',
  'tokens',
  'apiLinks',
  'migration',
];

function normalizeGuideFields(value, label, { required = false } = {}) {
  if (value === undefined) return [];
  const fields = String(value).split(',').map((field) => field.trim()).filter(Boolean);
  assert(!required || fields.length, `${label} must not be empty.`);
  const seen = new Set();
  for (const field of fields) {
    assert(guideFields.includes(field), `${label} contains unknown guide field "${field}".`);
    assert(!seen.has(field), `${label} contains duplicate guide field "${field}".`);
    seen.add(field);
  }
  return fields;
}

function hasGuideEvidence(value) {
  return Array.isArray(value) ? value.length > 0 : String(value ?? '').trim().length > 0;
}

function emptyGuideValue(field) {
  return field === 'purpose' ? '' : [];
}

function jsDocForNode(node, sourceFile) {
  const full = node.getFullText(sourceFile);
  const comments = [...full.matchAll(/\/\*\*([\s\S]*?)\*\//g)];
  if (!comments.length) return '';
  return compactText(
    comments.at(-1)[1]
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, ''))
      .filter((line) => !line.trim().startsWith('@'))
      .join(' '),
  );
}

function propsFromTypeSource(source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const props = [];
  function addMembers(members, owner) {
    for (const member of members) {
      if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) continue;
      const name = propertyName(member.name);
      if (!name || name.startsWith('[')) continue;
      const type = member.type?.getText(sourceFile) || (ts.isMethodSignature(member) ? member.getText(sourceFile) : 'unknown');
      props.push({
        name,
        type: truncate(type, 180),
        required: !member.questionToken,
        description: jsDocForNode(member, sourceFile),
        owner,
      });
    }
  }
  function visit(node) {
    if (ts.isInterfaceDeclaration(node) && /Props$/.test(node.name.text)) addMembers(node.members, node.name.text);
    if (ts.isTypeAliasDeclaration(node) && /Props$/.test(node.name.text) && ts.isTypeLiteralNode(node.type)) {
      addMembers(node.type.members, node.name.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return unique(props.map((prop) => JSON.stringify(prop))).map((prop) => JSON.parse(prop));
}

function tokenValueMap(tokenSource) {
  const map = new Map();
  function walk(value) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const cssNames = Array.isArray(value.css) ? value.css : value.css ? [value.css] : [];
    const raw = '$value' in value
      ? value.$value
      : value.modes
        ? Object.entries(value.modes).map(([mode, modeValue]) => `${mode}: ${modeValue}`).join('; ')
        : '';
    for (const css of cssNames) {
      map.set(css, typeof raw === 'object' ? JSON.stringify(raw) : String(raw));
    }
    Object.values(value).forEach(walk);
  }
  walk(tokenSource);
  for (const token of tokenSource.runtimeCoverage?.tokens || []) {
    map.set(token.css, token.values.join(' · '));
  }
  return map;
}

function componentEntries(entrySource, classification) {
  const exportToClassification = new Map();
  for (const group of classification.groups || []) {
    for (const name of group.exports || []) exportToClassification.set(name, group);
  }
  const entries = [];
  for (const match of entrySource.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+'(\.\.\/components\/([^']+?)\.jsx)';$/gm)) {
    const exports = match[1].split(',').map((item) => item.trim().split(/\s+as\s+/).at(-1));
    const publicExports = exports.filter((name) => !/^[A-Z0-9_]+$/.test(name));
    const title = publicExports[0] || exports[0];
    const source = `components/${match[3]}.jsx`;
    const group = publicExports.map((name) => exportToClassification.get(name)).find(Boolean)
      || exports.map((name) => exportToClassification.get(name)).find(Boolean)
      || {};
    entries.push({
      id: slugify(title),
      title,
      exports,
      source,
      typeContract: source.replace(/\.jsx$/, '.d.ts'),
      prompt: source.replace(/\.jsx$/, '.prompt.md'),
      group: group.name || 'Unclassified public export',
      ownerLayer: group.ownerLayer || 'core',
      provenance: group.provenance || 'wds-adjacent',
      wdsFamily: group.wdsFamily || null,
      storyEvidence: group.storyEvidence || [],
    });
  }
  return entries;
}

const useKeywords = /(사용|적합|위해|제공|표현|구성|보여|지원|use|for |provides?|represents?)/i;
const avoidKeywords = /(하지 않|금지|피하|대신|적합하지|없으면|cannot|must not|do not|instead|avoid|deprecated)/i;
const behaviorKeywords = /(onChange|controlled|uncontrolled|focus|keyboard|click|press|open|close|select|submit|escape|tab|enter|space|pointer|scroll|drag|동작|상태|제어|열|닫|선택|제출|초점|키보드)/i;
const responsiveKeywords = /(responsive|narrow|mobile|desktop|width|height|overflow|wrap|compact|dense|viewport|반응형|좁|모바일|데스크톱|너비|높이|넘침|줄바꿈)/i;
const contentKeywords = /(label|title|description|message|helper|placeholder|text|copy|name|라벨|제목|설명|메시지|문구|텍스트|이름)/i;
const a11yKeywords = /(\baria(?:-|=|\b)|accessib|screen reader|keyboard|focus|\btab\b|\benter\b|\bescape\b|\bspace\b|role=|wcag|접근성|스크린 리더|키보드|초점)/i;
const migrationKeywords = /(deprecated|compatib|legacy|migration|alias|no-op|폐기|호환|마이그레이션|별칭)/i;
const exceptionKeywords = /(except|unless|only when|필요한 경우|경우에만|예외|단,|다만)/i;
const numericKeywords = /(?:\b\d+(?:\.\d+)?\s*(?:px|rem|em|%|ms|s|개|줄|단계|배)?\b|최대|최소|이상|이하)/i;

/** Registers every shape a line can reach a reader in: raw, truncated, and sentence-terminated. */
function claim(claimed, value) {
  for (const base of [compactText(value), truncate(value)]) {
    if (!base) continue;
    claimed.add(base);
    claimed.add(sentence(base));
    claimed.add(base.replace(/\.$/, ''));
  }
}

/**
 * A prompt line says one thing, so exactly one section may print it. Every field used to filter
 * the same pool independently, which meant a line about `aria-label` matched the accessibility,
 * the use and the content regex and was printed by all three. `claimed` consumes a line at its
 * first — most specific — match, in every shape it could re-enter under.
 */
function matching(values, regex, claimed, limit = 4) {
  const picked = [];
  for (const value of values) {
    if (picked.length >= limit) break;
    if (restates(claimed, value) || !regex.test(value)) continue;
    const text = truncate(value);
    const fresh = !claimed.has(text);
    claim(claimed, value);
    if (fresh) picked.push(text);
  }
  return picked;
}

/**
 * A prompt block is the flattened form of the prose and list items around it, so it can carry a
 * sentence another section already claimed without matching it exactly. The length floor keeps a
 * short shared clause from disqualifying a line that is otherwise new.
 */
function restates(claimed, value) {
  if (claimed.has(value)) return true;
  for (const line of claimed) {
    if (line.length >= 40 && value.length > line.length && value.includes(line)) return true;
  }
  return false;
}

/** Normalize and bound only the statements found in owned prompt evidence. */
function evidenceLines(values, maximum = 4) {
  return unique(values.map(sentence)).filter((value) => value.length >= 12).slice(0, maximum);
}

function evidenceSentences(value) {
  return String(value ?? '')
    .split(/(?<=[.!?])\s+/)
    .map(compactText)
    .filter((line) => line.length >= 12);
}

function guidePurpose(storyGuide, prompt, canonical) {
  const candidates = [storyGuide.description, prompt.lead, storyGuide.title]
    .map(compactText)
    .filter((value) => value.length >= 35);
  if (!candidates.length) return '';
  if (!canonical) return sentence(candidates[0]);
  const localPurpose = evidenceSentences(storyGuide.description)
    .find((candidate) => !avoidKeywords.test(candidate));
  return localPurpose ? sentence(localPurpose) : '';
}

function guideFromPage(page, entriesByExport, sourceDetails, tokenMap) {
  const owners = page.ownerComponents
    .map((owner) => entriesByExport.get(owner))
    .filter(Boolean);
  const primary = entriesByExport.get(page.primaryOwner) || owners[0];
  const details = owners.map((entry) => sourceDetails.get(entry.source)).filter(Boolean);
  const primaryDetails = primary ? sourceDetails.get(primary.source) : details[0];
  const prompt = primaryDetails?.promptData || { lead: '', blocks: [], bullets: [], links: [], codeExamples: [] };
  const storyGuide = primaryDetails?.storyGuidesByImport?.get(page.importPath) || {};
  const omitGuideFields = normalizeGuideFields(storyGuide.omitGuideFields, 'omitGuideFields');
  const canonicalSlug = String(storyGuide.canonicalGuide ?? '').trim();
  const guideDeltaFields = normalizeGuideFields(
    storyGuide.guideDeltaFields,
    'guideDeltaFields',
    { required: storyGuide.guideDeltaFields !== undefined },
  );
  assert(!guideDeltaFields.length || canonicalSlug, 'guideDeltaFields requires a canonicalGuide.');
  assert(!canonicalSlug || guideDeltaFields.length, 'canonicalGuide requires non-empty guideDeltaFields.');
  assert(!canonicalSlug || !omitGuideFields.length, 'omitGuideFields cannot be used on a canonical delta guide.');
  const title = page.title.split('/').at(-1);
  const purpose = guidePurpose(storyGuide, prompt, Boolean(canonicalSlug));
  // A block that is a markdown list collapses to "- a - b - c", which is the bullet pass's output
  // run together. Those items are already in the pool one by one, so the flattened copy only ever
  // reprints them under a second heading.
  const allPromptLines = unique([
    ...(canonicalSlug ? evidenceSentences(storyGuide.title) : []),
    ...(canonicalSlug ? evidenceSentences(storyGuide.description) : []),
    ...prompt.bullets,
    ...prompt.blocks.filter((block) => !/^-\s/.test(block)),
  ]);
  // Extraction runs most-specific first so a line lands in the section that actually describes it:
  // one naming `aria-*` is an accessibility rule, not a "when to use" rule. `useKeywords` is by far
  // the widest net, so it fishes last, from what the specific sections left behind.
  const claimed = new Set();
  claim(claimed, purpose);
  const numericLines = matching(allPromptLines, numericKeywords, claimed, 4);
  const a11yLines = matching(allPromptLines, a11yKeywords, claimed, 6);
  const responsiveLines = matching(allPromptLines, responsiveKeywords, claimed, 5);
  const contentLines = matching(allPromptLines, contentKeywords, claimed, 5);
  const exceptionLines = matching(allPromptLines, exceptionKeywords, claimed, 4);
  const migrationLines = matching(allPromptLines, migrationKeywords, claimed, 5);
  // Avoid-guidance outranks behaviour: "do not put routing inside this" is a decision the reader
  // has to make, while a behaviour note describes what the component already does. Behind
  // behaviorKeywords this left 44 of 53 guides with nothing but template avoid text.
  const negative = matching(allPromptLines, avoidKeywords, claimed, 5);
  const behaviorLines = matching(allPromptLines, behaviorKeywords, claimed, 6);
  // Avoid lines are withheld from the pool rather than filtered out of the result: claiming one
  // here and then dropping it would consume the line without printing it anywhere.
  const positive = matching(allPromptLines.filter((line) => !avoidKeywords.test(line)), useKeywords, claimed, 5);
  // The purpose is not initialized here: the page prints it as its description, so repeating it as the
  // first bullet said the same sentence twice on every one of the 53 guides.
  const useWhen = evidenceLines(positive, 4);
  const avoidWhen = evidenceLines(negative, 4);

  const properties = unique(details.flatMap((detail) => detail.props).map((prop) => JSON.stringify(prop)))
    .map((prop) => JSON.parse(prop));
  // Several owners on one page can expose the same slot; the anatomy table names a part once.
  const anatomyProps = [...new Map(properties.filter(({ name, type, description }) =>
    description.length >= 8
    && /(children|content|label|title|description|header|footer|icon|prefix|suffix|start|end|action|toolbar|legend|trigger|control|input|helper|error|caption|avatar|media|body|aside|navigation|slot)/i.test(`${name} ${type}`),
  ).map((prop) => [prop.name, prop])).values()];
  const anatomy = anatomyProps.slice(0, 7).map((prop) => ({
    part: prop.name,
    rule: prop.description,
  }));

  const stateProps = properties.filter(({ name, type, description }) =>
    description.length >= 8
    && /(disabled|loading|open|selected|checked|active|invalid|error|empty|stale|status|state|tone|variant|expanded|pressed|readOnly|busy|paused|visible|hidden)/i.test(`${name} ${type}`),
  );
  /*
   * Props only. Story names used to be padded in here with one boilerplate sentence each, which
   * printed that sentence five times on Button alone and told the reader that "변형·상태 · 강조 단계"
   * is a state. The stories are listed above this guide with their own descriptions already.
   */
  const states = unique(stateProps.map((prop) => JSON.stringify({
    state: prop.name,
    rule: prop.description,
  }))).map((row) => JSON.parse(row)).slice(0, 12);
  const tokens = unique(details.flatMap((detail) => detail.tokens)).sort();
  const tokenRules = tokens
    .map((token) => [token, tokenMap.get(token)])
    .filter(([, value]) => value && /(?:\d|calc|clamp)/.test(value))
    .slice(0, 4)
    .map(([token, value]) => ({ subject: token, rule: value }));
  const promptRules = numericLines
    .map((rule, index) => ({ subject: `명시 규칙 ${index + 1}`, rule }));
  const quantitativeRules = [...promptRules, ...tokenRules].slice(0, 5);
  const behavior = evidenceLines(behaviorLines, 5);
  const responsive = evidenceLines(responsiveLines, 4);
  const contentGuidance = evidenceLines(contentLines, 4);
  const accessibility = evidenceLines(a11yLines, 5);
  const exceptions = evidenceLines(exceptionLines, 3);
  const migration = evidenceLines(migrationLines, 4);

  const relatedNames = unique([
    ...page.ownerComponents,
    ...page.supportingComponents,
    ...(primary?.classificationSiblings || []),
  ]).filter((name) => name !== page.primaryOwner).slice(0, 8);
  const related = relatedNames.map((component) => ({
    component,
    relationship: page.ownerComponents.includes(component) ? '같은 페이지가 소유' : '대표 시나리오에서 조합',
  }));

  const examples = (primaryDetails?.promptData.codeExamples || []).slice(0, 2).map((code, index) => ({
    label: index === 0 ? '기본 조합' : `추가 조합 ${index + 1}`,
    code,
  }));
  const sources = unique([
    JSON.stringify({ label: `${page.primaryOwner} prompt contract`, path: primary?.prompt || page.importPath }),
    JSON.stringify({ label: 'Storybook implementation evidence', path: page.importPath.replace(/^\.\//, '') }),
    ...prompt.links.map((link) => JSON.stringify(link)),
  ]).map((source) => JSON.parse(source)).slice(0, 10);

  const storybookEntry = page.stories.find((story) => story.role === 'overview') || page.stories[0];
  const guide = {
    slug: slugify(page.title.replace(/^LDS\s+/, '')),
    title,
    storybookTitle: page.title,
    layer: page.layer,
    family: page.family,
    primaryOwner: page.primaryOwner,
    ownerComponents: page.ownerComponents,
    supportingComponents: page.supportingComponents,
    purpose,
    useWhen,
    avoidWhen,
    anatomy,
    properties: properties.slice(0, 24),
    states,
    behavior,
    quantitativeRules,
    responsive,
    contentGuidance,
    accessibility,
    exceptions,
    related,
    examples,
    tokens,
    apiLinks: unique([
      ...owners.flatMap((entry) => [entry.source, entry.typeContract, entry.prompt]),
      page.importPath.replace(/^\.\//, ''),
    ]),
    migration,
    platformStatus: {
      figma: primary?.wdsFamily ? 'mapped' : 'not-tracked',
      react: 'implemented',
      ios: 'not-tracked',
      android: 'not-tracked',
    },
    storybook: {
      importPath: page.importPath,
      entryStoryId: storybookEntry?.id || null,
      publicStories: page.stories.filter((story) => story.visibility === 'public').map(({ id, name, role }) => ({ id, name, role })),
      hiddenEvidence: page.stories.filter((story) => story.visibility === 'hidden').length,
    },
    sources,
  };
  for (const field of omitGuideFields) guide[field] = emptyGuideValue(field);
  guide.canonicalGuide = canonicalSlug || null;
  guide.guideDeltaFields = guideDeltaFields;
  guide.sectionStatus = Object.fromEntries(guideFields.map((field) => [
    field,
    omitGuideFields.includes(field)
      ? 'omitted-by-author'
      : hasGuideEvidence(guide[field]) ? 'evidence' : 'omitted-no-evidence',
  ]));
  return guide;
}

function renderGuide(guide) {
  const sourceList = guide.sources.map((source) =>
    source.url ? `- [${source.label}](${source.url})` : `- ${source.label}: \`${source.path}\``,
  ).join('\n');
  const sections = [];
  const add = (heading, content) => {
    if (content) sections.push(`## ${heading}\n\n${content}`);
  };

  if (guide.canonicalGuide) {
    sections.push(
      `> Canonical guide: [reference](${guide.canonicalGuide.slug}.md). `
      + 'This page documents only its evidence-backed differences.',
    );
  }
  if (guide.useWhen.length || guide.avoidWhen.length) {
    const decisions = [];
    if (guide.useWhen.length) decisions.push(`### 사용\n\n${markdownBullets(guide.useWhen)}`);
    if (guide.avoidWhen.length) decisions.push(`### 사용하지 않음\n\n${markdownBullets(guide.avoidWhen)}`);
    add('사용 판단', decisions.join('\n\n'));
  }
  if (guide.anatomy.length) {
    add('Anatomy', markdownTable(['Part', 'Contract'], guide.anatomy.map((row) => [row.part, row.rule])));
  }
  if (guide.properties.length) {
    add('Properties', markdownTable(
      ['Name', 'Type', 'Required', 'Contract'],
      guide.properties.map((row) => [
        `\`${row.name}\``, `\`${row.type}\``, row.required ? 'Yes' : 'No', row.description,
      ]),
    ));
  }
  if (guide.states.length) {
    add('States', markdownTable(['State', 'Contract'], guide.states.map((row) => [row.state, row.rule])));
  }
  if (guide.behavior.length) add('Behavior and interaction', markdownBullets(guide.behavior));
  if (guide.quantitativeRules.length) {
    add('정량 규칙', markdownTable(
      ['Subject', 'Rule'],
      guide.quantitativeRules.map((row) => [row.subject, row.rule]),
    ));
  }
  if (guide.responsive.length) add('Responsive', markdownBullets(guide.responsive));
  if (guide.contentGuidance.length) add('Content and writing', markdownBullets(guide.contentGuidance));
  if (guide.accessibility.length) add('Accessibility', markdownBullets(guide.accessibility));
  if (guide.exceptions.length) add('Exceptions', markdownBullets(guide.exceptions));
  if (guide.related.length) {
    add('Related components', markdownTable(
      ['Component', 'Relationship'],
      guide.related.map((row) => [`\`${row.component}\``, row.relationship]),
    ));
  }
  if (guide.examples.length) {
    add('Examples', guide.examples
      .map((example) => `### ${example.label}\n\n\`\`\`jsx\n${example.code}\n\`\`\``)
      .join('\n\n'));
  }
  if (guide.tokens.length || guide.apiLinks.length) {
    const references = [];
    if (guide.tokens.length) {
      references.push(`### Tokens\n\n${markdownBullets(guide.tokens.map((token) => `\`${token}\``))}`);
    }
    if (guide.apiLinks.length) {
      references.push(`### Source contracts\n\n${markdownBullets(guide.apiLinks.map((api) => `\`${api}\``))}`);
    }
    add('Tokens and API', references.join('\n\n'));
  }
  if (guide.migration.length) add('Migration', markdownBullets(guide.migration));

  return `# ${guide.title}

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | ${guide.layer} / ${guide.family} |
| Owner | \`${guide.primaryOwner}\` |
| Storybook | \`${guide.storybookTitle}\` |
| Source | \`../component-content.json#${guide.slug}\` |

${guide.purpose ? `${guide.purpose}\n\n` : ''}${sections.join('\n\n')}

## Sources

${sourceList}
`;
}

function finalizeCanonicalGuides(guides) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const deltas = guides.filter((guide) => typeof guide.canonicalGuide === 'string');

  for (const guide of deltas) {
    const target = bySlug.get(guide.canonicalGuide);
    assert(target, `${guide.slug}: unknown canonical guide "${guide.canonicalGuide}".`);
    assert(target !== guide, `${guide.slug}: a guide cannot reference itself as canonical.`);
    assert(
      target.primaryOwner === guide.primaryOwner,
      `${guide.slug}: canonical ownership mismatch between ${guide.primaryOwner} and ${target.primaryOwner}.`,
    );
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(guide) {
    if (visited.has(guide.slug) || typeof guide.canonicalGuide !== 'string') return;
    assert(!visiting.has(guide.slug), `Canonical guide cycle detected at ${guide.slug}.`);
    visiting.add(guide.slug);
    visit(bySlug.get(guide.canonicalGuide));
    visiting.delete(guide.slug);
    visited.add(guide.slug);
  }
  for (const guide of deltas) visit(guide);

  for (const guide of deltas) {
    const target = bySlug.get(guide.canonicalGuide);
    assert(typeof target.canonicalGuide !== 'string', `${guide.slug}: canonical target cannot be a delta guide.`);
    assert(
      typeof target.storybook.entryStoryId === 'string' && target.storybook.entryStoryId.includes('--'),
      `${guide.slug}: canonical target must expose a Storybook entry story ID.`,
    );
    for (const field of guide.guideDeltaFields) {
      assert(
        guide.sectionStatus[field] === 'evidence',
        `${guide.slug}: declared delta field "${field}" requires source evidence.`,
      );
    }
    for (const field of guideFields) {
      if (guide.guideDeltaFields.includes(field)) continue;
      guide[field] = emptyGuideValue(field);
      guide.sectionStatus[field] = 'canonical-reference';
    }
    guide.canonicalGuide = {
      slug: target.slug,
      title: target.title,
      storybookDocsId: `${target.storybook.entryStoryId.split('--')[0]}--docs`,
    };
  }
}

async function emit(relativePath, content) {
  const absolute = path.join(docsRoot, relativePath);
  if (check) {
    const current = await readFile(absolute, 'utf8').catch(() => '');
    assert(current === content, `Generated component artifact is stale: docs/components/${relativePath}`);
    return;
  }
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, content);
}

const [entrySource, classification, audit, tokenSource] = await Promise.all([
  read('src/index.js'),
  readJson('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'),
  readJson('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json'),
  readJson('tokens/source.json'),
]);
const entries = componentEntries(entrySource, classification);
assert(entries.length === 202, `Expected 202 public component entries, received ${entries.length}.`);

const allExports = new Set(entries.flatMap((entry) => entry.exports));
const sourceDetails = new Map();
const storySourceCache = new Map();
for (const entry of entries) {
  const [jsx, typeSource, promptSource] = await Promise.all([
    read(entry.source),
    read(entry.typeContract),
    read(entry.prompt),
  ]);
  const storyGuidesByImport = new Map();
  const ownedAuditStories = audit.pages
    .filter((page) =>
      entry.exports.includes(page.primaryOwner)
      || page.ownerComponents?.some((owner) => entry.exports.includes(owner)))
    .map((page) => page.importPath.replace(/^\.\//, ''));
  for (const storyPath of unique([...entry.storyEvidence, ...ownedAuditStories])) {
    const importPath = `./${storyPath}`;
    let storySource = storySourceCache.get(storyPath);
    if (!storySource) {
      storySource = await read(storyPath);
      storySourceCache.set(storyPath, storySource);
    }
    storyGuidesByImport.set(importPath, storyGuideFromSource(storySource, storyPath));
  }
  sourceDetails.set(entry.source, {
    jsx,
    props: propsFromTypeSource(typeSource, entry.typeContract),
    promptData: extractPrompt(promptSource),
    tokens: unique([...jsx.matchAll(/var\((--[A-Za-z0-9_-]+)/g)].map((match) => match[1])),
    storyGuidesByImport,
  });
}

const exportToEntry = new Map();
for (const entry of entries) for (const name of entry.exports) exportToEntry.set(name, entry);
for (const entry of entries) {
  const group = classification.groups.find((candidate) => candidate.name === entry.group);
  entry.classificationSiblings = (group?.exports || []).filter((name) => allExports.has(name) && !entry.exports.includes(name));
  entry.storybookPages = audit.pages
    .filter((page) =>
      page.layer !== 'Foundation'
      && (
        page.ownerComponents.some((owner) => entry.exports.includes(owner))
        || entry.storyEvidence.includes(page.importPath.replace(/^\.\//, ''))
      ),
    )
    .map((page) => page.title);
  const details = sourceDetails.get(entry.source);
  entry.props = details.props;
  entry.tokens = details.tokens;
  entry.externalReferences = details.promptData.links;
  entry.promptSha256 = createHash('sha256').update(await read(entry.prompt)).digest('hex');
}

const nonComponentDecisionPages = new Set([
  'LDS Core/Patterns/Loading',
]);
// "Other" is the IA audit's own layer for a cross-family meta page — the
// directory. It names a primary owner because it renders with real components,
// so it used to produce a component guide that was that owner's guide with a
// different title: both landed over the 60% duplicated-prose ceiling, each
// citing the other. A meta page is not a component page and documents nothing
// the owner's own guide does not.
const nonFoundationPages = audit.pages.filter(
  (page) => page.layer !== 'Foundation'
    && page.layer !== 'Other'
    && !nonComponentDecisionPages.has(page.title),
);
const tokenMap = tokenValueMap(tokenSource);
const guides = nonFoundationPages.map((page) => guideFromPage(page, exportToEntry, sourceDetails, tokenMap));
assert(guides.length === 172, `Expected 172 non-Foundation component pages, received ${guides.length}.`);
finalizeCanonicalGuides(guides);

const coveredExports = new Set(guides.flatMap((guide) => guide.ownerComponents));
const entriesWithoutOwnedPage = entries.filter((entry) => !entry.exports.some((name) => coveredExports.has(name)));
const sourceFingerprint = createHash('sha256')
  .update(JSON.stringify({
    entrySource,
    classification,
    auditHash: audit.meta?.storybookIndexSha256,
    promptHashes: entries.map(({ source, promptSha256 }) => [source, promptSha256]),
  }))
  .digest('hex');

const compiled = {
  schemaVersion: 1,
  sourceFingerprint,
  completionCriteria: [
    'purpose-and-selection',
    'anatomy',
    'properties',
    'states',
    'behavior',
    'quantitative-rules',
    'responsive',
    'content-writing',
    'accessibility',
    'exceptions',
    'related-components',
    'examples',
    'tokens-api',
    'migration',
    'machine-readable-reference',
  ],
  platformStatusDefinitions: {
    mapped: 'Accepted design-source family mapping exists.',
    implemented: 'A public React implementation, type contract, prompt contract, and Storybook evidence exist.',
    'not-tracked': 'This repository does not own or assert that platform implementation status.',
  },
  summary: {
    componentEntries: entries.length,
    publicExports: new Set(entries.flatMap((entry) => entry.exports)).size,
    guides: guides.length,
    entriesWithoutOwnedPage: entriesWithoutOwnedPage.map((entry) => entry.title),
  },
  entries,
  guides,
};

/*
 * The compiled registry and Markdown guides are internal evidence: they retain benchmark
 * provenance so maintainers can audit how a decision was reached. Storybook imports only the
 * runtime projection below. That public projection carries the resulting LDS contract, not the
 * names, links, file paths, or comparison prose of the private research sources.
 */
const privateProvenancePattern =
  /(?:Wanted Design System|원티드|\bWDS\b|docs[\\/]+references[\\/]+|\.fig\b)/i;

function publicRuntimeText(value) {
  const text = String(value ?? '');
  return privateProvenancePattern.test(text) ? '' : text;
}

function publicRuntimeLines(values) {
  return values.map(publicRuntimeText).filter(Boolean);
}

function publicRuntimeRows(rows, ruleKey) {
  return rows
    .map((row) => ({ ...row, [ruleKey]: publicRuntimeText(row[ruleKey]) }))
    .filter((row) => row[ruleKey]);
}

function publicRuntimeGuide(guide) {
  return {
    ...guide,
    purpose: publicRuntimeText(guide.purpose),
    useWhen: publicRuntimeLines(guide.useWhen),
    avoidWhen: publicRuntimeLines(guide.avoidWhen),
    anatomy: publicRuntimeRows(guide.anatomy, 'rule'),
    properties: guide.properties.map((property) => ({
      ...property,
      description: publicRuntimeText(property.description),
    })),
    states: publicRuntimeRows(guide.states, 'rule'),
    behavior: publicRuntimeLines(guide.behavior),
    quantitativeRules: publicRuntimeRows(guide.quantitativeRules, 'rule'),
    responsive: publicRuntimeLines(guide.responsive),
    contentGuidance: publicRuntimeLines(guide.contentGuidance),
    accessibility: publicRuntimeLines(guide.accessibility),
    exceptions: publicRuntimeLines(guide.exceptions),
    examples: guide.examples
      .map((example) => ({ ...example, code: publicRuntimeText(example.code) }))
      .filter((example) => example.code),
    apiLinks: [],
    migration: publicRuntimeLines(guide.migration),
    sources: [],
  };
}

const runtimeGuides = guides.map(publicRuntimeGuide);
const runtimeSummary = compiled.summary;
const compiledJson = `${JSON.stringify(compiled, null, 2)}\n`;
const runtimeJson = `${JSON.stringify({ summary: runtimeSummary, guides: runtimeGuides }, null, 2)}\n`;
const guideIndexJson = `${JSON.stringify(guides.map(({ storybookTitle, slug }) => ({ storybookTitle, slug })), null, 2)}\n`;
if (check) {
  const current = await readFile(compiledPath, 'utf8').catch(() => '');
  assert(current === compiledJson, 'Generated component registry is stale: docs/components/component-content.json');
} else {
  await mkdir(guidesRoot, { recursive: true });
  await writeFile(compiledPath, compiledJson);
  await rm(guidesRoot, { recursive: true, force: true });
  await mkdir(guidesRoot, { recursive: true });
  await rm(runtimeRoot, { recursive: true, force: true });
  await mkdir(runtimeRoot, { recursive: true });
}

const referenceRows = entries.map((entry) => [
  `\`${entry.title}\``,
  entry.exports.map((name) => `\`${name}\``).join(', '),
  entry.ownerLayer,
  entry.provenance,
  entry.storybookPages.length ? entry.storybookPages.map((title) => `\`${title}\``).join('<br>') : 'Reference only',
  `[\`${entry.source}\`](../../${entry.source})`,
  `[\`${entry.prompt}\`](../../${entry.prompt})`,
]);
const reference = `# LDS component reference

| Field | Value |
| --- | --- |
| Type | Generated public component reference |
| Status | Generated |
| Source | \`src/index.js\`, public classification, type and prompt contracts |

${markdownTable(['Entry', 'Exports', 'Layer', 'Provenance', 'Storybook pages', 'Source', 'Prompt'], referenceRows)}
`;

const progressRows = guides.map((guide) => [
  `[${guide.title}](guides/${guide.slug}.md)`,
  `${guide.layer} / ${guide.family}`,
  guide.ownerComponents.map((name) => `\`${name}\``).join(', '),
  guide.platformStatus.figma,
  guide.platformStatus.react,
  guide.platformStatus.ios,
  guide.platformStatus.android,
  `${guide.storybook.publicStories.length} public / ${guide.storybook.hiddenEvidence} hidden`,
]);
const progress = `# LDS component progress board

| Field | Value |
| --- | --- |
| Type | Generated component documentation status |
| Status | Current |
| Scope | Platform claims are limited to evidence owned by this repository |

${markdownTable(['Guide', 'Layer', 'Owners', 'Figma', 'React', 'iOS', 'Android', 'Storybook'], progressRows)}
`;

const index = `# LK Design System Components

| Field | Value |
| --- | --- |
| Type | Component decision-guide index |
| Status | Current |
| Owner | Component owners · Design system owner |
| Compiled registry | \`component-content.json\` |

LDS 컴포넌트 문서는 구현 예시 모음이 아니라 선택·상태·상호작용·접근성·정량 규칙을 함께 제공하는 결정 계약입니다. 컴포넌트별 \`.prompt.md\`, \`.d.ts\`, 구현 source, Storybook audit와 token source를 하나의 검증 가능한 registry로 컴파일합니다.

## Coverage

- Public component entries: **${entries.length}**
- Named exports: **${compiled.summary.publicExports}**
- Component and Theme/Product decision guides: **${guides.length}**
- Entries without an owned Storybook page: **${entriesWithoutOwnedPage.length}** — reference registry에서 source·type·prompt 계약을 계속 추적합니다.

## Completion contract

${compiled.completionCriteria.map((criterion, index) => `${index + 1}. \`${criterion}\``).join('\n')}

## Generated surfaces

- [Component reference](COMPONENT_REFERENCE.md)
- [Progress board](PROGRESS_BOARD.md)
- [LLM bundle](llms.txt)
- [JSON Schema](component-content.schema.json)
- [Compiled registry](component-content.json)
- [Decision guides](guides/)

## Authoring workflow

1. 컴포넌트의 \`.prompt.md\`에 사용 판단, 제약, 접근성, 근거와 예제를 기록합니다.
2. \`.d.ts\`, 구현 source와 Storybook에서 API·token·상태 증거를 유지합니다.
3. \`npm run generate:components\`로 registry와 문서를 갱신합니다.
4. \`npm run check:components\`로 전체 export와 guide 계약을 검증합니다.
`;

await emit('README.md', index);
await emit('COMPONENT_REFERENCE.md', reference);
await emit('PROGRESS_BOARD.md', progress);
await emit('component-guide-runtime.json', runtimeJson);
await emit('component-guide-index.json', guideIndexJson);
for (const guide of guides) await emit(`guides/${guide.slug}.md`, renderGuide(guide));
for (const guide of runtimeGuides) await emit(`runtime/${guide.slug}.json`, `${JSON.stringify(guide, null, 2)}\n`);
const llms = [
  '# LK Design System Components',
  '',
  'Compiled source: docs/components/component-content.json',
  '',
  ...guides.flatMap((guide) => [renderGuide(guide), '\n---\n']),
].join('\n');
await emit('llms.txt', llms);

console.log(
  `${check ? 'Validated' : 'Generated'} ${entries.length} component entries, ${guides.length} decision guides, `
  + `${compiled.summary.publicExports} named exports, ${entriesWithoutOwnedPage.length} reference-only entries.`,
);
