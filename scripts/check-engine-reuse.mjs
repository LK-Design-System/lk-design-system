// Engine reuse gate: new components must consume the promoted behavior engines
// (components/internal/useMenuKeyboard.js, components/internal/useSubmenuBranch.jsx,
// components/overlay/anchored-overlay.js, components/overlay/dialog-focus.js,
// components/forms/field-shared.js) instead of hand-rolling roving focus, focus
// traps, light dismissal, or field metadata wiring.
//
// Detectors are deliberately conservative — avoiding false positives matters
// more than exhaustive detection. Pre-existing findings are latched in
// docs/references/quality/ENGINE_REUSE_BASELINE.json (same ratchet style as the
// other quality baselines); only new occurrences fail the check.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'ENGINE_REUSE_BASELINE.json');
const update = process.argv.includes('--update-baseline');

async function collect(dir, suffix, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, suffix, out);
    else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(absolute);
  }
  return out.sort();
}

const classification = JSON.parse(
  await readFile(path.join(root, 'docs', 'references', 'wds', 'PUBLIC_EXPORT_CLASSIFICATION.json'), 'utf8'),
);
const internalModulePaths = new Set(
  (classification.internalModules ?? []).map((module) => path.normalize(path.join(root, module.path))),
);

const MENU_ENGINES = ['useMenuKeyboard', 'useSubmenuBranch'];
const DIALOG_ENGINE = 'dialog-focus';
const OVERLAY_ENGINE = 'anchored-overlay';
const FIELD_ENGINE = 'field-shared';

function importsAnyOf(source, moduleNames) {
  return moduleNames.some((name) => new RegExp(`from\\s+['"][^'"]*${name}(?:\\.jsx?)?['"]`).test(source));
}

// role="menu" / role="menuitem*" rendered as a literal JSX attribute — selector
// strings such as `[role="menuitem"]` inside querySelector calls do not match.
function rendersMenuRole(sourceFile) {
  let found = 0;
  function visit(node) {
    if (
      ts.isJsxAttribute(node)
      && node.name.getText(sourceFile) === 'role'
      && node.initializer
      && ts.isStringLiteral(node.initializer)
      && (node.initializer.text === 'menu' || node.initializer.text.startsWith('menuitem'))
    ) {
      found += 1;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return found;
}

// aria-live rendered on a JSX element that is itself conditionally mounted
// (`cond && <span aria-live …>` / `cond ? <span aria-live …> : …`). A live
// region must exist before its first announcement, so conditional mounting is
// the signature of a hand-rolled announcement channel. FieldMessage in the
// field-shared engine owns the vetted error-alert variant of this pattern.
function conditionallyMountedAriaLive(sourceFile) {
  let found = 0;
  function containingJsxElement(node) {
    let current = node.parent;
    while (current) {
      if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) return current;
      current = current.parent;
    }
    return null;
  }
  function isConditionallyMounted(element) {
    let current = element.parent;
    while (current && !ts.isSourceFile(current)) {
      if (ts.isConditionalExpression(current)) return true;
      if (
        ts.isBinaryExpression(current)
        && (current.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
          || current.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
      ) return true;
      current = current.parent;
    }
    return false;
  }
  function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.getText(sourceFile) === 'aria-live') {
      const element = containingJsxElement(node);
      if (element && isConditionallyMounted(element)) found += 1;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return found;
}

const findings = {
  menuRovingWithoutEngine: {},
  focusTrapWithoutEngine: {},
  outsideDismissWithoutEngine: {},
  conditionalAriaLiveMount: {},
  fieldMetadataWithoutEngine: {},
};

function record(category, rel, count) {
  if (count > 0) findings[category][rel] = count;
}

for (const absolute of await collect(path.join(root, 'components'), '.jsx')) {
  if (internalModulePaths.has(path.normalize(absolute))) continue;
  const rel = path.relative(root, absolute).replaceAll('\\', '/');
  const source = await readFile(absolute, 'utf8');
  const sourceFile = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);

  const usesMenuEngine = importsAnyOf(source, MENU_ENGINES);
  const usesDialogEngine = importsAnyOf(source, [DIALOG_ENGINE]);
  const usesOverlayEngine = importsAnyOf(source, [OVERLAY_ENGINE]);
  const usesFieldEngine = importsAnyOf(source, [FIELD_ENGINE]);

  // 1. Menu surface (role="menu"/"menuitem*") without the roving-focus engine.
  if (!usesMenuEngine) {
    record('menuRovingWithoutEngine', rel, rendersMenuRole(sourceFile));
  }

  // 2. Hand-rolled focus trap: Tab key handling + shiftKey + focusable query,
  // without the dialog focus engine (menu engines own their own Tab semantics).
  if (!usesDialogEngine && !usesMenuEngine) {
    const trapSignature = /['"]Tab['"]/.test(source)
      && /\bshiftKey\b/.test(source)
      && /querySelectorAll\s*\(/.test(source)
      && /\.focus\s*\(/.test(source);
    record('focusTrapWithoutEngine', rel, trapSignature ? 1 : 0);
  }

  // 3. Hand-rolled outside dismissal: document-level pointerdown/mousedown
  // listener without any dismissal-owning engine.
  if (!usesOverlayEngine && !usesDialogEngine && !usesMenuEngine) {
    const listeners = source.match(/addEventListener\(\s*['"](?:pointerdown|mousedown)['"]/g) ?? [];
    record('outsideDismissWithoutEngine', rel, listeners.length);
  }

  // 4. Conditionally mounted aria-live region (announcement channel that does
  // not exist before its first message).
  record('conditionalAriaLiveMount', rel, conditionallyMountedAriaLive(sourceFile));

  // 5. Form field wiring its own label/description metadata instead of the
  // field-shared engine. Scoped to components/forms/ and to files that wire
  // both a label association and a description channel.
  if (rel.startsWith('components/forms/') && !usesFieldEngine) {
    const metadataSignature = /\bhtmlFor\b/.test(source)
      && /aria-describedby|describedBy/.test(source);
    record('fieldMetadataWithoutEngine', rel, metadataSignature ? 1 : 0);
  }
}

for (const category of Object.keys(findings)) {
  findings[category] = Object.fromEntries(
    Object.entries(findings[category]).sort(([a], [b]) => a.localeCompare(b)),
  );
}

const totalFindings = Object.values(findings)
  .reduce((sum, entries) => sum + Object.values(entries).reduce((s, count) => s + count, 0), 0);

if (update) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({
    schemaVersion: 1,
    description: 'Known hand-rolled behavior-engine bypasses. New components must use useMenuKeyboard/useSubmenuBranch, anchored-overlay, dialog-focus, and field-shared; only newly introduced bypasses fail check:engine-reuse.',
    findings,
  }, null, 2)}\n`, 'utf8');
  console.log(`Updated engine reuse baseline: ${Object.entries(findings).map(([key, entries]) => `${key}=${Object.keys(entries).length}`).join(', ')} (${totalFindings} occurrences).`);
  process.exit(0);
}

const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [category, entries] of Object.entries(findings)) {
  for (const [rel, count] of Object.entries(entries)) {
    const allowed = baseline.findings?.[category]?.[rel] || 0;
    if (count > allowed) regressions.push(`${category}: ${rel} (${count} > ${allowed})`);
  }
}
if (regressions.length > 0) {
  throw new Error(
    'New behavior-engine bypasses detected. Use the shared engines '
    + '(components/internal/useMenuKeyboard.js, components/overlay/anchored-overlay.js, '
    + 'components/overlay/dialog-focus.js, components/forms/field-shared.js) instead of '
    + `re-implementing their behavior:\n- ${regressions.join('\n- ')}`,
  );
}
console.log(`Validated engine reuse ratchet: ${totalFindings} known bypass occurrences, 0 new ones.`);
