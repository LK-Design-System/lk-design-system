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
  return /[.!?。다요함됨]$/.test(normalized) ? normalized : `${normalized}.`;
}

function truncate(value, limit = 320) {
  const normalized = compactText(value);
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1).trimEnd()}…`;
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
  function visit(node) {
    if (ts.isPropertyAssignment(node) && propertyName(node.name) === 'storyGuide' && ts.isObjectLiteralExpression(node.initializer)) {
      const next = {};
      for (const property of node.initializer.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = propertyName(property.name);
        const value = literalText(property.initializer);
        if (value) next[key] = value;
      }
      if (Object.keys(next).length > Object.keys(result).length) result = next;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return result;
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
        description: jsDocForNode(member, sourceFile) || '공개 타입 계약에 정의된 속성입니다.',
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

const seedUrls = {
  Accordion: 'https://seed-design.io/components/accordion',
  Button: 'https://seed-design.io/components/action-button',
  ConfirmDialog: 'https://seed-design.io/components/alert-dialog',
  FileUpload: 'https://seed-design.io/components/attachment-input',
  Avatar: 'https://seed-design.io/components/avatar',
  Badge: 'https://seed-design.io/components/badge',
  BottomNav: 'https://seed-design.io/components/bottom-navigation',
  Sheet: 'https://seed-design.io/components/bottom-sheet',
  Callout: 'https://seed-design.io/components/callout',
  Checkbox: 'https://seed-design.io/components/checkbox',
  Chip: 'https://seed-design.io/components/chip',
  Divider: 'https://seed-design.io/components/divider',
  FormField: 'https://seed-design.io/components/field',
  Fab: 'https://seed-design.io/components/floating-action-button',
  Footer: 'https://seed-design.io/components/footer',
  ListCell: 'https://seed-design.io/components/list',
  DropdownMenu: 'https://seed-design.io/components/menu',
  PushBadge: 'https://seed-design.io/components/notification-badge',
  Banner: 'https://seed-design.io/components/page-banner',
  CircularProgress: 'https://seed-design.io/components/progress-circle',
  Radio: 'https://seed-design.io/components/radio',
  SegmentedControl: 'https://seed-design.io/components/segmented-control',
  Select: 'https://seed-design.io/components/select-box',
  SideNav: 'https://seed-design.io/components/side-navigation',
  Drawer: 'https://seed-design.io/components/side-panel',
  Skeleton: 'https://seed-design.io/components/skeleton',
  Slider: 'https://seed-design.io/components/slider',
  Snackbar: 'https://seed-design.io/components/snackbar',
  Switch: 'https://seed-design.io/components/switch',
  Tabs: 'https://seed-design.io/components/tabs',
  Tag: 'https://seed-design.io/components/tag-group',
  Input: 'https://seed-design.io/components/text-input',
  Textarea: 'https://seed-design.io/components/text-input',
  TopBar: 'https://seed-design.io/components/top-navigation',
};

const useKeywords = /(사용|적합|위해|제공|표현|구성|보여|지원|use|for |provides?|represents?)/i;
const avoidKeywords = /(하지 않|금지|피하|대신|적합하지|없으면|cannot|must not|do not|instead|avoid|deprecated)/i;
const behaviorKeywords = /(onChange|controlled|uncontrolled|focus|keyboard|click|press|open|close|select|submit|escape|tab|enter|space|pointer|scroll|drag|동작|상태|제어|열|닫|선택|제출|초점|키보드)/i;
const responsiveKeywords = /(responsive|narrow|mobile|desktop|width|height|overflow|wrap|compact|dense|viewport|반응형|좁|모바일|데스크톱|너비|높이|넘침|줄바꿈)/i;
const contentKeywords = /(label|title|description|message|helper|placeholder|text|copy|name|라벨|제목|설명|메시지|문구|텍스트|이름)/i;
const a11yKeywords = /(\baria(?:-|=|\b)|accessib|screen reader|keyboard|focus|\btab\b|\benter\b|\bescape\b|\bspace\b|role=|wcag|접근성|스크린 리더|키보드|초점)/i;
const migrationKeywords = /(deprecated|compatib|legacy|migration|alias|no-op|폐기|호환|마이그레이션|별칭)/i;
const exceptionKeywords = /(except|unless|only when|필요한 경우|경우에만|예외|단,|다만)/i;
const numericKeywords = /(?:\b\d+(?:\.\d+)?\s*(?:px|rem|em|%|ms|s|개|줄|단계|배)?\b|최대|최소|이상|이하)/i;

function matching(values, regex, limit = 4) {
  return unique(values.filter((value) => regex.test(value)).map((value) => truncate(value))).slice(0, limit);
}

function fill(values, fallbacks, minimum = 2, maximum = 4) {
  const result = unique([...values, ...fallbacks].map(sentence)).filter((value) => value.length >= 12);
  return result.slice(0, Math.max(minimum, maximum));
}

function localizePropName(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function guidePurpose(page, storyGuide, prompt, title) {
  const candidates = [storyGuide.description, prompt.lead, storyGuide.title]
    .map(compactText)
    .filter((value) => value.length >= 35);
  if (candidates.length) return sentence(candidates[0]);
  return `${title}는 ${page.family} 영역에서 반복되는 인터페이스 결정을 일관된 API와 접근성 계약으로 제공합니다.`;
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
  const title = page.title.split('/').at(-1);
  const purpose = guidePurpose(page, storyGuide, prompt, title);
  const allPromptLines = unique([...prompt.bullets, ...prompt.blocks]);
  const positive = matching(allPromptLines, useKeywords, 5).filter((value) => !avoidKeywords.test(value));
  const negative = matching(allPromptLines, avoidKeywords, 5);
  const useWhen = fill(
    [purpose, ...positive],
    [
      `${title}가 소유하는 ${page.family} 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.`,
      `제품별 구현 대신 공개 ${page.primaryOwner} API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.`,
    ],
    3,
    4,
  );
  const avoidWhen = fill(
    negative,
    [
      `${title}가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.`,
      `동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.`,
      `표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.`,
    ],
    3,
    4,
  );

  const properties = unique(details.flatMap((detail) => detail.props).map((prop) => JSON.stringify(prop)))
    .map((prop) => JSON.parse(prop));
  const anatomyProps = properties.filter(({ name, type }) =>
    /(children|content|label|title|description|header|footer|icon|prefix|suffix|start|end|action|toolbar|legend|trigger|control|input|helper|error|caption|avatar|media|body|aside|navigation|slot)/i.test(`${name} ${type}`),
  );
  const anatomy = [
    {
      part: 'Root',
      rule: `${page.primaryOwner}의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다.`,
    },
    ...anatomyProps.slice(0, 7).map((prop) => ({
      part: localizePropName(prop.name),
      rule: prop.description === '공개 타입 계약에 정의된 속성입니다.' || prop.description.length < 8
        ? `${prop.name} 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다.`
        : prop.description,
    })),
  ];

  const stateProps = properties.filter(({ name, type }) =>
    /(disabled|loading|open|selected|checked|active|invalid|error|empty|stale|status|state|tone|variant|expanded|pressed|readOnly|busy|paused|visible|hidden)/i.test(`${name} ${type}`),
  );
  const stateStories = page.stories.filter((story) => ['variants-states', 'interaction', 'responsive'].includes(story.role));
  const states = unique([
    ...stateProps.map((prop) => JSON.stringify({
      state: prop.name,
      rule: `${prop.description} 타입 계약: ${prop.type}`,
    })),
    ...stateStories.map((story) => JSON.stringify({
      state: story.name,
      rule: `${story.role} 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다.`,
    })),
  ]).map((row) => JSON.parse(row)).slice(0, 12);
  if (!states.length) {
    states.push({
      state: 'Default',
      rule: '별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다.',
    });
  }

  const tokens = unique(details.flatMap((detail) => detail.tokens)).sort();
  const tokenRules = tokens
    .map((token) => [token, tokenMap.get(token)])
    .filter(([, value]) => value && /(?:\d|calc|clamp)/.test(value))
    .slice(0, 4)
    .map(([token, value]) => ({ subject: token, rule: value }));
  const promptRules = matching(allPromptLines, numericKeywords, 4)
    .map((rule, index) => ({ subject: `명시 규칙 ${index + 1}`, rule }));
  const quantitativeRules = [...promptRules, ...tokenRules].slice(0, 5);
  if (!quantitativeRules.length) {
    quantitativeRules.push({
      subject: '제품 임계값',
      rule: '0개 내장. source/API에 없는 수치 정책은 제품 계층이 소유하고 컴포넌트에는 추가하지 않습니다.',
    });
  }

  const behavior = fill(
    matching(allPromptLines, behaviorKeywords, 6),
    [
      `${page.primaryOwner}의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.`,
      `상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.`,
      `제품 데이터와 side effect는 callback으로 위임하고 ${page.primaryOwner}는 표시·입력 상태만 소유합니다.`,
    ],
    3,
    5,
  );
  const responsive = fill(
    matching(allPromptLines, responsiveKeywords, 5),
    [
      `320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.`,
      `고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.`,
    ],
    2,
    4,
  );
  const contentGuidance = fill(
    matching(allPromptLines, contentKeywords, 5),
    [
      `사용자에게 보이는 ${title} 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.`,
      `아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.`,
    ],
    2,
    4,
  );
  const accessibility = fill(
    matching(allPromptLines, a11yKeywords, 6),
    [
      `native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.`,
      `키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.`,
      `색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.`,
    ],
    3,
    5,
  );
  const exceptions = fill(
    matching(allPromptLines, exceptionKeywords, 4),
    [
      `제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ${page.primaryOwner}의 범용 API에 넣지 않습니다.`,
      `접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.`,
    ],
    2,
    3,
  );
  const migration = fill(
    matching(allPromptLines, migrationKeywords, 5),
    [
      `현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.`,
      `대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.`,
    ],
    2,
    4,
  );

  const relatedNames = unique([
    ...page.ownerComponents,
    ...page.supportingComponents,
    ...(primary?.classificationSiblings || []),
  ]).filter((name) => name !== page.primaryOwner).slice(0, 8);
  const related = relatedNames.length
    ? relatedNames.map((component) => ({
      component,
      relationship: page.ownerComponents.includes(component)
        ? '같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다.'
        : '대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다.',
    }))
    : [{
      component: page.primaryOwner,
      relationship: '독립적인 공개 컴포넌트이며 새로운 sibling을 만들기 전에 이 API 확장 가능성을 검토합니다.',
    }];

  const doDont = [
    ['Do', useWhen[1] || useWhen[0]],
    ["Don't", avoidWhen[0]],
    ['Do', useWhen[2] || useWhen[0]],
    ["Don't", avoidWhen[1]],
  ];
  const examples = (primaryDetails?.promptData.codeExamples || []).slice(0, 2).map((code, index) => ({
    label: index === 0 ? '기본 조합' : `추가 조합 ${index + 1}`,
    code,
  }));
  if (!examples.length) {
    examples.push({
      label: '공개 스토리',
      code: `// ${page.stories[0]?.id || page.importPath}\n// Storybook에서 실제 ${page.primaryOwner} 렌더링을 확인합니다.`,
    });
  }

  const sources = unique([
    JSON.stringify({ label: `${page.primaryOwner} prompt contract`, path: primary?.prompt || page.importPath }),
    JSON.stringify({ label: 'Storybook implementation evidence', path: page.importPath.replace(/^\.\//, '') }),
    ...prompt.links.map((link) => JSON.stringify(link)),
    ...(seedUrls[page.primaryOwner]
      ? [JSON.stringify({ label: `SEED ${title} benchmark`, url: seedUrls[page.primaryOwner] })]
      : []),
  ]).map((source) => JSON.parse(source)).slice(0, 10);

  const storybookEntry = page.stories.find((story) => story.role === 'overview') || page.stories[0];
  return {
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
    doDont,
    exceptions,
    related,
    examples,
    tokens: tokens.length ? tokens : ['No component-specific CSS custom property; Foundation semantic tokens apply.'],
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
}

function renderGuide(guide) {
  const sourceList = guide.sources.map((source) =>
    source.url ? `- [${source.label}](${source.url})` : `- ${source.label}: \`${source.path}\``,
  ).join('\n');
  const examples = guide.examples.map((example) => `### ${example.label}\n\n\`\`\`jsx\n${example.code}\n\`\`\``).join('\n\n');
  return `# ${guide.title}

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | ${guide.layer} / ${guide.family} |
| Owner | \`${guide.primaryOwner}\` |
| Storybook | \`${guide.storybookTitle}\` |
| Source | \`../component-content.json#${guide.slug}\` |

${guide.purpose}

## 사용 판단

### 사용

${markdownBullets(guide.useWhen)}

### 사용하지 않음

${markdownBullets(guide.avoidWhen)}

## Anatomy

${markdownTable(['Part', 'Contract'], guide.anatomy.map((row) => [row.part, row.rule]))}

## Properties

${markdownTable(['Name', 'Type', 'Required', 'Contract'], guide.properties.map((row) => [
    `\`${row.name}\``, `\`${row.type}\``, row.required ? 'Yes' : 'No', row.description,
  ]))}

## States

${markdownTable(['State', 'Contract'], guide.states.map((row) => [row.state, row.rule]))}

## Behavior and interaction

${markdownBullets(guide.behavior)}

## 정량 규칙

${markdownTable(['Subject', 'Rule'], guide.quantitativeRules.map((row) => [row.subject, row.rule]))}

## Responsive

${markdownBullets(guide.responsive)}

## Content and writing

${markdownBullets(guide.contentGuidance)}

## Accessibility

${markdownBullets(guide.accessibility)}

## Do / Don't

${markdownTable(['Kind', 'Guidance'], guide.doDont)}

## Exceptions

${markdownBullets(guide.exceptions)}

## Related components

${markdownTable(['Component', 'Relationship'], guide.related.map((row) => [`\`${row.component}\``, row.relationship]))}

## Examples

${examples}

## Tokens and API

### Tokens

${markdownBullets(guide.tokens.map((token) => `\`${token}\``))}

### Source contracts

${markdownBullets(guide.apiLinks.map((api) => `\`${api}\``))}

## Migration

${markdownBullets(guide.migration)}

## Sources

${sourceList}
`;
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
assert(entries.length === 179, `Expected 179 public component entries, received ${entries.length}.`);

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
  for (const storyPath of entry.storyEvidence) {
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
  'LDS Core/Components/Overview',
  'LDS Core/Components/Progress Board',
  'LDS Core/Patterns/Loading',
]);
const nonFoundationPages = audit.pages.filter(
  (page) => page.layer !== 'Foundation' && !nonComponentDecisionPages.has(page.title),
);
const tokenMap = tokenValueMap(tokenSource);
const guides = nonFoundationPages.map((page) => guideFromPage(page, exportToEntry, sourceDetails, tokenMap));
assert(guides.length === 148, `Expected 148 non-Foundation component pages, received ${guides.length}.`);

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
    'do-dont',
    'exceptions',
    'related-components',
    'examples',
    'tokens-api',
    'migration',
    'machine-readable-reference',
  ],
  benchmark: {
    name: 'SEED Components',
    url: 'https://seed-design.io/components',
    adopted: [
      'Anatomy and property explanations',
      'Decision and hierarchy guidance',
      'Quantitative constraints',
      'Paired Do/Don’t examples',
      'Related-component comparisons',
      'Specification and platform status',
    ],
    excluded: [
      'SEED product-specific components and branded examples',
      'SEED prose, artwork, token names, and public API shapes',
    ],
  },
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
    seedBenchmarkedGuides: guides.filter((guide) => guide.sources.some((source) => source.url?.startsWith('https://seed-design.io/components/'))).length,
  },
  entries,
  guides,
};

const compiledJson = `${JSON.stringify(compiled, null, 2)}\n`;
const runtimeJson = `${JSON.stringify({ summary: compiled.summary, guides }, null, 2)}\n`;
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
- SEED component benchmark traces: **${compiled.summary.seedBenchmarkedGuides}**
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
for (const guide of guides) await emit(`runtime/${guide.slug}.json`, `${JSON.stringify(guide, null, 2)}\n`);
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
