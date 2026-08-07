// Enforces the surface-ownership classification recorded in
// docs/references/quality/SURFACE_OWNERSHIP_CONTRACT.json.
//
// The classification used to live only in a handoff document, so nothing
// compared it against the code. SourceDisclosure was classified as borderless
// content and still drew its own border and radius from the initial public
// release until rc.59 — inside a product card that already had a perimeter,
// that put a second border a few pixels inside the first.
//
// What this verifies, and what it deliberately does not:
//
// - `borderless`: asserted. The root element of the component must not declare
//   a border or a border radius. This is the failure mode above and it is
//   soundly checkable from the root's own style object.
// - `embedded-variant` / `outermost`: presence only. These legitimately draw a
//   perimeter, but *where* differs per component — ResourceState puts it on the
//   inner message surface, DataToolbar keeps only a bottom divider — so a
//   generic root assertion would be wrong more often than right. They are held
//   in the contract so the classification stays reviewed, not auto-verified.
//
// A root the parser cannot resolve is a failure, not a pass: it must be
// recorded in the contract with `rootUnresolved` and a reason, so silence is
// never mistaken for compliance.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const contractPath = path.join(root, 'docs', 'references', 'quality', 'SURFACE_OWNERSHIP_CONTRACT.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Style object literals held in module- or function-scope consts, so `style={frameStyle}` resolves. */
function collectStyleVars(sourceFile) {
  const vars = new Map();
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node)
      && node.name
      && ts.isIdentifier(node.name)
      && node.initializer
      && ts.isObjectLiteralExpression(node.initializer)
    ) {
      vars.set(node.name.getText(sourceFile), node.initializer.getText(sourceFile));
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return vars;
}

function unwrap(expression) {
  let current = expression;
  while (current && ts.isParenthesizedExpression(current)) current = current.expression;
  return current;
}

/** The opening element of a returned JSX root, following fragments to their first element child. */
function openingElementOf(expression) {
  const node = unwrap(expression);
  if (!node) return null;
  if (ts.isJsxElement(node)) return node.openingElement;
  if (ts.isJsxSelfClosingElement(node)) return node;
  if (ts.isJsxFragment(node)) {
    const child = node.children.find((c) => ts.isJsxElement(c) || ts.isJsxSelfClosingElement(c));
    if (!child) return null;
    return ts.isJsxElement(child) ? child.openingElement : child;
  }
  // `cond ? <a/> : <b/>` — both branches are roots; the caller checks each.
  if (ts.isConditionalExpression(node)) return [openingElementOf(node.whenTrue), openingElementOf(node.whenFalse)];
  return null;
}

/** Every JSX root a component function can return, across all its return statements. */
function rootsOfComponentBody(body) {
  const roots = [];
  const push = (found) => {
    if (!found) return;
    if (Array.isArray(found)) found.forEach(push);
    else roots.push(found);
  };
  if (!body) return roots;
  // Concise arrow body: `(props) => (<div/>)`
  if (!ts.isBlock(body)) {
    push(openingElementOf(body));
    return roots;
  }
  const visit = (node) => {
    if (ts.isReturnStatement(node) && node.expression) push(openingElementOf(node.expression));
    // Do not descend into nested component/helper functions; their roots are not this component's root.
    if (node !== body && (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node))) return;
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(body, visit);
  return roots;
}

/** Locates the exported component named `name`, in either declaration form. */
function findComponentBody(sourceFile, name) {
  let body = null;
  const visit = (node) => {
    if (body) return;
    if (ts.isFunctionDeclaration(node) && node.name?.getText(sourceFile) === name) {
      body = node.body ?? null;
      return;
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.getText(sourceFile) === name) {
      let init = unwrap(node.initializer);
      // Unwrap React.forwardRef(...) / React.memo(...)
      while (init && ts.isCallExpression(init) && init.arguments.length) init = unwrap(init.arguments[0]);
      if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
        body = init.body ?? null;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return body;
}

const PERIMETER_PROPERTIES = ['border', 'borderRadius', 'borderWidth', 'borderInlineStart', 'borderBlockStart'];

/** Perimeter declarations on an opening element's inline style, resolving const references. */
function perimeterOf(opening, sourceFile, styleVars) {
  const attribute = opening.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.getText(sourceFile) === 'style',
  );
  if (!attribute?.initializer || !ts.isJsxExpression(attribute.initializer) || !attribute.initializer.expression) {
    return { declarations: [], resolved: true };
  }
  const expression = attribute.initializer.expression;
  let text;
  if (ts.isIdentifier(expression)) {
    const resolved = styleVars.get(expression.getText(sourceFile));
    if (resolved == null) return { declarations: [], resolved: false, reason: `style={${expression.getText(sourceFile)}} could not be resolved` };
    text = resolved;
  } else {
    text = expression.getText(sourceFile);
  }
  const flattened = text.replace(/\s+/g, ' ');
  const declarations = [];
  for (const property of PERIMETER_PROPERTIES) {
    // Property at the top of this object literal, followed by a value that is
    // neither `none`/`0` nor an explicitly cleared shorthand.
    const match = flattened.match(new RegExp(`(?:^|[{,]) *${property}: *([^,}]+)`));
    if (!match) continue;
    const value = match[1].trim();
    // `inherit` is the opposite of owning a surface — it adopts the container's
    // shape, which is exactly what a borderless component should do when it
    // fills a rounded parent. `none`/`0` and the CSS-wide keywords likewise
    // declare the absence of a perimeter rather than one.
    if (/^'?(none|0(px)?|inherit|initial|unset|revert(-layer)?)'?$/.test(value)) continue;
    declarations.push(`${property}: ${value}`);
  }
  return { declarations, resolved: true };
}

const contract = JSON.parse(await readFile(contractPath, 'utf8'));
const failures = [];
let borderlessChecked = 0;

for (const entry of contract.components) {
  const absolute = path.join(root, entry.path);
  let source;
  try {
    source = await readFile(absolute, 'utf8');
  } catch {
    failures.push(`${entry.name}: ${entry.path} does not exist. Remove it from the contract or fix the path.`);
    continue;
  }
  if (entry.strategy !== 'borderless') continue;

  const sourceFile = ts.createSourceFile(absolute, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const body = findComponentBody(sourceFile, entry.name);
  if (!body) {
    if (entry.rootUnresolved) continue;
    failures.push(`${entry.name}: could not locate the component's root element. Record why in the contract with "rootUnresolved" and a reason, so an unparsed component is never read as a passing one.`);
    continue;
  }
  const roots = rootsOfComponentBody(body);
  if (!roots.length) {
    if (entry.rootUnresolved) continue;
    failures.push(`${entry.name}: found no JSX root to inspect. Record why in the contract with "rootUnresolved".`);
    continue;
  }

  const styleVars = collectStyleVars(sourceFile);
  for (const opening of roots) {
    const { declarations, resolved, reason } = perimeterOf(opening, sourceFile, styleVars);
    if (!resolved) {
      if (entry.rootUnresolved) continue;
      failures.push(`${entry.name}: ${reason}. Record why in the contract with "rootUnresolved".`);
      continue;
    }
    if (declarations.length) {
      failures.push(
        `${entry.name} (${entry.path}) is classified borderless but its root <${opening.tagName.getText(sourceFile)}> draws ${declarations.join(', ')}. `
        + 'The embedding container owns the surface — a perimeter here lands a second border inside the first.',
      );
    }
  }
  borderlessChecked += 1;
}

assert(failures.length === 0, `Surface ownership contract violated:\n- ${failures.join('\n- ')}`);

const counts = contract.components.reduce((acc, entry) => {
  acc[entry.strategy] = (acc[entry.strategy] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `Validated surface ownership: ${borderlessChecked} borderless components have no root perimeter; `
  + `${counts['embedded-variant'] ?? 0} embedded-variant and ${counts.outermost ?? 0} outermost surfaces are classified but not auto-verified; `
  + `${contract.externalComponents.length} classified in other repositories.`,
);
