import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const indexPath = path.join(root, 'storybook-static', 'index.json');
const auditPath = path.join(root, 'docs', 'references', 'quality', 'STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json');
const contractPath = 'docs/STORYBOOK_INFORMATION_ARCHITECTURE.md';
const update = process.argv.includes('--update');
const check = process.argv.includes('--check');
const REVIEW_METHOD = 'source-ast+layer-human-review';

const PUBLIC_STORY_NAME_PREFIXES = {
  'foundation-reference': '참조 · ',
  usage: '사용법 · ',
  'variants-states': '변형·상태 · ',
  interaction: '상호작용 · ',
  responsive: '반응형 · ',
  scenario: '시나리오 · ',
};

const PUBLIC_STORY_ROLE_ORDER = {
  overview: 0,
  'foundation-reference': 1,
  usage: 2,
  'variants-states': 3,
  interaction: 4,
  responsive: 5,
  scenario: 6,
};

const PAGE_TITLE_RENAMES = {
  'LDS Core/Components/Content/Text': 'LDS Core/Components/Content/Text Primitives',
  'LDS Core/Components/Content/Media': 'LDS Core/Components/Content/Media Patterns',
  'LDS Core/Components/Layout/Essential': 'LDS Core/Components/Layout/Mobile System Bars',
  'LDS Product/Content/Platform Marks': 'LDS Product/Content/Platform Logos',
};

const ALLOWED_LATIN_STORY_TOKENS = new Set([
  '2D',
  '3D',
  'API',
  'ARIA',
  'CSV',
  'Ctrl',
  'End',
  'Enter',
  'Escape',
  'FPS',
  'GNSS',
  'GPU',
  'Home',
  'HUD',
  'ID',
  'JSON',
  'LiDAR',
  'LK',
  'LDS',
  'OS',
  'PageDown',
  'PageUp',
  'PIN',
  'ROBOTICS',
  'ROS',
  'ROS2',
  'Shift+Tab',
  'Space',
  'SVG',
  'Tab',
  'UI',
  'URL',
  'WAI-ARIA',
  'WDS',
  'WebRTC',
]);

if (update && check) throw new Error('Choose either --update or --check.');

const ROLE_DEFINITIONS = {
  'foundation-reference': 'Foundation token, principle, or source-model reference.',
  overview: 'The audience entry point: purpose, scope, and primary usage decision.',
  usage: 'Anatomy, composition, placement, or recommended usage.',
  'variants-states': 'Variants, sizes, tones, states, loading, empty, or error treatment.',
  interaction: 'Keyboard, focus, pointer, controlled-state, or lifecycle behavior.',
  responsive: 'Narrow, mobile, compact, wide, density, or overflow behavior.',
  scenario: 'A representative Product or Robotics situation that explains the reusable contract.',
  'visual-parity': 'Hidden visual-regression evidence for a real component surface.',
  'internal-contract': 'Hidden implementation contract that is useful to tests but not sidebar navigation.',
};

const LAYER_CONTRACTS = {
  Foundation: 'principle → semantic model → token/reference map → constraints → examples',
  Core: 'definition → when to use/avoid → anatomy → variants/states → interaction/accessibility → related components',
  Product: 'user problem → reusable workflow context → composition/ownership → states and recovery → responsive behavior → exclusions',
  Robotics: 'operator goal → prerequisites/authority → safe reading and control order → state transitions → failure/recovery → narrow/field constraints',
  Theme: 'brand role → allowed surfaces → variants → contrast/asset constraints → misuse to avoid',
};

const PAGE_OWNER_OVERRIDES = {
  'LDS Core/Components/Layout/Mobile System Bars': ['MobileSystemBars'],
  'LDS Core/Components/Layout/Page Structure': ['Container', 'Section', 'Split'],
  'LDS Core/Components/Layout/Grid and Columns': ['Grid', 'Columns', 'Col'],
  'LDS Core/Components/Layout/Scroll and Accessibility': ['ScrollArea', 'AspectRatio', 'Center', 'VisuallyHidden'],
  'LDS Core/Components/Layout/Stack and Alignment': ['Stack', 'Cluster', 'Spacer'],
  'LDS Core/Components/Selection and Input/Slider and Range': ['Slider', 'RangeSlider'],
  'LDS Core/Components/Selection and Input/Search and Autocomplete': ['SearchField', 'AutoComplete', 'Combobox', 'TagInput'],
  'LDS Core/Components/Content/Text Primitives': ['Blockquote', 'Code', 'Kbd', 'Overline', 'SourceTag'],
  'LDS Core/Components/Content/Media Patterns': ['ContentBadge', 'Thumbnail'],
  'LDS Core/Components/Content/Disclosure': ['Accordion', 'Collapsible'],
  'LDS Core/Components/Content/Lists': ['ListCell', 'Accordion'],
  'LDS Core/Components/Status/Badges and Tags': ['Badge', 'PushBadge', 'Tag'],
  'LDS Core/Components/Status/Notices and Callouts': ['Banner', 'Callout'],
  'LDS Core/Components/Overlay/Toast': ['Toast', 'ToastStack'],
  'LDS Theme/Brand/LK ROBOTICS Logo': ['Lockup', 'Overline'],
  'LDS Theme/Status/Brand Spinner': ['Theme:Brand Spinner'],
  'LDS Product/Action/Social Login': ['SocialButton'],
  'LDS Product/Content/Platform Logos': ['BrandLogo'],
  'LDS Product/Data/Visualization/Telemetry': ['TelemetryGauge', 'TelemetryValue'],
  'LDS Product/Navigation/Adaptive Navigation': ['NavRail', 'BottomNav'],
  'LDS Robotics/Assets/Icons': ['Icon'],
  'LDS Robotics/Foundation/Codes': ['Robotics Foundation:Codes'],
  'LDS Robotics/Foundation/Facility Glyph': ['Robotics Foundation:Facility Glyph'],
  'LDS Robotics/Foundation/Hazard Glyph': ['Robotics Foundation:Hazard Glyph'],
  'LDS Robotics/Foundation/Marker Pin': ['Robotics Foundation:Marker Pin'],
  'LDS Robotics/Foundation/Navigation Encoding Tokens': ['Robotics Foundation:Navigation Encoding Tokens'],
  'LDS Robotics/Foundation/State Badge': ['Robotics Foundation:State Badge'],
  'LDS Robotics/Foundation/Unit Format': ['Robotics Foundation:Unit Format'],
  'LDS Robotics/Foundation/Vector Glyph': ['Robotics Foundation:Vector Glyph'],
  'LDS Robotics/Foundation/Viewer Tokens': ['Robotics Foundation:Viewer Tokens'],
  'LDS Robotics/Editor/Canvas Shell': ['CanvasEditorShell', 'EditorToolbar', 'HistoryToolbar'],
  'LDS Robotics/Status/Robot State': ['RobotStatusCard'],
  'LDS Robotics/Status/Equipment State': ['EquipmentStatusCard'],
  'LDS Robotics/Viewer/2D Map': ['Map2DCanvas'],
  'LDS Robotics/Viewer/3D Scene': ['Scene3DFrame'],
  'LDS Robotics/Viewer/Navigation Viewer': ['Robotics Viewer:Navigation Viewer'],
  'LDS Robotics/Viewer/Viewer Frame': ['ViewerFrame'],
};

// Topic/reference pages can render a representative component without making
// that component the page owner. Keep this narrower than PAGE_OWNER_OVERRIDES:
// most component pages still use meta.component as their primary runtime owner.
const TOPIC_PRIMARY_OWNER_OVERRIDES = new Set([
  'LDS Robotics/Foundation/Codes',
  'LDS Robotics/Foundation/Facility Glyph',
  'LDS Robotics/Foundation/Hazard Glyph',
  'LDS Robotics/Foundation/Marker Pin',
  'LDS Robotics/Foundation/Navigation Encoding Tokens',
  'LDS Robotics/Foundation/State Badge',
  'LDS Robotics/Foundation/Unit Format',
  'LDS Robotics/Foundation/Vector Glyph',
  'LDS Robotics/Foundation/Viewer Tokens',
  'LDS Robotics/Viewer/Navigation Viewer',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relOrAbs) {
  return readFile(path.isAbsolute(relOrAbs) ? relOrAbs : path.join(root, relOrAbs), 'utf8');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function publicStoryRoleRank(story, index) {
  if (index === 0) return 0;
  return PUBLIC_STORY_ROLE_ORDER[story.role] ?? Number.POSITIVE_INFINITY;
}

function expectedPublicStoryPrefix(story, index) {
  if (index === 0) return '개요';
  return PUBLIC_STORY_NAME_PREFIXES[story.role];
}

function disallowedLatinStoryTokens(name) {
  const tokens = name.match(/(?:\d+[A-Za-z]+|[A-Za-z][A-Za-z0-9]*(?:[+-][A-Za-z0-9]+)*)/g) || [];
  return tokens.filter(
    (token) => !/^\d+(?:D|px)$/.test(token) && !ALLOWED_LATIN_STORY_TOKENS.has(token),
  );
}

function layerForTitle(title) {
  if (title.startsWith('LDS Core/Foundation/')) return 'Foundation';
  if (title.startsWith('LDS Core/Components/')) return 'Core';
  if (title.startsWith('LDS Product/')) return 'Product';
  if (title.startsWith('LDS Robotics/')) return 'Robotics';
  if (title.startsWith('LDS Theme/')) return 'Theme';
  return 'Other';
}

function publicExports(source) {
  const names = new Set();
  for (const match of source.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+/gm)) {
    for (const item of match[1].split(',')) names.add(item.trim().split(/\s+as\s+/).at(-1));
  }
  return names;
}

function normalizedSubject(value) {
  return String(value || '').replace(/[^A-Za-z0-9]/g, '').toLowerCase();
}

function titleOwners(title, exportNames) {
  const overridden = PAGE_OWNER_OVERRIDES[title];
  if (overridden) return overridden;
  const subject = normalizedSubject(title.split('/').at(-1));
  return [...exportNames].filter((name) => normalizedSubject(name) === subject);
}

function rootJsxName(tagName) {
  if (ts.isIdentifier(tagName)) return tagName.text;
  if (ts.isPropertyAccessExpression(tagName)) return rootJsxName(tagName.expression);
  return undefined;
}

function collectTopLevelNodes(sourceFile) {
  const nodes = new Map();
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) nodes.set(statement.name.text, statement);
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) nodes.set(declaration.name.text, declaration);
      }
    }
  }
  return nodes;
}

function importedComponents(sourceFile, exportNames) {
  const names = new Set();
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    if (!statement.moduleSpecifier.text.endsWith('/src/index.js')) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      const exported = element.propertyName?.text || element.name.text;
      if (exportNames.has(exported) && !/^[A-Z0-9_]+$/.test(exported)) names.add(element.name.text);
    }
  }
  return names;
}

function usageForNode(node, topLevel, imported, sourceFile, seen = new Set()) {
  const used = new Set();
  const helpers = new Set();
  if (!node) return { used, text: '' };

  function visit(current) {
    if (ts.isJsxOpeningElement(current) || ts.isJsxSelfClosingElement(current)) {
      const name = rootJsxName(current.tagName);
      if (name && imported.has(name)) used.add(name);
      else if (name && topLevel.has(name)) helpers.add(name);
    }
    if (ts.isCallExpression(current) && ts.isIdentifier(current.expression) && topLevel.has(current.expression.text)) {
      helpers.add(current.expression.text);
    }
    ts.forEachChild(current, visit);
  }
  visit(node);

  let text = node.getText(sourceFile);
  for (const helper of helpers) {
    if (seen.has(helper)) continue;
    seen.add(helper);
    const nested = usageForNode(topLevel.get(helper), topLevel, imported, sourceFile, seen);
    for (const name of nested.used) used.add(name);
    text += `\n${nested.text}`;
  }
  return { used, text };
}

function findMetaOwner(sourceFile) {
  let owner;
  function visit(node) {
    if (
      !owner &&
      ts.isPropertyAssignment(node) &&
      ((ts.isIdentifier(node.name) && node.name.text === 'component') || (ts.isStringLiteral(node.name) && node.name.text === 'component')) &&
      ts.isIdentifier(node.initializer)
    ) {
      owner = node.initializer.text;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return owner;
}

function findStoryGuideId(sourceFile) {
  let storyGuideId;
  function visit(node) {
    if (
      !storyGuideId &&
      ts.isPropertyAssignment(node) &&
      ((ts.isIdentifier(node.name) && node.name.text === 'storyGuide') ||
        (ts.isStringLiteral(node.name) && node.name.text === 'storyGuide')) &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      const storyIdProperty = node.initializer.properties.find(
        (property) =>
          ts.isPropertyAssignment(property) &&
          ((ts.isIdentifier(property.name) && property.name.text === 'storyId') ||
            (ts.isStringLiteral(property.name) && property.name.text === 'storyId')),
      );
      if (storyIdProperty && ts.isPropertyAssignment(storyIdProperty) && ts.isStringLiteral(storyIdProperty.initializer)) {
        storyGuideId = storyIdProperty.initializer.text;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return storyGuideId;
}

function classifyRole(story, layer, sourceText, isFirstPublic) {
  const tags = story.tags || [];
  const label = `${story.name} ${story.exportName || ''}`.toLowerCase();
  if (tags.includes('visual-parity') || /card parity/.test(label)) return 'visual-parity';
  if (!tags.includes('dev')) return 'internal-contract';
  if (layer === 'Foundation') return 'foundation-reference';

  if (
    /(keyboard|focus|interaction|contract|pointer|controlled|lifecycle|escape|roving|selection behavior|키보드|포커스|상호작용|계약|동기화|해제 요청|요청 직후)/i.test(label)
  ) return 'interaction';
  if (/(narrow|responsive|mobile|compact|wide|overflow|density|320px|반응형|좁은|모바일|컴팩트|한 열|긴 콘텐츠)/i.test(label)) return 'responsive';
  if (
    /(state|states|variant|matrix|disabled|error|loading|empty|readonly|tone|size|status|platform|dark|light|stale|offline|restricted|상태|변형|비활성|오류|로딩|빈 |색상|크기|플랫폼|다크|라이트|권한 회수|연결 끊김|신호 없음)/i.test(label)
  ) return 'variants-states';
  if (/(usage|anatomy|composition|placement|pattern|guide|structure|사용법|사용|구조|패턴|조합|선택|가이드)/i.test(label)) return 'usage';
  if (
    /(overview|playground|default|basic|primary|summary|개요|플레이그라운드|기본|전체형|표면|입력$|카드$|배지$|버튼$|토글$|목차$|라우트$|지표$|범례$|트리$|캘린더$|뷰어 툴바$)/i.test(label) ||
    (isFirstPublic && /<h1\b|<h2\b|<main\b/.test(sourceText))
  ) return 'overview';
  if (/시나리오/i.test(label)) return 'scenario';
  if (layer === 'Product' || layer === 'Robotics') return 'scenario';
  return isFirstPublic ? 'overview' : 'usage';
}

function hasCanvasGuidance(text) {
  return /<h1\b|<h2\b/.test(text) && /<p\b/.test(text);
}

function hasDecisionGuidance(source) {
  return /(when to use|when not to use|use when|avoid when|사용할 때|사용하지|피해야|적합|선택 기준|구분 기준)/i.test(source);
}

function defaultDisposition(page) {
  if (page.visibility.public === 0) {
    return { disposition: 'hide', dispositionReason: 'No audience-facing story remains on this page.' };
  }
  return {
    disposition: 'keep',
    dispositionReason: 'The page has a distinct audience-facing owner and no duplicate public home in the current taxonomy.',
  };
}

function preserveManualFields(page, previousPage) {
  if (!previousPage) return page;
  for (const key of [
    'disposition',
    'dispositionReason',
    'dispositionTarget',
    'guidePriority',
    'reviewStatus',
    'reviewMethod',
    'reviewedAt',
    'reviewedSourceSha256',
    'reviewNote',
  ]) {
    if (previousPage[key] !== undefined) page[key] = previousPage[key];
  }
  const previousStories = new Map((previousPage.stories || []).map((story) => [story.id, story]));
  const guidedEntryId = page.stories.find((story) => story.visibility === 'public' && story.hasCanvasGuidance)?.id;
  for (const story of page.stories) {
    const previous = previousStories.get(story.id);
    if (!previous) continue;
    for (const key of ['role', 'recommendedVisibility', 'reviewStatus', 'reviewMethod', 'reviewNote']) {
      if (key === 'role' && story.id === guidedEntryId) continue;
      if (previous[key] !== undefined) story[key] = previous[key];
    }
  }
  return page;
}

async function buildAudit(previous) {
  const indexSource = await read(indexPath);
  const index = JSON.parse(indexSource);
  const entrySource = await read('src/index.js');
  const exportNames = publicExports(entrySource);
  const stories = Object.values(index.entries || {}).filter((entry) => entry.type === 'story');
  const byImport = new Map();
  for (const story of stories) {
    const current = byImport.get(story.importPath) || [];
    current.push(story);
    byImport.set(story.importPath, current);
  }

  const previousPages = new Map((previous?.pages || []).map((page) => [page.title, page]));
  const previousPagesByImport = new Map((previous?.pages || []).map((page) => [page.importPath, page]));
  const pages = [];
  for (const [importPath, fileStories] of [...byImport].sort(([a], [b]) => a.localeCompare(b))) {
    const rel = importPath.replace(/^\.\//, '');
    const source = await read(rel);
    const sourceFile = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
    const topLevel = collectTopLevelNodes(sourceFile);
    const imported = importedComponents(sourceFile, exportNames);
    const metaOwner = findMetaOwner(sourceFile);
    const storyGuideId = findStoryGuideId(sourceFile);
    const layer = layerForTitle(fileStories[0].title);
    const orderedStories = [...fileStories];
    const firstPublicId = orderedStories.find((story) => story.tags?.includes('dev'))?.id;
    const renderedPageComponents = new Set();

    const auditedStories = orderedStories.map((story) => {
      const node = topLevel.get(story.exportName);
      const usage = usageForNode(node, topLevel, imported, sourceFile);
      for (const owner of usage.used) renderedPageComponents.add(owner);
      const visibility = story.tags?.includes('dev') ? 'public' : 'hidden';
      const isGuidedEntry = story.id === storyGuideId || (story.id === firstPublicId && hasCanvasGuidance(usage.text));
      const role = isGuidedEntry
        ? layer === 'Foundation'
          ? 'foundation-reference'
          : 'overview'
        : classifyRole(story, layer, usage.text, story.id === firstPublicId);
      return {
        id: story.id,
        name: story.name,
        exportName: story.exportName,
        visibility,
        tags: [...(story.tags || [])].sort(),
        role,
        renderedComponents: [...usage.used].sort(),
        hasStoryDescription:
          /description\s*:\s*\{\s*story\s*:/s.test(usage.text) ||
          /\bstoryDescription\s*\(/.test(usage.text) ||
          /\bfoundationGuideStory\s*\(/.test(usage.text),
        hasCanvasGuidance: hasCanvasGuidance(usage.text) || story.id === storyGuideId,
        recommendedVisibility: role === 'visual-parity' || role === 'internal-contract' ? 'hidden' : 'public',
        reviewStatus: 'pending',
        reviewMethod: null,
      };
    });

    const overriddenOwners = PAGE_OWNER_OVERRIDES[fileStories[0].title];
    const primaryOwnerOverride = TOPIC_PRIMARY_OWNER_OVERRIDES.has(fileStories[0].title)
      ? overriddenOwners?.[0]
      : null;
    const subjectOwners = new Set(
      overriddenOwners || (metaOwner ? [metaOwner] : titleOwners(fileStories[0].title, exportNames)),
    );
    if (subjectOwners.size === 0 && layer === 'Foundation') subjectOwners.add(`Foundation:${fileStories[0].title.split('/').at(-1)}`);
    if (subjectOwners.size === 0 && layer === 'Theme') subjectOwners.add(`Theme:${fileStories[0].title.split('/').at(-1)}`);
    if (subjectOwners.size === 0) {
      for (const owner of renderedPageComponents) subjectOwners.add(owner);
    }
    for (const story of auditedStories) {
      const label = normalizedSubject(`${story.name} ${story.exportName}`);
      const namedOwners = [...subjectOwners].filter((owner) => label.includes(normalizedSubject(owner)));
      const renderedOwners = story.renderedComponents.filter((owner) => subjectOwners.has(owner));
      story.ownerComponents = namedOwners.length ? namedOwners : renderedOwners.length ? renderedOwners : [...subjectOwners];
      story.supportingComponents = story.renderedComponents.filter((owner) => !story.ownerComponents.includes(owner));
      delete story.renderedComponents;
    }
    const publicStories = auditedStories.filter((story) => story.visibility === 'public');
    const hiddenStories = auditedStories.filter((story) => story.visibility === 'hidden');
    const componentDescription = /docs\s*:\s*\{[\s\S]*?description\s*:\s*\{[\s\S]*?component\s*:/s.test(source);
    const page = {
      title: fileStories[0].title,
      layer,
      family: fileStories[0].title.split('/').slice(0, -1).at(-1),
      importPath,
      sourceSha256: sha256(source),
      primaryOwner: primaryOwnerOverride || metaOwner || [...subjectOwners][0] || null,
      ownerComponents: [...subjectOwners].sort(),
      supportingComponents: [...renderedPageComponents].filter((owner) => !subjectOwners.has(owner)).sort(),
      visibility: { public: publicStories.length, hidden: hiddenStories.length },
      descriptionEvidence: {
        componentDescription,
        storyGuideId: storyGuideId || null,
        describedPublicStories: publicStories.filter((story) => story.hasStoryDescription).length,
        publicStoriesWithCanvasGuidance: publicStories.filter((story) => story.hasCanvasGuidance).length,
        decisionGuidance: hasDecisionGuidance(source),
      },
      missingGuidance: [
        !publicStories.some((story) => ['overview', 'foundation-reference'].includes(story.role)) ? 'audience-entry-overview' : null,
        !publicStories.some((story) => story.hasCanvasGuidance) ? 'visible-canvas-introduction' : null,
        !hasDecisionGuidance(source) && layer !== 'Foundation' ? 'when-to-use-and-avoid' : null,
        publicStories.some((story) => !story.hasStoryDescription) ? 'per-story-purpose' : null,
      ].filter(Boolean),
      guidePriority: ['Product', 'Robotics'].includes(layer) ? 'high' : layer === 'Core' ? 'medium' : 'low',
      ...defaultDisposition({ visibility: { public: publicStories.length, hidden: hiddenStories.length } }),
      reviewStatus: 'pending',
      reviewMethod: null,
      reviewedAt: null,
      reviewedSourceSha256: null,
      stories: auditedStories,
    };
    pages.push(preserveManualFields(page, previousPages.get(page.title) || previousPagesByImport.get(importPath)));
  }

  pages.sort((a, b) => a.title.localeCompare(b.title));
  const roles = Object.fromEntries(Object.keys(ROLE_DEFINITIONS).map((role) => [role, 0]));
  const dispositions = { keep: 0, merge: 0, split: 0, hide: 0 };
  const layers = {};
  for (const page of pages) {
    dispositions[page.disposition] = (dispositions[page.disposition] || 0) + 1;
    const layer = (layers[page.layer] ||= { pages: 0, stories: 0, public: 0, hidden: 0, guideReadyPages: 0 });
    layer.pages += 1;
    layer.stories += page.stories.length;
    layer.public += page.visibility.public;
    layer.hidden += page.visibility.hidden;
    if (page.missingGuidance.length === 0) layer.guideReadyPages += 1;
    for (const story of page.stories) roles[story.role] = (roles[story.role] || 0) + 1;
  }

  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    source: {
      name: 'LK Design System Storybook information architecture audit',
      auditedAt: '2026-07-19',
      storybookIndex: 'storybook-static/index.json',
      storybookIndexSha256: sha256(indexSource),
      publicExportEntry: 'src/index.js',
      contract: contractPath,
      method: 'Built Storybook index census plus source-AST ownership/role analysis, followed by page-level human disposition review.',
      reviewMethod: REVIEW_METHOD,
    },
    roleDefinitions: ROLE_DEFINITIONS,
    layerDescriptionContracts: LAYER_CONTRACTS,
    namingContract: {
      pageTitles: 'Canonical English component names; explicit Primitives or Patterns labels for public family pages.',
      publicEntryName: '개요',
      publicRolePrefixes: PUBLIC_STORY_NAME_PREFIXES,
      publicLanguage: 'Korean audience language, with Latin text reserved for approved standards, keys, brands, and units.',
      publicOrder: ['overview', 'foundation-reference', 'usage', 'variants-states', 'interaction', 'responsive', 'scenario'],
      normalizedPageTitles: PAGE_TITLE_RENAMES,
      renamedPageIdPolicy: 'Renamed pages keep their previous explicit meta id so public story links remain stable.',
    },
    summary: {
      pages: pages.length,
      stories: stories.length,
      publicStories: pages.reduce((sum, page) => sum + page.visibility.public, 0),
      hiddenStories: pages.reduce((sum, page) => sum + page.visibility.hidden, 0),
      componentDescriptions: pages.filter((page) => page.descriptionEvidence.componentDescription).length,
      pagesWithVisibleCanvasIntroduction: pages.filter((page) => page.descriptionEvidence.publicStoriesWithCanvasGuidance > 0).length,
      pagesWithDecisionGuidance: pages.filter((page) => page.descriptionEvidence.decisionGuidance).length,
      describedPublicStories: pages.reduce((sum, page) => sum + page.descriptionEvidence.describedPublicStories, 0),
      reviewedPages: pages.filter((page) => page.reviewStatus === 'reviewed').length,
      reviewedStories: pages.reduce(
        (sum, page) => sum + page.stories.filter((story) => story.reviewStatus === 'reviewed').length,
        0,
      ),
      staleReviewedPages: pages.filter(
        (page) => page.reviewStatus === 'reviewed' && page.reviewedSourceSha256 !== page.sourceSha256,
      ).length,
      recommendedVisibilityChanges: pages.reduce(
        (sum, page) => sum + page.stories.filter((story) => story.visibility !== story.recommendedVisibility).length,
        0,
      ),
      roles,
      dispositions,
      layers,
    },
    pages,
  };
}

const current = await read(auditPath).then(JSON.parse).catch(() => undefined);
const audit = await buildAudit(current);
const serialized = `${JSON.stringify(audit, null, 2)}\n`;

if (update) {
  await writeFile(auditPath, serialized, 'utf8');
  console.log(`Updated Storybook IA audit: ${audit.summary.pages} pages / ${audit.summary.stories} stories.`);
} else if (check) {
  assert(current, `Missing ${path.relative(root, auditPath)}. Run with --update.`);
  const currentSerialized = `${JSON.stringify(current, null, 2)}\n`;
  assert(currentSerialized === serialized, 'Storybook IA audit is stale. Run report-storybook-information-architecture.mjs --update and review new dispositions.');
  assert(Object.values(audit.summary.dispositions).reduce((sum, count) => sum + count, 0) === audit.summary.pages, 'Every page must have one disposition.');
  assert(Object.values(audit.summary.roles).reduce((sum, count) => sum + count, 0) === audit.summary.stories, 'Every story must have one role.');
  assert(audit.summary.reviewedPages === audit.summary.pages, 'Every page must have a completed human review.');
  assert(audit.summary.reviewedStories === audit.summary.stories, 'Every story must have a completed human review.');
  assert(audit.summary.staleReviewedPages === 0, 'A reviewed page changed after review and must be reviewed again.');
  assert(audit.summary.recommendedVisibilityChanges === 0, 'Recommended public/hidden visibility changes remain unresolved.');
  for (const layer of ['Foundation', 'Core', 'Product', 'Robotics', 'Theme']) {
    assert(audit.layerDescriptionContracts[layer], `Missing description contract for ${layer}.`);
  }
  const pageTitles = new Set();
  const storyIds = new Set();
  for (const page of audit.pages) {
    assert(!pageTitles.has(page.title), `Duplicate page title ${page.title}.`);
    pageTitles.add(page.title);
    assert(page.primaryOwner, `Missing primaryOwner for ${page.title}.`);
    assert(page.ownerComponents.length > 0, `Missing ownerComponents for ${page.title}.`);
    assert(page.reviewStatus === 'reviewed', `Pending page review for ${page.title}.`);
    assert(page.reviewMethod === REVIEW_METHOD, `Unexpected reviewMethod for ${page.title}.`);
    assert(page.reviewedSourceSha256 === page.sourceSha256, `Stale page review for ${page.title}.`);
    assert(['keep', 'merge', 'split', 'hide'].includes(page.disposition), `Invalid disposition for ${page.title}.`);
    const publicStories = page.stories.filter((story) => story.visibility === 'public');
    const guideId = page.descriptionEvidence.storyGuideId;
    if (guideId) {
      assert(publicStories.some((story) => story.id === guideId), `${page.title} storyGuide must point to a public story.`);
      assert(publicStories[0]?.id === guideId, `${page.title} storyGuide must point to the first public story.`);
    }
    assert(publicStories.length > 0, `${page.title} must retain a public audience entry story.`);
    assert(
      ['overview', 'foundation-reference'].includes(publicStories[0].role),
      `${page.title} must begin with an overview or foundation reference.`,
    );
    assert(
      page.descriptionEvidence.publicStoriesWithCanvasGuidance > 0,
      `${page.title} must show a canvas introduction on its audience entry story.`,
    );
    if (page.layer !== 'Foundation') {
      assert(page.descriptionEvidence.decisionGuidance, `${page.title} must explain when to use and when not to use the pattern.`);
    }
    assert(
      page.descriptionEvidence.describedPublicStories === publicStories.length,
      `${page.title} must describe every public story.`,
    );
    const publicStoryNames = new Set();
    let previousPublicStoryRank = -1;
    for (const [index, story] of publicStories.entries()) {
      const expectedPrefix = expectedPublicStoryPrefix(story, index);
      assert(expectedPrefix, `${story.id} has no public naming prefix for role ${story.role}.`);
      if (index === 0) {
        assert(story.name === expectedPrefix, `${page.title} must name its first public story "개요".`);
      } else {
        assert(story.name.startsWith(expectedPrefix), `${story.id} must start with "${expectedPrefix}".`);
        assert(story.name.length > expectedPrefix.length, `${story.id} needs a specific audience-facing name after its role prefix.`);
      }
      assert(!publicStoryNames.has(story.name), `${page.title} has duplicate public story name "${story.name}".`);
      publicStoryNames.add(story.name);
      const roleRank = publicStoryRoleRank(story, index);
      assert(roleRank >= previousPublicStoryRank, `${page.title} public stories are not ordered by the naming contract.`);
      previousPublicStoryRank = roleRank;
      const disallowedTokens = disallowedLatinStoryTokens(story.name);
      assert(disallowedTokens.length === 0, `${story.id} uses non-audience Latin terms: ${disallowedTokens.join(', ')}.`);
      assert(!story.name.includes('`'), `${story.id} exposes Markdown backticks in its public name.`);
      assert(!/(계약|검증|핸들러|플레이그라운드)/.test(story.name), `${story.id} exposes internal authoring language in its public name.`);
      assert(!/(?:\S\u00B7\s|\s\u00B7\S)/.test(story.name), `${story.id} uses asymmetric middle-dot spacing.`);
    }
    if (['merge', 'split'].includes(page.disposition)) {
      const targets = Array.isArray(page.dispositionTarget) ? page.dispositionTarget : [page.dispositionTarget];
      assert(targets.length > 0 && targets.every(Boolean), `${page.title} requires a dispositionTarget.`);
    }
    for (const story of page.stories) {
      assert(!storyIds.has(story.id), `Duplicate story id ${story.id}.`);
      storyIds.add(story.id);
      assert(story.ownerComponents.length > 0, `Missing ownerComponents for ${story.id}.`);
      assert(story.reviewStatus === 'reviewed', `Pending story review for ${story.id}.`);
      assert(story.reviewMethod === REVIEW_METHOD, `Unexpected reviewMethod for ${story.id}.`);
      assert(ROLE_DEFINITIONS[story.role], `Invalid role ${story.role} for ${story.id}.`);
      assert(['public', 'hidden'].includes(story.recommendedVisibility), `Invalid recommendedVisibility for ${story.id}.`);
      if (['internal-contract', 'visual-parity'].includes(story.role)) {
        assert(story.recommendedVisibility === 'hidden', `${story.id} must be recommended hidden.`);
      }
    }
  }
  for (const [previousTitle, normalizedTitle] of Object.entries(PAGE_TITLE_RENAMES)) {
    assert(!pageTitles.has(previousTitle), `Obsolete page title remains: ${previousTitle}.`);
    assert(pageTitles.has(normalizedTitle), `Missing normalized page title: ${normalizedTitle}.`);
  }
  assert(pageTitles.size === audit.summary.pages, 'Page title census does not match the summary.');
  assert(storyIds.size === audit.summary.stories, 'Story id census does not match the summary.');
  console.log(`Validated Storybook IA audit: ${audit.summary.pages} pages / ${audit.summary.stories} stories, all roles and dispositions current.`);
} else {
  console.log(JSON.stringify(audit.summary, null, 2));
}
