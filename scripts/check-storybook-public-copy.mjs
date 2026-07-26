import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { publicGuideText } from '../stories/ComponentGuide.logic.mjs';
import {
  publicFoundationContent,
  publicFoundationReferences,
} from '../stories/FoundationGuide.logic.mjs';

const root = process.cwd();
const index = JSON.parse(await readFile(path.join(root, 'storybook-static', 'index.json'), 'utf8'));
const componentGuides = JSON.parse(
  await readFile(path.join(root, 'docs', 'components', 'component-guide-runtime.json'), 'utf8'),
);
const foundationContent = JSON.parse(
  await readFile(path.join(root, 'docs', 'foundations', 'foundation-content.json'), 'utf8'),
);

const FORBIDDEN_COPY = [
  {
    name: 'repository path',
    pattern: /(?:^|[\s("'`])(?:\.{0,2}\/)?(?:assets|components|docs|packages|scripts|src|stories|tokens)\/[^\s)"'`]+/i,
  },
  {
    name: 'repository filename',
    pattern: /\b[\w.-]+\.(?:css|jsx?|json|md|tsx?)\b/i,
  },
  {
    name: 'maintenance command',
    pattern: /\b(?:npm|pnpm|yarn)\s+run\s+(?:build|check|generate|report)(?::[\w-]+)*/i,
  },
  {
    name: 'maintenance prose',
    pattern: /\bStorybook\b|visual[- ]parity|시각 회귀|패리티 점검|숨김\s*(?:story|스토리)|구현 상태와 소유 컴포넌트|React 구현 완료|Figma 상태 미추적|Storybook용/i,
  },
  {
    name: 'source-system name',
    pattern: new RegExp(String.raw`\b(?:WDS|Wanted|\x53\x65\x65\x64)\b`, 'i'),
  },
];

const VISIBLE_JSX_PROPS = new Set([
  'alt',
  'aria-label',
  'baseline',
  'caption',
  'children',
  'content',
  'description',
  'emptyText',
  'errorText',
  'eyebrow',
  'helperText',
  'items',
  'label',
  'lastUpdated',
  'name',
  'options',
  'period',
  'placeholder',
  'title',
  'unit',
  'value',
]);

function isPublicStory(entry) {
  return entry.type === 'story'
    && Array.isArray(entry.tags)
    && entry.tags.includes('dev');
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return '';
}

function unwrap(node) {
  let current = node;
  while (
    current
    && (
      ts.isParenthesizedExpression(current)
      || ts.isAsExpression(current)
      || ts.isSatisfiesExpression(current)
    )
  ) {
    current = current.expression;
  }
  return current;
}

function collectDeclarations(sourceFile) {
  const declarations = new Map();
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      declarations.set(statement.name.text, statement);
    }
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        declarations.set(declaration.name.text, declaration.initializer);
      }
    }
  }
  return declarations;
}

function createSourceScanner(relativePath, source) {
  const file = path.join(root, relativePath);
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const declarations = collectDeclarations(sourceFile);
  const visited = new Set();
  const failures = [];

  function inspectText(value, node) {
    const normalized = String(value || '').replace(/\s+/gu, ' ').trim();
    if (!normalized) return;
    for (const rule of FORBIDDEN_COPY) {
      if (!rule.pattern.test(normalized)) continue;
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      failures.push(`${relativePath}:${line + 1} ${rule.name}: ${normalized.slice(0, 180)}`);
    }
  }

  function scanFunction(node) {
    if (visited.has(node)) return;
    visited.add(node);
    if (!node.body) return;
    if (!ts.isBlock(node.body)) {
      scanExpression(node.body);
      return;
    }
    function visitReturns(child) {
      if (ts.isReturnStatement(child) && child.expression) {
        scanExpression(child.expression);
        return;
      }
      if (
        child !== node.body
        && (
          ts.isFunctionDeclaration(child)
          || ts.isFunctionExpression(child)
          || ts.isArrowFunction(child)
        )
      ) {
        return;
      }
      ts.forEachChild(child, visitReturns);
    }
    visitReturns(node.body);
  }

  function scanIdentifier(node) {
    const declaration = declarations.get(node.text);
    if (!declaration || visited.has(declaration)) return;
    if (ts.isFunctionDeclaration(declaration)) scanFunction(declaration);
    else {
      visited.add(declaration);
      scanExpression(declaration);
    }
  }

  function scanObject(node) {
    for (const member of node.properties) {
      if (ts.isSpreadAssignment(member)) {
        scanExpression(member.expression);
        continue;
      }
      if (!ts.isPropertyAssignment(member) && !ts.isShorthandPropertyAssignment(member)) continue;
      const name = propertyName(member.name);
      if (/^(?:className|decorators|href|on[A-Z]|play|src|style|tags)$/u.test(name)) continue;
      scanExpression(
        ts.isShorthandPropertyAssignment(member)
          ? member.name
          : member.initializer,
      );
    }
  }

  function scanJsx(node) {
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    const tagName = opening.tagName;
    if (ts.isIdentifier(tagName)) scanIdentifier(tagName);
    for (const attribute of opening.attributes.properties) {
      if (ts.isJsxSpreadAttribute(attribute)) {
        scanExpression(attribute.expression);
        continue;
      }
      const name = propertyName(attribute.name);
      if (!VISIBLE_JSX_PROPS.has(name) || !attribute.initializer) continue;
      if (ts.isStringLiteral(attribute.initializer)) inspectText(attribute.initializer.text, attribute.initializer);
      else if (ts.isJsxExpression(attribute.initializer)) scanExpression(attribute.initializer.expression);
    }
    if (ts.isJsxSelfClosingElement(node)) return;
    for (const child of node.children) {
      if (ts.isJsxText(child)) inspectText(child.text, child);
      else if (ts.isJsxExpression(child) && child.expression) scanExpression(child.expression);
      else if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) scanJsx(child);
      else if (ts.isJsxFragment(child)) {
        for (const fragmentChild of child.children) {
          if (ts.isJsxText(fragmentChild)) inspectText(fragmentChild.text, fragmentChild);
          else if (ts.isJsxExpression(fragmentChild) && fragmentChild.expression) scanExpression(fragmentChild.expression);
          else if (ts.isJsxElement(fragmentChild) || ts.isJsxSelfClosingElement(fragmentChild)) scanJsx(fragmentChild);
        }
      }
    }
  }

  function scanExpression(input) {
    const node = unwrap(input);
    if (!node) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      inspectText(node.text, node);
      return;
    }
    if (ts.isTemplateExpression(node)) {
      inspectText(node.head.text, node.head);
      for (const span of node.templateSpans) {
        scanExpression(span.expression);
        inspectText(span.literal.text, span.literal);
      }
      return;
    }
    if (ts.isIdentifier(node)) {
      scanIdentifier(node);
      return;
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      scanJsx(node);
      return;
    }
    if (ts.isJsxFragment(node)) {
      for (const child of node.children) {
        if (ts.isJsxText(child)) inspectText(child.text, child);
        else if (ts.isJsxExpression(child) && child.expression) scanExpression(child.expression);
        else if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) scanJsx(child);
      }
      return;
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) {
      scanFunction(node);
      return;
    }
    if (ts.isObjectLiteralExpression(node)) {
      scanObject(node);
      return;
    }
    ts.forEachChild(node, scanExpression);
  }

  function scanStory(initializer) {
    const node = unwrap(initializer);
    if (!node) return;
    if (ts.isIdentifier(node)) {
      const declaration = declarations.get(node.text);
      if (declaration) scanStory(declaration);
      return;
    }
    if (!ts.isObjectLiteralExpression(node)) {
      scanExpression(node);
      return;
    }
    for (const member of node.properties) {
      if (ts.isSpreadAssignment(member)) {
        const spread = unwrap(member.expression);
        if (ts.isIdentifier(spread) && declarations.has(spread.text)) {
          scanStory(declarations.get(spread.text));
        }
        continue;
      }
      if (!ts.isPropertyAssignment(member)) continue;
      const name = propertyName(member.name);
      if (['args', 'decorators', 'name', 'parameters', 'render'].includes(name)) {
        scanExpression(member.initializer);
      }
    }
  }

  return {
    declarations,
    failures,
    scanFunctionByName(name) {
      const declaration = declarations.get(name);
      if (declaration) scanFunction(declaration);
    },
    scanMeta() {
      const meta = declarations.get('meta');
      const node = unwrap(meta);
      if (!node) return;
      if (!ts.isObjectLiteralExpression(node)) return;
      const parameters = node.properties.find(
        (member) => ts.isPropertyAssignment(member) && propertyName(member.name) === 'parameters',
      );
      if (parameters) scanExpression(parameters.initializer);
    },
    scanStoryByName(name) {
      const declaration = declarations.get(name);
      if (declaration) scanStory(declaration);
    },
  };
}

const failures = [];
const publicByFile = new Map();
for (const entry of Object.values(index.entries || {}).filter(isPublicStory)) {
  const relativePath = String(entry.importPath || '').replace(/^\.\//u, '');
  const exports = publicByFile.get(relativePath) || new Set();
  if (entry.exportName) exports.add(entry.exportName);
  publicByFile.set(relativePath, exports);
}

for (const [relativePath, exports] of publicByFile) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  const scanner = createSourceScanner(relativePath, source);
  scanner.scanMeta();
  for (const exportName of exports) scanner.scanStoryByName(exportName);
  failures.push(...scanner.failures);
}

for (const [relativePath, componentName] of [
  ['stories/ComponentGuide.shared.jsx', 'ComponentGuide'],
  ['stories/FoundationGuide.shared.jsx', 'FoundationGuide'],
]) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  const scanner = createSourceScanner(relativePath, source);
  scanner.scanFunctionByName(componentName);
  failures.push(...scanner.failures);
}

for (const guide of componentGuides.guides) {
  const projected = [
    guide.purpose,
    ...guide.useWhen,
    ...guide.avoidWhen,
    ...guide.properties.map(({ description }) => description),
    ...guide.states.map(({ rule }) => rule),
    ...guide.accessibility,
  ].map(publicGuideText);
  for (const value of projected) {
    for (const rule of FORBIDDEN_COPY) {
      if (rule.pattern.test(value)) {
        failures.push(`docs/components/runtime/${guide.slug}.json ${rule.name}: ${value.slice(0, 180)}`);
      }
    }
  }
}

for (const foundation of foundationContent.foundations) {
  const projected = publicFoundationContent(foundation);
  const copy = [
    projected.purpose,
    ...projected.principles,
    ...projected.semanticModel.flat(),
    ...projected.selectionCriteria.flat(),
    ...projected.quantitativeRules.flat(),
    ...projected.doDont.flat(),
    ...projected.exceptions,
    ...projected.accessibility,
    ...projected.internationalization,
    ...projected.examples.flat(),
  ];
  const references = publicFoundationReferences(foundation);
  for (const value of [...copy, ...references.tokens, ...references.apis]) {
    for (const rule of FORBIDDEN_COPY) {
      if (rule.pattern.test(value)) {
        failures.push(`docs/foundations/foundation-content.json#${foundation.slug} ${rule.name}: ${value}`);
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Public Storybook copy exposes internal maintenance information:\n- ${failures.join('\n- ')}`);
}

console.log(
  `Validated public Storybook copy: ${publicByFile.size} story modules plus generated Component and Foundation guides expose no repository paths, maintenance commands, source-system names, or visual-regression prose.`,
);
