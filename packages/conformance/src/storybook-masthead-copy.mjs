import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const storyExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);

function slash(value) {
  return value.replaceAll('\\', '/');
}

function propertyName(node) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : null;
}

function literalText(node) {
  const value = ts.isParenthesizedExpression(node) ? node.expression : node;
  return ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)
    ? value.text
    : null;
}

function normalizeText(value) {
  return String(value).normalize('NFC').replace(/\s+/gu, ' ').trim();
}

function sentenceCount(value) {
  const normalized = normalizeText(value);
  if (!normalized) return 0;
  return normalized
    .split(/(?<=[.!?。！？])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .length;
}

function percentile(sorted, ratio) {
  if (sorted.length === 0) return 0;
  const index = Math.max(0, Math.ceil(sorted.length * ratio) - 1);
  return sorted[Math.min(sorted.length - 1, index)];
}

async function storyFiles(root) {
  const storiesRoot = path.join(root, 'stories');
  const files = [];

  async function collect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await collect(absolute);
      } else if (
        entry.isFile()
        && entry.name.includes('.stories.')
        && storyExtensions.has(path.extname(entry.name))
      ) {
        files.push(absolute);
      }
    }
  }

  await collect(storiesRoot);
  return files.sort();
}

export function validateMastheadEntries(entries, contract) {
  const findings = [];
  const limits = contract.limits;
  const lengths = entries.map(({ characters }) => characters).sort((left, right) => left - right);
  const mean = lengths.length
    ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length
    : 0;
  const median = percentile(lengths, 0.5);
  const p90 = percentile(lengths, 0.9);

  for (const entry of entries) {
    if (entry.characters > limits.maximumCharacters) {
      findings.push({
        code: 'STORYBOOK_MASTHEAD_COPY_LENGTH',
        file: entry.file,
        line: entry.line,
        message: `${entry.characters} characters exceeds the ${limits.maximumCharacters}-character masthead maximum.`,
      });
    }
    if (entry.sentences > limits.maximumSentences) {
      findings.push({
        code: 'STORYBOOK_MASTHEAD_COPY_SENTENCES',
        file: entry.file,
        line: entry.line,
        message: `${entry.sentences} sentences exceeds the ${limits.maximumSentences}-sentence masthead maximum.`,
      });
    }
  }

  const distributionChecks = [
    ['mean', mean, limits.maximumMeanCharacters],
    ['median', median, limits.maximumMedianCharacters],
    ['p90', p90, limits.maximumP90Characters],
  ];
  for (const [label, value, maximum] of distributionChecks) {
    if (value > maximum) {
      findings.push({
        code: 'STORYBOOK_MASTHEAD_COPY_DISTRIBUTION',
        file: 'stories',
        message: `${label} description length ${value.toFixed(1)} exceeds the ${maximum}-character repository limit.`,
      });
    }
  }

  return {
    entries,
    findings,
    metrics: {
      count: entries.length,
      meanCharacters: Number(mean.toFixed(1)),
      medianCharacters: median,
      p90Characters: p90,
      maximumCharacters: lengths.at(-1) ?? 0,
      maximumSentences: entries.reduce(
        (maximum, entry) => Math.max(maximum, entry.sentences),
        0,
      ),
    },
  };
}

export async function auditStorybookMastheadCopy({ root, contractPath }) {
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  if (
    contract.schemaVersion !== 1
    || contract.kind !== 'lds-storybook-masthead-copy-contract'
    || !contract.limits
  ) {
    throw new Error('Storybook masthead copy contract has an unsupported shape.');
  }

  const entries = [];
  const findings = [];
  for (const file of await storyFiles(root)) {
    const source = await readFile(file, 'utf8');
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
    );

    function visit(node) {
      if (
        ts.isPropertyAssignment(node)
        && propertyName(node.name) === 'storyGuide'
        && ts.isObjectLiteralExpression(node.initializer)
      ) {
        const descriptionProperty = node.initializer.properties.find(
          (property) => ts.isPropertyAssignment(property)
            && propertyName(property.name) === contract.canvasField,
        );
        if (!descriptionProperty || !ts.isPropertyAssignment(descriptionProperty)) {
          findings.push({
            code: 'STORYBOOK_MASTHEAD_COPY_MISSING',
            file: slash(path.relative(root, file)),
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
            message: `storyGuide.${contract.canvasField} is required.`,
          });
        } else {
          const description = literalText(descriptionProperty.initializer);
          const line = sourceFile
            .getLineAndCharacterOfPosition(descriptionProperty.getStart(sourceFile))
            .line + 1;
          if (description == null) {
            findings.push({
              code: 'STORYBOOK_MASTHEAD_COPY_UNRESOLVED',
              file: slash(path.relative(root, file)),
              line,
              message: `storyGuide.${contract.canvasField} must be a static string so conformance can review it.`,
            });
          } else {
            const normalized = normalizeText(description);
            entries.push({
              file: slash(path.relative(root, file)),
              line,
              description: normalized,
              characters: [...normalized].length,
              sentences: sentenceCount(normalized),
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  const validated = validateMastheadEntries(entries, contract);
  return {
    ...validated,
    findings: [...findings, ...validated.findings],
  };
}
