import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const DEFAULT_AUDIT = 'docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json';
const DEFAULT_REVIEW = 'docs/references/quality/STORYBOOK_PRIMARY_DESCRIPTION_REVIEW.json';
const REVIEWED_DECISION = 'retained-in-canvas';
const UNREVIEWED_DECISION = 'unreviewed';
const UNRESOLVED = Symbol('unresolved');

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function parseJson(source) {
  return JSON.parse(source.replace(/^\uFEFF/u, ''));
}

export function normalizeDescription(value) {
  const normalized = String(value)
    .normalize('NFC')
    .replace(/\s+/gu, ' ')
    .trim();
  if (!normalized) return [];
  return normalized
    .split(/(?<=[.!?。！？])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  throw new Error(`Unsupported computed property "${node.getText()}".`);
}

function collectDeclarations(sourceFile) {
  const declarations = new Map();
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        declarations.set(declaration.name.text, declaration.initializer);
      }
    }
  }
  return declarations;
}

async function foundationContext(root) {
  const content = parseJson(
    await readFile(path.join(root, 'docs', 'foundations', 'foundation-content.json'), 'utf8'),
  );
  return new Map(content.foundations.map((foundation) => [foundation.slug, foundation]));
}

async function helperDescriptionExpression(root, helperName) {
  const fileName =
    helperName === 'foundationGuideStory'
      ? 'FoundationGuide.shared.jsx'
      : 'FoundationSpecimen.shared.jsx';
  const file = path.join(root, 'stories', fileName);
  const source = await readFile(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  let expression;

  function visit(node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name?.text === helperName &&
      node.body
    ) {
      function findCall(child) {
        if (
          !expression &&
          ts.isCallExpression(child) &&
          ts.isIdentifier(child.expression) &&
          child.expression.text === 'storyDescription'
        ) {
          expression = child.arguments[0];
          return;
        }
        ts.forEachChild(child, findCall);
      }
      findCall(node.body);
    }
    if (!expression) ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (!expression) throw new Error(`Could not find storyDescription in ${fileName}.`);
  return { expression, sourceFile };
}

function evaluator({ sourceFile, declarations, foundations, helperExpressions }) {
  const resolving = new Set();

  async function evaluate(node, environment = new Map()) {
    if (!node) return undefined;
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
      return evaluate(node.expression, environment);
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) {
      return node.text;
    }
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isIdentifier(node)) {
      if (environment.has(node.text)) return environment.get(node.text);
      const initializer = declarations.get(node.text);
      if (!initializer) throw new Error(`Unresolved identifier "${node.text}".`);
      if (resolving.has(node.text)) throw new Error(`Circular local const "${node.text}".`);
      resolving.add(node.text);
      try {
        return await evaluate(initializer, environment);
      } finally {
        resolving.delete(node.text);
      }
    }
    if (ts.isTemplateExpression(node)) {
      let result = node.head.text;
      for (const span of node.templateSpans) {
        const value = await evaluate(span.expression, environment);
        if (value === UNRESOLVED || (typeof value !== 'string' && typeof value !== 'number')) {
          throw new Error(`Unsupported template substitution "${span.expression.getText(sourceFile)}".`);
        }
        result += value + span.literal.text;
      }
      return result;
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const left = await evaluate(node.left, environment);
      const right = await evaluate(node.right, environment);
      if (![left, right].every((value) => typeof value === 'string' || typeof value === 'number')) {
        throw new Error(`Unsupported concatenation "${node.getText(sourceFile)}".`);
      }
      return left + right;
    }
    if (ts.isPropertyAccessExpression(node)) {
      const target = await evaluate(node.expression, environment);
      if (!target || target === UNRESOLVED || typeof target !== 'object' || !(node.name.text in target)) {
        throw new Error(`Unresolved property "${node.getText(sourceFile)}".`);
      }
      return target[node.name.text];
    }
    if (ts.isObjectLiteralExpression(node)) {
      const object = {};
      for (const member of node.properties) {
        if (ts.isSpreadAssignment(member)) {
          let spread;
          try {
            spread = await evaluate(member.expression, environment);
          } catch {
            // Imported or runtime-only spreads may provide unrelated render/args fields.
            // A later allowlisted description can still resolve the required path; if it
            // does not, the final path assertion fails closed.
            continue;
          }
          if (!spread || spread === UNRESOLVED || typeof spread !== 'object' || Array.isArray(spread)) {
            throw new Error(`Unresolved object spread "${member.expression.getText(sourceFile)}".`);
          }
          Object.assign(object, spread);
          continue;
        }
        if (ts.isShorthandPropertyAssignment(member)) {
          object[propertyName(member.name)] = await evaluate(member.name, environment);
          continue;
        }
        if (!ts.isPropertyAssignment(member)) continue;
        const name = propertyName(member.name);
        try {
          object[name] = await evaluate(member.initializer, environment);
        } catch (error) {
          if (['parameters', 'docs', 'description', 'story'].includes(name)) throw error;
          object[name] = UNRESOLVED;
        }
      }
      return object;
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      if (name === 'storyDescription') {
        const story = await evaluate(node.arguments[0], environment);
        if (typeof story !== 'string') throw new Error('storyDescription requires a resolved string.');
        return { docs: { description: { story } } };
      }
      if (name === 'foundationGuideStory' || name === 'foundationSpecimenStory') {
        const slug = await evaluate(node.arguments[0], environment);
        if (typeof slug !== 'string') throw new Error(`${name} requires a literal foundation slug.`);
        const foundation = foundations.get(slug);
        if (!foundation) throw new Error(`Unknown foundation "${slug}".`);
        const helper = helperExpressions.get(name);
        const helperEvaluator = evaluator({
          sourceFile: helper.sourceFile,
          declarations: new Map(),
          foundations,
          helperExpressions,
        });
        const story = await helperEvaluator.evaluate(
          helper.expression,
          new Map([['foundation', foundation], ['slug', slug]]),
        );
        if (typeof story !== 'string') throw new Error(`${name} produced an unresolved description.`);
        const providedName = node.arguments[1] ? await evaluate(node.arguments[1], environment) : '개요';
        return { name: providedName, parameters: { docs: { description: { story } } } };
      }
      throw new Error(`Unsupported call "${name}".`);
    }
    throw new Error(`Unsupported expression "${node.getText(sourceFile)}".`);
  }

  return { evaluate };
}

function selectedStory(page) {
  const publicStories = (page.stories || []).filter((story) => story.visibility === 'public');
  return publicStories.find((story) => story.role === 'overview') || publicStories[0];
}

export async function extractPrimaryDescriptions({
  root = process.cwd(),
  auditPath = path.join(root, DEFAULT_AUDIT),
} = {}) {
  const audit = parseJson(await readFile(auditPath, 'utf8'));
  const needsFoundation = audit.pages.some((page) =>
    /foundation(?:Guide|Specimen)Story/.test(page.importPath || ''),
  );
  let foundations = new Map();
  let helperExpressions = new Map();
  // Story filenames do not identify helper use, so load the checked-in helper inputs when present.
  try {
    foundations = await foundationContext(root);
    helperExpressions = new Map(
      await Promise.all(
        ['foundationGuideStory', 'foundationSpecimenStory'].map(async (name) => [
          name,
          await helperDescriptionExpression(root, name),
        ]),
      ),
    );
  } catch (error) {
    if (needsFoundation) throw error;
  }

  const entries = [];
  for (const page of audit.pages) {
    const selected = selectedStory(page);
    if (!selected) continue;
    const relativePath = page.importPath.replace(/^\.\//, '');
    const file = path.join(root, relativePath);
    const source = await readFile(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
    const declarations = collectDeclarations(sourceFile);
    const initializer = declarations.get(selected.exportName);
    if (!initializer) throw new Error(`${relativePath}: missing export "${selected.exportName}".`);
    try {
      const value = await evaluator({
        sourceFile,
        declarations,
        foundations,
        helperExpressions,
      }).evaluate(initializer);
      const description = value?.parameters?.docs?.description?.story;
      if (description === UNRESOLVED || typeof description !== 'string') {
        throw new Error('primary story has no resolvable parameters.docs.description.story.');
      }
      entries.push({
        pageTitle: page.title,
        importPath: page.importPath,
        storyId: selected.id,
        exportName: selected.exportName,
        description,
      });
    } catch (error) {
      throw new Error(`${relativePath} (${selected.exportName}): ${error.message}`, { cause: error });
    }
  }
  return entries;
}

function entryKey(entry) {
  return entry.importPath || entry.pageTitle;
}

function materializeEntry(entry, previous) {
  const sentences = normalizeDescription(entry.description);
  const previousDecisions = new Map(
    (previous?.sentences || []).map((sentence) => [sentence.hash, sentence.decision]),
  );
  return {
    pageTitle: entry.pageTitle,
    importPath: entry.importPath,
    storyId: entry.storyId,
    exportName: entry.exportName,
    descriptionHash: sha256(sentences.join('\n')),
    sentences: sentences.map((text) => {
      const hash = sha256(text);
      return {
        hash,
        text,
        decision: previousDecisions.get(hash) || UNREVIEWED_DECISION,
      };
    }),
  };
}

export function buildDescriptionReview(currentEntries, previous) {
  const previousByKey = new Map((previous?.entries || []).map((entry) => [entryKey(entry), entry]));
  const entries = currentEntries.map((entry) =>
    materializeEntry(entry, previousByKey.get(entryKey(entry))),
  );
  const currentByKey = new Map(entries.map((entry) => [entryKey(entry), entry]));
  const migrations = [...(previous?.migrations || [])];

  for (const oldEntry of previous?.entries || []) {
    const current = currentByKey.get(entryKey(oldEntry));
    if (!current) {
      migrations.push({
        reason: 'deleted-entry',
        pageTitle: oldEntry.pageTitle,
        importPath: oldEntry.importPath,
      });
      continue;
    }
    const currentHashes = new Set(current.sentences.map((sentence) => sentence.hash));
    for (const sentence of oldEntry.sentences || []) {
      if (!currentHashes.has(sentence.hash)) {
        migrations.push({
          reason: 'deleted-sentence',
          pageTitle: oldEntry.pageTitle,
          importPath: oldEntry.importPath,
          hash: sentence.hash,
          text: sentence.text,
          previousDecision: sentence.decision,
        });
      }
    }
  }

  const uniqueMigrations = [
    ...new Map(migrations.map((migration) => [JSON.stringify(migration), migration])).values(),
  ];
  return {
    schemaVersion: 1,
    policy: {
      selectedStory: 'public overview from the Storybook IA audit, otherwise first public story',
      reviewedDecision: REVIEWED_DECISION,
      normalization: 'Unicode NFC, collapsed whitespace, and terminal-punctuation sentence boundaries',
    },
    entries,
    migrations: uniqueMigrations,
  };
}

export function validateDescriptionReview(review, currentEntries) {
  const problems = [];
  for (const entry of review.entries || []) {
    for (const sentence of entry.sentences || []) {
      if (sentence.decision !== REVIEWED_DECISION) {
        problems.push(`${entry.pageTitle}: sentence ${sentence.hash} is unreviewed.`);
      }
    }
  }
  for (const migration of review.migrations || []) {
    problems.push(
      `${migration.pageTitle}: unresolved ${migration.reason} migration${migration.hash ? ` ${migration.hash}` : ''}.`,
    );
  }

  if (currentEntries) {
    const reviewed = new Map((review.entries || []).map((entry) => [entryKey(entry), entry]));
    const current = new Map(currentEntries.map((entry) => [entryKey(entry), entry]));
    for (const [key, currentEntry] of current) {
      const baseline = reviewed.get(key);
      if (!baseline) problems.push(`${currentEntry.pageTitle}: missing review entry.`);
      else if (baseline.descriptionHash !== currentEntry.descriptionHash) {
        problems.push(`${currentEntry.pageTitle}: primary description changed.`);
      }
    }
    for (const [key, baseline] of reviewed) {
      if (!current.has(key)) problems.push(`${baseline.pageTitle}: reviewed entry was deleted.`);
    }
  }

  if (problems.length) {
    throw new Error(`Storybook primary description review failed:\n- ${problems.join('\n- ')}`);
  }
}

async function runCli() {
  const root = process.cwd();
  const reviewPath = path.join(root, DEFAULT_REVIEW);
  const update = process.argv.includes('--update');
  const reviewCurrent = process.argv.includes('--review-current');
  if (update && reviewCurrent) throw new Error('Choose either --update or --review-current.');
  const rawEntries = await extractPrimaryDescriptions({ root });
  let previous;
  try {
    previous = parseJson(await readFile(reviewPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT' && !reviewCurrent) throw error;
  }
  const currentReview = buildDescriptionReview(rawEntries, previous);

  if (reviewCurrent) {
    for (const entry of currentReview.entries) {
      for (const sentence of entry.sentences) sentence.decision = REVIEWED_DECISION;
    }
  }

  if (update || reviewCurrent) {
    await writeFile(reviewPath, `${JSON.stringify(currentReview, null, 2)}\n`);
    console.log(
      `${reviewCurrent ? 'Reviewed' : 'Updated'} ${path.relative(root, reviewPath)}: ${currentReview.entries.length} entries, ` +
        `${currentReview.entries.reduce((sum, entry) => sum + entry.sentences.length, 0)} sentences, ` +
        `${currentReview.migrations.length} unresolved migrations.`,
    );
    return;
  }

  if (!previous) throw new Error(`Missing review baseline: ${DEFAULT_REVIEW}. Run with --update.`);
  validateDescriptionReview(previous, currentReview.entries);
  console.log(
    `Validated ${previous.entries.length} primary Storybook descriptions with reviewed sentence hashes.`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
