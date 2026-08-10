import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const execFileAsync = promisify(execFile);
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(moduleDirectory, '..');

export const ADOPTION_FACETS = [
  'tokensAndTheme',
  'layoutAndVisualFoundations',
  'statePatternsAndMotion',
  'assetsIconographyAndBrand',
  'contentAndInternationalization',
  'accessibility',
];

const DEFAULT_CONTRACT = 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json';
const DEFAULT_CONTRACT_SCHEMA = 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.schema.json';
const DEFAULT_REPORT_SCHEMA = 'docs/references/adoption/LDS_UI_ADOPTION_REPORT.schema.json';
const DEFAULT_CONFIG = '.lds/adoption.config.json';
const DEFAULT_REPORT_NAME = 'adoption-report.json';
const CONFIG_SCHEMA = path.join(packageDirectory, 'schemas', 'lds-ui-adoption-config.schema.json');
const UI_EXTENSIONS = new Set([
  '.css', '.less', '.scss', '.sass',
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx',
  '.vue', '.svelte',
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.otf',
]);
const TEXT_EXTENSIONS = new Set([
  '.css', '.less', '.scss', '.sass',
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx',
  '.vue', '.svelte',
]);
const ASSET_EXTENSIONS = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.otf',
]);
const EXCLUDED_PATH_SEGMENTS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage', 'storybook-static',
  'vendor', 'generated', '__generated__', '__snapshots__', '__tests__',
  'fixtures',
]);

function slash(value) {
  return value.replaceAll('\\', '/');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function diagnostic(code, file, message, line, severity = 'error') {
  return {
    code,
    severity,
    file: slash(file || ''),
    line: line || undefined,
    message,
  };
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function resolveFrom(root, candidate, fallback) {
  return path.resolve(root, candidate || fallback);
}

function relativeRepositoryPath(value) {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const normalized = slash(value.trim()).replace(/^\.\//, '');
  if (path.isAbsolute(value) || /^[A-Za-z]:\//.test(normalized)) return null;
  if (normalized.split('/').includes('..')) return null;
  return normalized;
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function resolvesWithin(root, candidate) {
  let canonicalRoot;
  try {
    canonicalRoot = await realpath(root);
  } catch {
    return false;
  }
  let ancestor = candidate;
  while (true) {
    let present = false;
    try {
      await lstat(ancestor);
      present = true;
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) return false;
    }
    if (present) {
      let canonicalAncestor;
      try {
        canonicalAncestor = await realpath(ancestor);
      } catch {
        // A broken or cyclic link is never a safe containment boundary.
        return false;
      }
      const remainder = path.relative(ancestor, candidate);
      return isWithin(canonicalRoot, path.resolve(canonicalAncestor, remainder));
    }
    const parent = path.dirname(ancestor);
    if (parent === ancestor) return false;
    ancestor = parent;
  }
}

function pathPatternRegex(pattern) {
  const normalized = relativeRepositoryPath(pattern);
  if (!normalized) return null;
  if (!/[?*]/.test(normalized)) {
    const escaped = normalized.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/\/$/, '');
    return new RegExp(`^${escaped}(?:/.*)?$`);
  }
  let source = '^';
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    if (char === '*' && normalized[index + 1] === '*') {
      if (normalized[index + 2] === '/') {
        source += '(?:.*/)?';
        index += 2;
      } else {
        source += '.*';
        index += 1;
      }
    } else if (char === '*') {
      source += '[^/]*';
    } else if (char === '?') {
      source += '[^/]';
    } else {
      source += char.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
  }
  return new RegExp(`${source}$`);
}

function matchesPathPattern(file, pattern) {
  const matcher = pathPatternRegex(pattern);
  return matcher ? matcher.test(slash(file).replace(/^\.\//, '')) : false;
}

function matchesAnyPath(file, patterns = []) {
  return patterns.some((pattern) => matchesPathPattern(file, pattern));
}

function adoptionConfigDiagnostics(config, configFile, schema) {
  const validate = strictValidator(schema);
  const diagnostics = validate(config)
    ? []
    : schemaDiagnostics(validate, configFile, 'ADOPTION_CONFIG_SCHEMA');
  for (const [field, entries] of [
    ['uiRoots', config?.uiRoots || []],
    ['excludedPaths', config?.excludedPaths || []],
  ]) {
    for (const entry of entries) {
      if (!pathPatternRegex(entry)) {
        diagnostics.push(diagnostic('ADOPTION_CONFIG_PATH', configFile, `${field} contains an unsafe repository path: ${entry}.`));
      }
    }
  }
  for (const [field, entry] of [
    ['styleEntry', config?.styleEntry],
    ['reportDirectory', config?.reportDirectory],
  ]) {
    if (entry && !relativeRepositoryPath(entry)) {
      diagnostics.push(diagnostic('ADOPTION_CONFIG_PATH', configFile, `${field} must be a repository-relative path.`));
    }
  }
  return diagnostics;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function loadAdoptionConfig(root, configPath = DEFAULT_CONFIG) {
  const relativeConfig = slash(configPath);
  const absolute = path.resolve(root, configPath);
  if (!isWithin(root, absolute) || !await resolvesWithin(root, absolute)) {
    return {
      config: null,
      configFile: relativeConfig,
      diagnostics: [diagnostic('ADOPTION_CONFIG_PATH', relativeConfig, 'The adoption config must be inside the consumer repository.')],
    };
  }
  let config;
  try {
    config = await readJson(absolute);
  } catch (error) {
    return {
      config: null,
      configFile: relativeConfig,
      diagnostics: [diagnostic('ADOPTION_CONFIG_READ', relativeConfig, error.message)],
    };
  }
  let schema;
  try {
    schema = await readJson(CONFIG_SCHEMA);
  } catch (error) {
    return {
      config: null,
      configFile: relativeConfig,
      diagnostics: [diagnostic('ADOPTION_CONFIG_SCHEMA_READ', slash(CONFIG_SCHEMA), error.message)],
    };
  }
  const diagnostics = adoptionConfigDiagnostics(config, relativeConfig, schema);
  return { config, configFile: relativeConfig, diagnostics };
}

async function loadAdoptionConfigAtRef(root, configFile, ref) {
  const relativeConfig = relativeRepositoryPath(configFile);
  if (!relativeConfig) {
    return {
      config: null,
      diagnostics: [diagnostic('ADOPTION_CONFIG_BASELINE', slash(configFile), 'The baseline config path is unsafe.')],
    };
  }
  let source;
  try {
    source = await git(root, ['show', `${ref}:${relativeConfig}`]);
  } catch (error) {
    return {
      config: null,
      missing: true,
      diagnostics: [],
    };
  }
  let config;
  try {
    config = JSON.parse(source);
  } catch (error) {
    return {
      config: null,
      diagnostics: [diagnostic('ADOPTION_CONFIG_BASELINE', relativeConfig, `Baseline config is invalid JSON: ${error.message}`)],
    };
  }
  const schema = await readJson(CONFIG_SCHEMA);
  return {
    config,
    missing: false,
    diagnostics: adoptionConfigDiagnostics(config, `${relativeConfig}@${ref}`, schema),
  };
}

function schemaDiagnostics(validate, file, code) {
  return (validate.errors || []).map((error) => diagnostic(
    code,
    file,
    `${error.instancePath || '/'} ${error.message || 'does not match the schema'}`,
  ));
}

function strictValidator(schema, additionalSchemas = []) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  for (const item of additionalSchemas) ajv.addSchema(item);
  return ajv.compile(schema);
}

function contractFacetIds(contract) {
  return (contract.facets || []).map((facet) => typeof facet === 'string' ? facet : facet.id);
}

function contractEvidenceTypes(contract) {
  return new Set((contract.evidenceKinds || []).map((entry) => typeof entry === 'string' ? entry : entry.id));
}

function sameSet(left, right) {
  return left.length === right.length && left.every((value) => right.includes(value));
}

/**
 * Validate the centrally pinned adoption contract and both schemas. This is a
 * separate operation from checking a consumer report so LDS CI can prove that
 * the policy package itself is internally coherent.
 */
export async function verifyAdoptionContract(options = {}) {
  const ldsRoot = path.resolve(options.ldsRoot || process.cwd());
  const contractPath = resolveFrom(ldsRoot, options.contractPath, DEFAULT_CONTRACT);
  const contractSchemaPath = resolveFrom(ldsRoot, options.contractSchemaPath, DEFAULT_CONTRACT_SCHEMA);
  const reportSchemaPath = resolveFrom(ldsRoot, options.reportSchemaPath, DEFAULT_REPORT_SCHEMA);
  const [contract, contractSchema, reportSchema] = await Promise.all([
    readJson(contractPath),
    readJson(contractSchemaPath),
    readJson(reportSchemaPath),
  ]);

  const validateContract = strictValidator(contractSchema);
  const diagnostics = validateContract(contract)
    ? []
    : schemaDiagnostics(validateContract, slash(path.relative(ldsRoot, contractPath)), 'ADOPTION_CONTRACT_SCHEMA');

  // Compiling the report schema catches invalid $refs and unsupported schema
  // constructs before a consumer action tries to validate an attestation.
  try {
    strictValidator(reportSchema);
  } catch (error) {
    diagnostics.push(diagnostic(
      'ADOPTION_REPORT_SCHEMA_INVALID',
      slash(path.relative(ldsRoot, reportSchemaPath)),
      error.message,
    ));
  }
  try {
    strictValidator(await readJson(CONFIG_SCHEMA));
  } catch (error) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONFIG_SCHEMA_INVALID',
      slash(path.relative(ldsRoot, CONFIG_SCHEMA)),
      error.message,
    ));
  }

  const facetIds = contractFacetIds(contract);
  if (!sameSet(facetIds, ADOPTION_FACETS) || new Set(facetIds).size !== ADOPTION_FACETS.length) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONTRACT_FACETS',
      slash(path.relative(ldsRoot, contractPath)),
      `The contract must expose exactly the six adoption facets: ${ADOPTION_FACETS.join(', ')}.`,
    ));
  }
  const verdicts = contract.verdicts || [];
  if (!sameSet(verdicts, ['reviewed', 'not-applicable', 'blocked'])) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONTRACT_VERDICTS',
      slash(path.relative(ldsRoot, contractPath)),
      'The contract verdicts must be reviewed, not-applicable, and blocked.',
    ));
  }
  const evidenceTypes = contractEvidenceTypes(contract);
  for (const required of ['source', 'token', 'story', 'check', 'visual', 'asset', 'copy-catalog', 'decision']) {
    if (!evidenceTypes.has(required)) {
      diagnostics.push(diagnostic(
        'ADOPTION_CONTRACT_EVIDENCE_TYPES',
        slash(path.relative(ldsRoot, contractPath)),
        `The contract is missing evidence type ${required}.`,
      ));
    }
  }
  if (!sameSet(contract.completion?.requiredFacetIds || [], ADOPTION_FACETS)) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONTRACT_COMPLETION',
      slash(path.relative(ldsRoot, contractPath)),
      'The contract completion facet list must match the six adoption facets.',
    ));
  }
  const schemaScopeMode = reportSchema.$defs?.scope?.properties?.mode;
  if (contract.scopeModes?.default !== 'full-surface'
    || schemaScopeMode?.default !== contract.scopeModes.default
    || !sameSet(schemaScopeMode?.enum || [], ['changed-ui', 'full-surface'])) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONTRACT_SCOPE_MODES',
      slash(path.relative(ldsRoot, contractPath)),
      'The contract and report schema must expose changed-ui/full-surface with full-surface as the default.',
    ));
  }
  for (const facet of contract.facets || []) {
    const requiredDecisionIds = (facet.requiredDecisions || []).map((entry) => entry.id);
    if (requiredDecisionIds.some((id) => typeof id !== 'string')
      || new Set(requiredDecisionIds).size !== requiredDecisionIds.length) {
      diagnostics.push(diagnostic(
        'ADOPTION_CONTRACT_DECISION_IDS',
        slash(path.relative(ldsRoot, contractPath)),
        `${facet.id} must expose unique stable required-decision IDs.`,
      ));
    }
    const reportDecisionIds = (reportSchema.$defs?.[`${facet.id}Decisions`]?.allOf || [])
      .map((entry) => entry.contains?.properties?.decisionId?.const)
      .filter(Boolean);
    if (!sameSet(requiredDecisionIds, reportDecisionIds)) {
      diagnostics.push(diagnostic(
        'ADOPTION_REPORT_DECISION_DRIFT',
        slash(path.relative(ldsRoot, reportSchemaPath)),
        `${facet.id} report decisions do not match the canonical contract IDs.`,
      ));
    }
    for (const trigger of facet.hardTriggers || []) {
      for (const kind of trigger.requiredEvidenceKinds || []) {
        if (!evidenceTypes.has(kind)) {
          diagnostics.push(diagnostic(
            'ADOPTION_CONTRACT_TRIGGER_EVIDENCE',
            slash(path.relative(ldsRoot, contractPath)),
            `${facet.id}.${trigger.id} refers to undeclared evidence kind ${kind}.`,
          ));
        }
      }
    }
  }
  const componentDecisionIds = (contract.componentMapping?.requiredDecisions || []).map((entry) => entry.id);
  const reportComponentDecisionIds = (reportSchema.$defs?.componentMappingDecisions?.allOf || [])
    .map((entry) => entry.contains?.properties?.decisionId?.const)
    .filter(Boolean);
  if (new Set(componentDecisionIds).size !== componentDecisionIds.length
    || !sameSet(componentDecisionIds, reportComponentDecisionIds)) {
    diagnostics.push(diagnostic(
      'ADOPTION_REPORT_DECISION_DRIFT',
      slash(path.relative(ldsRoot, reportSchemaPath)),
      'componentMapping report decisions do not match the canonical contract IDs.',
    ));
  }

  return {
    diagnostics,
    contract,
    contractSchema,
    reportSchema,
    paths: { contractPath, contractSchemaPath, reportSchemaPath },
  };
}

function parseNameStatus(output) {
  const fields = output.split('\0');
  if (fields.at(-1) === '') fields.pop();
  const changes = [];
  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    if (!status) continue;
    if (/^[RC]/.test(status)) {
      const oldPath = fields[index++];
      const file = fields[index++];
      changes.push({ status: status[0], oldPath: slash(oldPath), file: slash(file) });
    } else {
      changes.push({ status: status[0], file: slash(fields[index++]) });
    }
  }
  return changes;
}

async function git(root, args) {
  const { stdout } = await execFileAsync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout;
}

function diffRange(base, head) {
  return head ? `${base}...${head}` : base;
}

async function changedLineNumbers(root, range, file) {
  const output = await git(root, ['diff', '--no-ext-diff', '--no-color', '--unified=0', range, '--', file]);
  const lines = new Set();
  for (const match of output.matchAll(/^@@\s+-\d+(?:,\d+)?\s+\+(\d+)(?:,(\d+))?\s+@@/gm)) {
    const start = Number(match[1]);
    const count = match[2] == null ? 1 : Number(match[2]);
    for (let offset = 0; offset < count; offset += 1) lines.add(start + offset);
  }
  return lines;
}

function excludedPath(file, extraExclusions = []) {
  const normalized = slash(file);
  const segments = normalized.split('/');
  if (segments.some((segment) => EXCLUDED_PATH_SEGMENTS.has(segment))) return true;
  if (/(?:^|\/)[^/]+\.(?:test|spec|stories)\.[^/]+$/i.test(normalized)) return true;
  if (/\.(?:snap|min\.js|min\.css|map)$/i.test(normalized)) return true;
  return matchesAnyPath(normalized, extraExclusions);
}

function stripCommentsPreserveLines(source) {
  let output = '';
  let block = false;
  let quote = null;
  let escaped = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (block) {
      if (char === '*' && next === '/') {
        output += '  ';
        index += 1;
        block = false;
      } else {
        output += char === '\n' ? '\n' : ' ';
      }
      continue;
    }
    if (quote) {
      output += char;
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      output += char;
      continue;
    }
    if (char === '/' && next === '*') {
      output += '  ';
      index += 1;
      block = true;
      continue;
    }
    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') {
        output += ' ';
        index += 1;
      }
      if (index < source.length) output += '\n';
      continue;
    }
    output += char;
  }
  return output;
}

function relevantChangedLines(source, numbers) {
  const cleanLines = stripCommentsPreserveLines(source).split(/\r?\n/);
  return [...numbers]
    .sort((left, right) => left - right)
    .map((line) => ({ line, text: cleanLines[line - 1] || '' }))
    .filter(({ text }) => text.trim().length > 0);
}

function isUiFile(file) {
  return UI_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function isTextUiFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function isAssetFile(file) {
  return ASSET_EXTENSIONS.has(path.extname(file).toLowerCase());
}

async function collectRepositoryUiFiles(root, directory = root, output = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_PATH_SEGMENTS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectRepositoryUiFiles(root, absolute, output);
    } else if (entry.isFile()) {
      const relative = slash(path.relative(root, absolute));
      if (isUiFile(relative)) output.push(relative);
    }
  }
  return output;
}

function looksStyleBearing(text, file) {
  if (/\.(?:css|less|scss|sass)$/i.test(file)) return true;
  return /\bstyle\s*=|\b(?:style|styles|css|sx)\b|\b(?:color|background|border|boxShadow|fontSize|lineHeight|letterSpacing|gap|padding|margin|borderRadius|width|height)\s*:/.test(text);
}

const RAW_COLOR = /#(?:[\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})(?![\w-])|\brgba?\s*\([^)]*\)|\bhsla?\s*\([^)]*\)|(?<![-\w])(white|black)(?![-\w])/g;
const CSS_RAW_DIMENSION = /\b(?:gap|row-gap|column-gap|padding(?:-[a-z]+)?|margin(?:-[a-z]+)?|border-radius|font-size|line-height|letter-spacing|box-shadow)\s*:\s*(?!var\(|calc\(|clamp\(|min\(|max\(|0(?:[;\s}]|$))(-?\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%))/gi;
const JS_RAW_DIMENSION = /\b(?:gap|rowGap|columnGap|padding(?:Top|Right|Bottom|Left|Block|Inline)?|margin(?:Top|Right|Bottom|Left|Block|Inline)?|borderRadius|fontSize|lineHeight|letterSpacing|boxShadow)\s*:\s*(?:['"`]\s*)?(-?\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%)?)/g;

function rawVisualFindings(file, lines) {
  const findings = [];
  for (const entry of lines) {
    if (!looksStyleBearing(entry.text, file)) continue;
    for (const match of entry.text.matchAll(RAW_COLOR)) {
      // Anchor fragments and IDs are not visual colors.
      const prefix = entry.text.slice(Math.max(0, match.index - 12), match.index);
      if (/href\s*[:=]\s*['"]?$/.test(prefix)) continue;
      findings.push({ line: entry.line, value: match[0] });
    }
    const dimensionPattern = /\.(?:css|less|scss|sass)$/i.test(file) ? CSS_RAW_DIMENSION : JS_RAW_DIMENSION;
    for (const match of entry.text.matchAll(dimensionPattern)) {
      findings.push({ line: entry.line, value: match[1] });
    }
  }
  return findings;
}

function createFacts(file, lines, asset) {
  const text = lines.map((entry) => entry.text).join('\n');
  const facts = new Set();
  if (asset) facts.add('asset-change');
  if (lines.length > 0 && /\.(?:css|less|scss|sass)$/i.test(file)) facts.add('visual-change');
  if (/\b(?:style|styles|css|sx)\s*=|\bstyle\s*\{|\b(?:color|background|border|boxShadow|fontSize|lineHeight|letterSpacing|borderRadius)\s*:/.test(text)) {
    facts.add('visual-change');
  }
  if (/\b(?:display\s*:\s*['"]?(?:grid|flex)|gridTemplate|grid-template|gap\s*:|padding\s*:|margin\s*:|width\s*:|height\s*:|@media|container-type|breakpoint|responsive)\b/i.test(text)) {
    facts.add('layout-change');
  }
  if (/\b(?:Spinner|Skeleton|ProgressBar|CircularProgress|Dimmer|ResourceState)\b|\baria-busy\b|\bloading\s*=/.test(text)) {
    facts.add('loading-pattern');
  }
  if (/\b(?:animation|transition|@keyframes|prefers-reduced-motion)\b/.test(text)) facts.add('motion-change');
  if (/\b(?:onClick|onChange|onKeyDown|onKeyUp|onPointer|onFocus|onBlur|role\s*=|aria-[a-z-]+|tabIndex|focus\()/.test(text)) {
    facts.add('interaction-change');
    facts.add('accessibility-change');
  }
  if (/<(?:button|a|input|select|textarea|img|svg)\b/.test(text)) facts.add('accessibility-change');
  if (/\bIcon\b|<(?:img|svg)\b|\b(?:src|icon)\s*=|\.(?:svg|png|jpe?g|webp|avif|woff2?)\b/i.test(text)) facts.add('asset-usage');
  if (/\b(?:Intl\.|toLocale(?:String|DateString|TimeString)|locale|i18n|formatMessage|t\s*\()/.test(text)) facts.add('internationalization-change');
  if (/(?:>[\s]*[^<{\s][^<{]*<)|\b(?:label|placeholder|helperText|errorMessage|aria-label|title)\s*=\s*['"`][^'"`]+/m.test(text)) {
    facts.add('visible-copy-change');
  }
  if (/\bfrom\s+['"]@(?:lk-design-system|lk-robotics)\//.test(text) || /\brequire\(\s*['"]@(?:lk-design-system|lk-robotics)\//.test(text)) {
    facts.add('component-mapping-change');
  }
  return facts;
}

function reviewVerdict(review) {
  return review?.verdict;
}

function allEvidenceContainers(report) {
  const output = [];
  for (const [surfaceIndex, surface] of (report.surfaces || []).entries()) {
    for (const facet of ADOPTION_FACETS) {
      const review = surface.facets?.[facet];
      if (review) {
        output.push({ owner: `surfaces[${surfaceIndex}].${facet}`, evidence: review.evidence || [] });
        for (const [decisionIndex, decision] of (review.decisions || []).entries()) {
          output.push({
            owner: `surfaces[${surfaceIndex}].${facet}.decisions[${decisionIndex}]`,
            evidence: decision.evidence || [],
          });
        }
      }
    }
    if (surface.componentMapping) {
      output.push({ owner: `surfaces[${surfaceIndex}].componentMapping`, evidence: surface.componentMapping.evidence || [] });
      for (const [decisionIndex, decision] of (surface.componentMapping.decisions || []).entries()) {
        output.push({
          owner: `surfaces[${surfaceIndex}].componentMapping.decisions[${decisionIndex}]`,
          evidence: decision.evidence || [],
        });
      }
    }
    if (surface.verification?.evidence) {
      output.push({ owner: `surfaces[${surfaceIndex}].verification`, evidence: surface.verification.evidence });
    }
  }
  return output;
}

function referencePath(reference) {
  if (typeof reference !== 'string') return null;
  const withoutAnchor = reference.split('#')[0].replace(/:\d+(?::\d+)?$/, '');
  if (!withoutAnchor || (!withoutAnchor.includes('/') && !/\.[A-Za-z0-9]+$/.test(withoutAnchor))) return null;
  return withoutAnchor;
}

async function reportSchemaPinDiagnostics(report, reportPath, root, pinnedSchemaPath, reportFile) {
  const reference = report?.$schema;
  if (typeof reference !== 'string' || reference.trim().length === 0) {
    return [diagnostic(
      'ADOPTION_REPORT_SCHEMA_PIN',
      reportFile,
      'The report must reference a repository-local copy of the pinned LDS adoption report schema.',
    )];
  }
  const relative = relativeRepositoryPath(reference);
  if (!relative || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(reference)) {
    return [diagnostic(
      'ADOPTION_REPORT_SCHEMA_PIN',
      reportFile,
      `Report $schema must be a safe relative path inside the consumer repository: ${reference}.`,
    )];
  }
  const resolved = path.resolve(path.dirname(reportPath), relative);
  if (!isWithin(root, resolved) || !await resolvesWithin(root, resolved) || !await exists(resolved)) {
    return [diagnostic(
      'ADOPTION_REPORT_SCHEMA_PIN',
      reportFile,
      `Report $schema does not resolve to an existing file inside the consumer repository: ${reference}.`,
    )];
  }
  const [consumerSchema, pinnedSchema] = await Promise.all([
    readFile(resolved),
    readFile(pinnedSchemaPath),
  ]);
  if (sha256(consumerSchema) !== sha256(pinnedSchema)) {
    return [diagnostic(
      'ADOPTION_REPORT_SCHEMA_PIN',
      slash(path.relative(root, resolved)),
      'The consumer report schema differs from the report schema pinned by this LDS checkout.',
    )];
  }
  return [];
}

function collectTokenNames(value, output = new Set()) {
  if (Array.isArray(value)) {
    for (const entry of value) collectTokenNames(entry, output);
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'css' && typeof entry === 'string' && /^--[A-Za-z0-9_-]+$/.test(entry)) output.add(entry);
    collectTokenNames(entry, output);
  }
  return output;
}

async function evidenceDiagnostics(report, contract, root, ldsRoot, storybookIndex, reportFile) {
  const diagnostics = [];
  const allowedTypes = contractEvidenceTypes(contract);
  let tokenNames = null;
  let storyIds = null;
  if (storybookIndex) {
    try {
      const absoluteStorybookIndex = path.resolve(root, storybookIndex);
      if (!isWithin(root, absoluteStorybookIndex)
        || !await resolvesWithin(root, absoluteStorybookIndex)) {
        throw new Error('Storybook index must resolve inside the consumer repository.');
      }
      const index = await readJson(absoluteStorybookIndex);
      storyIds = new Set(Object.keys(index.entries || index.stories || {}));
    } catch (error) {
      diagnostics.push(diagnostic('ADOPTION_STORYBOOK_INDEX', storybookIndex, error.message));
    }
  }

  for (const container of allEvidenceContainers(report)) {
    for (const evidence of container.evidence) {
      if (!allowedTypes.has(evidence?.kind)) {
        diagnostics.push(diagnostic('ADOPTION_EVIDENCE_KIND', reportFile, `${container.owner} uses unsupported evidence kind ${evidence?.kind ?? 'missing'}.`));
        continue;
      }
      if (typeof evidence.ref !== 'string' || evidence.ref.trim().length === 0) {
        diagnostics.push(diagnostic('ADOPTION_EVIDENCE_REFERENCE', reportFile, `${container.owner} has evidence without a reference.`));
        continue;
      }
      if (evidence.kind === 'story') {
        if (!storybookIndex) {
          diagnostics.push(diagnostic(
            'ADOPTION_STORYBOOK_INDEX_REQUIRED',
            reportFile,
            `${container.owner} uses story evidence, so --storybook-index is required.`,
          ));
        } else if (storyIds && !storyIds.has(evidence.ref)) {
          diagnostics.push(diagnostic('ADOPTION_STORY_MISSING', reportFile, `Story evidence ${evidence.ref} is absent from ${storybookIndex}.`));
        }
      }
      if (evidence.kind === 'token' && /^--[A-Za-z0-9_-]+$/.test(evidence.ref)) {
        if (!tokenNames) {
          try {
            tokenNames = collectTokenNames(await readJson(path.join(ldsRoot, 'tokens', 'source.json')));
          } catch (error) {
            diagnostics.push(diagnostic('ADOPTION_TOKEN_REGISTRY', reportFile, error.message));
            tokenNames = new Set();
          }
        }
        if (!tokenNames.has(evidence.ref)) {
          diagnostics.push(diagnostic(
            'ADOPTION_TOKEN_MISSING',
            reportFile,
            `${container.owner} token evidence is absent from tokens/source.json: ${evidence.ref}.`,
          ));
        }
      }
      if (['source', 'asset', 'visual', 'copy-catalog', 'check'].includes(evidence.kind)
        || (evidence.kind === 'token' && !/^--[A-Za-z0-9_-]+$/.test(evidence.ref))) {
        const candidate = referencePath(evidence.ref);
        if (!candidate) {
          diagnostics.push(diagnostic(
            'ADOPTION_EVIDENCE_REFERENCE',
            reportFile,
            `${container.owner} ${evidence.kind} evidence must reference a repository file or artifact: ${evidence.ref}.`,
          ));
          continue;
        }
        const safeCandidate = relativeRepositoryPath(candidate);
        if (!safeCandidate) {
          diagnostics.push(diagnostic('ADOPTION_EVIDENCE_PATH', reportFile, `${container.owner} uses an unsafe evidence path: ${candidate}.`));
          continue;
        }
        const inConsumer = path.resolve(root, safeCandidate);
        const inLds = path.resolve(ldsRoot, safeCandidate);
        const safeConsumer = isWithin(root, inConsumer)
          && await resolvesWithin(root, inConsumer)
          && await exists(inConsumer);
        const safeLds = isWithin(ldsRoot, inLds)
          && await resolvesWithin(ldsRoot, inLds)
          && await exists(inLds);
        if (!safeConsumer && !safeLds) {
          diagnostics.push(diagnostic('ADOPTION_EVIDENCE_MISSING', reportFile, `${container.owner} evidence does not exist: ${candidate}.`));
        } else if (evidence.sha256) {
          const absolute = safeConsumer ? inConsumer : inLds;
          const actual = sha256(await readFile(absolute));
          if (actual !== evidence.sha256) {
            diagnostics.push(diagnostic('ADOPTION_EVIDENCE_HASH', reportFile, `${container.owner} evidence hash drifted for ${candidate}.`));
          }
        }
      }
    }
  }
  return diagnostics;
}

async function exceptionDiagnostics(report, reportFile, root, now = new Date()) {
  const diagnostics = [];
  const active = new Set();
  const today = now.toISOString().slice(0, 10);
  const todayUtc = Date.parse(`${today}T00:00:00Z`);
  const maximumExpiry = new Date(todayUtc + (90 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
  for (const [index, exception] of (report.exceptions || []).entries()) {
    const location = `${reportFile}#exceptions/${index}`;
    let valid = true;
    if (typeof exception.owner !== 'string' || !exception.owner.trim()
      || typeof exception.reason !== 'string' || !exception.reason.trim()) {
      diagnostics.push(diagnostic('ADOPTION_EXCEPTION_OWNERSHIP', location, 'An exception needs a concrete owner and reason.'));
      valid = false;
    }
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(exception.expiresAt || '')
      && Number.isFinite(Date.parse(`${exception.expiresAt}T00:00:00Z`));
    if (!validDate || exception.expiresAt <= today) {
      diagnostics.push(diagnostic('ADOPTION_EXCEPTION_EXPIRED', location, `Exception expiry ${exception.expiresAt || 'missing'} is invalid or not after ${today}.`));
      valid = false;
    } else if (exception.expiresAt > maximumExpiry) {
      diagnostics.push(diagnostic(
        'ADOPTION_EXCEPTION_EXPIRY_RANGE',
        location,
        `Exception expiry ${exception.expiresAt} exceeds the 90-day maximum of ${maximumExpiry}.`,
      ));
      valid = false;
    }
    const relative = relativeRepositoryPath(exception.path);
    const absolute = relative ? path.resolve(root, relative) : null;
    if (!relative || !absolute || !isWithin(root, absolute)
      || !await resolvesWithin(root, absolute) || !await exists(absolute)) {
      diagnostics.push(diagnostic('ADOPTION_EXCEPTION_PATH', location, `Exception path does not exist: ${exception.path || 'missing'}.`));
      valid = false;
    } else if (exception.signature !== sha256(await readFile(absolute))) {
      diagnostics.push(diagnostic(
        'ADOPTION_EXCEPTION_STALE',
        location,
        `Exception signature no longer matches ${exception.path}; update or remove the exception.`,
      ));
      valid = false;
    }
    if (valid) active.add(`${exception.rule}\0${slash(relative)}`);
  }
  return { diagnostics, active };
}

const WAIVABLE_ADOPTION_RULES = new Set([
  'ADOPTION_RAW_VISUAL_LITERAL',
  'ADOPTION_STYLE_IMPORT',
]);

function applyActiveExceptions(diagnostics, active) {
  for (let index = diagnostics.length - 1; index >= 0; index -= 1) {
    const item = diagnostics[index];
    if (!WAIVABLE_ADOPTION_RULES.has(item.code)) continue;
    if (active.has(`${item.code}\0${slash(item.file)}`)) diagnostics.splice(index, 1);
  }
}

const TRIGGER_FACTS = {
  'visual-source-change': new Set(['visual-change', 'raw-visual-literal', 'component-mapping-change']),
  'layout-source-change': new Set(['layout-change']),
  'async-state-change': new Set(['loading-pattern']),
  'motion-change': new Set(['motion-change']),
  'asset-change': new Set(['asset-change', 'asset-usage']),
  'visible-copy-change': new Set(['visible-copy-change', 'internationalization-change']),
  'interactive-source-change': new Set(['interaction-change', 'accessibility-change']),
};

function activeTriggers(contract, facet, facts) {
  const definition = (contract.facets || []).find((entry) => entry.id === facet);
  return (definition?.hardTriggers || []).filter((trigger) => {
    const matchingFacts = TRIGGER_FACTS[trigger.id] || new Set();
    return [...matchingFacts].some((fact) => facts.has(fact));
  });
}

function decisionListDiagnostics(review, requiredDecisions, owner, reportFile) {
  if (review?.verdict !== 'reviewed') return [];
  const diagnostics = [];
  const decisions = Array.isArray(review.decisions) ? review.decisions : [];
  const requirements = requiredDecisions.map((requirement) => (typeof requirement === 'string'
    ? { id: requirement, label: requirement }
    : requirement));
  const counts = new Map();
  for (const decision of decisions) {
    const decisionId = decision?.decisionId;
    counts.set(decisionId, (counts.get(decisionId) || 0) + 1);
    if (typeof decision?.outcome !== 'string' || decision.outcome.trim().length < 10) {
      diagnostics.push(diagnostic(
        'ADOPTION_DECISION_OUTCOME',
        reportFile,
        `${owner} decision ${decisionId || 'missing'} needs a concrete outcome of at least 10 characters.`,
      ));
    }
    if (!Array.isArray(decision?.evidence) || decision.evidence.length === 0
      || !decision.evidence.some((entry) => entry?.kind && entry.kind !== 'decision')) {
      diagnostics.push(diagnostic(
        'ADOPTION_DECISION_EVIDENCE',
        reportFile,
        `${owner} decision ${decisionId || 'missing'} needs at least one non-decision typed evidence item.`,
      ));
    }
  }
  const missing = requirements.filter((requirement) => !counts.has(requirement.id));
  if (missing.length > 0) {
    diagnostics.push(diagnostic(
      'ADOPTION_DECISION_MISSING',
      reportFile,
      `${owner} is missing required decision outcomes: ${missing.map((entry) => `${entry.id} (${entry.label})`).join('; ')}.`,
    ));
  }
  const duplicate = requirements.filter((requirement) => (counts.get(requirement.id) || 0) > 1);
  if (duplicate.length > 0) {
    diagnostics.push(diagnostic(
      'ADOPTION_DECISION_DUPLICATE',
      reportFile,
      `${owner} repeats required decision outcomes: ${duplicate.map((entry) => entry.id).join('; ')}.`,
    ));
  }
  const requiredSet = new Set(requirements.map((requirement) => requirement.id));
  const unexpected = [...counts.keys()].filter((decisionId) => !requiredSet.has(decisionId));
  if (unexpected.length > 0) {
    diagnostics.push(diagnostic(
      'ADOPTION_DECISION_UNEXPECTED',
      reportFile,
      `${owner} records non-contract decision IDs: ${unexpected.join('; ')}.`,
    ));
  }
  return diagnostics;
}

function adoptionDecisionDiagnostics(report, contract, reportFile) {
  const diagnostics = [];
  const facetDefinitions = new Map((contract.facets || []).map((facet) => [facet.id, facet]));
  const surfaces = Array.isArray(report?.surfaces) ? report.surfaces : [];
  for (const surface of surfaces) {
    for (const facet of ADOPTION_FACETS) {
      diagnostics.push(...decisionListDiagnostics(
        surface.facets?.[facet],
        facetDefinitions.get(facet)?.requiredDecisions || [],
        `${surface.id || 'unknown-surface'}.${facet}`,
        reportFile,
      ));
    }
    diagnostics.push(...decisionListDiagnostics(
      surface.componentMapping,
      contract.componentMapping?.requiredDecisions || [],
      `${surface.id || 'unknown-surface'}.componentMapping`,
      reportFile,
    ));
  }
  return diagnostics;
}

const REPRESENTATIVE_NON_READY_STATES = new Set([
  'loading', 'empty', 'error', 'stale', 'offline', 'disabled', 'recovery',
]);

function surfaceVerificationDiagnostics(surface, reportFile) {
  const diagnostics = [];
  for (const field of ['viewportDisposition', 'themeDisposition', 'stateDisposition']) {
    const disposition = surface?.verification?.[field];
    if (typeof disposition !== 'string' || disposition.trim().length < 10) {
      diagnostics.push(diagnostic(
        'ADOPTION_VERIFICATION_DISPOSITION',
        reportFile,
        `${surface?.id || 'unknown-surface'} verification.${field} needs a concrete disposition of at least 10 characters.`,
      ));
    }
  }
  const viewports = Array.isArray(surface?.verification?.viewports) ? surface.verification.viewports : [];
  const viewportWidths = new Set(viewports
    .filter((value) => typeof value === 'string')
    .map((value) => value.split('x')[0]));
  if (viewportWidths.size < 2) {
    diagnostics.push(diagnostic(
      'ADOPTION_VIEWPORT_EVIDENCE',
      reportFile,
      `${surface?.id || 'unknown-surface'} must attest normal and narrow viewports with at least two distinct widths.`,
    ));
  }
  const themes = new Set(Array.isArray(surface?.verification?.themes) ? surface.verification.themes : []);
  const themeNotApplicable = themes.has('not-applicable');
  if ((themeNotApplicable && themes.size !== 1)
    || (!themeNotApplicable && (!themes.has('light') || !themes.has('dark')))) {
    diagnostics.push(diagnostic(
      'ADOPTION_THEME_EVIDENCE',
      reportFile,
      `${surface?.id || 'unknown-surface'} themes must be not-applicable alone, or include both light and dark.`,
    ));
  }
  const rawStates = Array.isArray(surface?.verification?.states) ? surface.verification.states : [];
  const states = new Set(rawStates
    .filter((state) => typeof state === 'string')
    .map((state) => state.trim().toLowerCase()));
  const hasRepresentativeNonReady = [...states]
    .some((state) => REPRESENTATIVE_NON_READY_STATES.has(state));
  if (!states.has('ready') || !hasRepresentativeNonReady) {
    diagnostics.push(diagnostic(
      'ADOPTION_STATE_EVIDENCE',
      reportFile,
      `${surface?.id || 'unknown-surface'} must attest ready and at least one canonical non-ready state (${[...REPRESENTATIVE_NON_READY_STATES].join(', ')}).`,
    ));
  }
  const rawEvidence = Array.isArray(surface?.verification?.evidence) ? surface.verification.evidence : [];
  const verificationKinds = new Set(rawEvidence.map((entry) => entry?.kind));
  if (!['visual', 'story', 'check'].some((kind) => verificationKinds.has(kind))) {
    diagnostics.push(diagnostic(
      'ADOPTION_VERIFICATION_EVIDENCE',
      reportFile,
      `${surface?.id || 'unknown-surface'} verification needs visual, story, or check evidence.`,
    ));
  }
  return diagnostics;
}

function adoptionVerificationDiagnostics(report, reportFile) {
  const surfaces = Array.isArray(report?.surfaces) ? report.surfaces : [];
  return surfaces.flatMap((surface) => surfaceVerificationDiagnostics(surface, reportFile));
}

const PLACEHOLDER_ATTESTATION = /(?:^|[\s_-])(?:replace(?:[\s_-]+with)?|todo|tbd|placeholder|fill[\s_-]+me)(?:$|[\s_:-])/i;
const ATTESTATION_STRING_FIELDS = new Set([
  'detail', 'outcome', 'ref', 'reason',
  'viewportDisposition', 'themeDisposition', 'stateDisposition',
]);

function placeholderAttestationDiagnostics(report, reportFile) {
  const diagnostics = [];
  const visit = (value, pointer, key) => {
    if (typeof value === 'string') {
      const inspect = ATTESTATION_STRING_FIELDS.has(key)
        || (key === 'id' && value.startsWith('replace-with-'));
      if (inspect && PLACEHOLDER_ATTESTATION.test(value)) {
        diagnostics.push(diagnostic(
          'ADOPTION_PLACEHOLDER_ATTESTATION',
          reportFile,
          `${pointer} still contains placeholder attestation text: ${value}.`,
        ));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${pointer}/${index}`, String(index)));
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [childKey, child] of Object.entries(value)) {
      visit(child, `${pointer}/${childKey}`, childKey);
    }
  };
  visit(report, '', '');
  return diagnostics;
}

function facetDiagnostics(surface, facts, contract, reportFile, ownedFiles = []) {
  const diagnostics = [];
  for (const facet of ADOPTION_FACETS) {
    const review = surface.facets?.[facet];
    if (!review) {
      diagnostics.push(diagnostic('ADOPTION_FACET_MISSING', reportFile, `${surface.id} is missing adoption facet ${facet}.`));
      continue;
    }
    const verdict = reviewVerdict(review);
    const triggers = activeTriggers(contract, facet, facts);
    if (verdict === 'blocked') {
      diagnostics.push(diagnostic('ADOPTION_BLOCKED', reportFile, `${surface.id}.${facet} remains blocked: ${review.detail || 'no detail supplied'}.`));
    }
    if (verdict === 'reviewed' && (!Array.isArray(review.evidence) || review.evidence.length === 0)) {
      diagnostics.push(diagnostic('ADOPTION_EVIDENCE_REQUIRED', reportFile, `${surface.id}.${facet} is reviewed but has no typed evidence.`));
    }
    if (verdict === 'reviewed') {
      const evidenceKinds = new Set((review.evidence || []).map((entry) => entry.kind));
      for (const trigger of triggers) {
        const missingKinds = trigger.requiredEvidenceKinds.filter((kind) => !evidenceKinds.has(kind));
        if (missingKinds.length > 0) {
          diagnostics.push(diagnostic(
            'ADOPTION_TRIGGER_EVIDENCE',
            reportFile,
            `${surface.id}.${facet} trigger ${trigger.id} requires evidence kinds: ${missingKinds.join(', ')}.`,
          ));
        }
        if (trigger.requiredEvidenceKinds.includes('source')) {
          const sourceReferences = (review.evidence || [])
            .filter((entry) => entry.kind === 'source')
            .map((entry) => referencePath(entry.ref))
            .filter(Boolean)
            .map(slash);
          if (!sourceReferences.some((reference) => ownedFiles.includes(reference))) {
            diagnostics.push(diagnostic(
              'ADOPTION_TRIGGER_SOURCE_EVIDENCE',
              reportFile,
              `${surface.id}.${facet} trigger ${trigger.id} needs source evidence for one of its analyzed files.`,
            ));
          }
        }
      }
    }
    if (verdict === 'not-applicable') {
      if (typeof review.reasonCode !== 'string' || !review.reasonCode.trim()
        || typeof review.detail !== 'string' || !review.detail.trim()) {
        diagnostics.push(diagnostic('ADOPTION_NA_REASON', reportFile, `${surface.id}.${facet} is not-applicable without reasonCode and detail.`));
      }
      if (triggers.length > 0) {
        diagnostics.push(diagnostic(
          'ADOPTION_ILLEGAL_NOT_APPLICABLE',
          reportFile,
          `${surface.id}.${facet} cannot be not-applicable because the diff activates: ${triggers.map((entry) => entry.id).join(', ')}.`,
        ));
      }
    }
  }

  const componentVerdict = reviewVerdict(surface.componentMapping);
  if (componentVerdict === 'blocked') {
    diagnostics.push(diagnostic('ADOPTION_BLOCKED', reportFile, `${surface.id}.componentMapping remains blocked.`));
  } else if (componentVerdict === 'reviewed') {
    const kinds = new Set((surface.componentMapping?.evidence || []).map((entry) => entry.kind));
    if (!kinds.has('decision')) {
      diagnostics.push(diagnostic(
        'ADOPTION_COMPONENT_MAPPING_EVIDENCE',
        reportFile,
        `${surface.id}.componentMapping needs decision evidence for the selected component/composition ownership boundary.`,
      ));
    }
  }

  return diagnostics;
}

async function styleImportDiagnostics(root, styleEntry, requiredStyleImports) {
  if (!styleEntry || requiredStyleImports.length === 0) return [];
  const absolute = path.resolve(root, styleEntry);
  if (!isWithin(root, absolute) || !await resolvesWithin(root, absolute) || !await exists(absolute)) {
    return [diagnostic('ADOPTION_STYLE_ENTRY_MISSING', styleEntry, 'The declared LDS style entry does not exist.')];
  }
  const source = await readFile(absolute, 'utf8');
  const imports = [
    ...source.matchAll(/(?:import\s+|@import\s+(?:url\()?)["']([^"']+\.css)["']\)?\s*;?/g),
  ].map((match) => match[1]);
  const relevant = imports.filter((entry) => requiredStyleImports.includes(entry));
  const exact = JSON.stringify(relevant) === JSON.stringify(requiredStyleImports)
    && requiredStyleImports.every((entry) => imports.filter((candidate) => candidate === entry).length === 1);
  return exact ? [] : [diagnostic(
    'ADOPTION_STYLE_IMPORT',
    styleEntry,
    `Expected one import each in this order: ${requiredStyleImports.join(' -> ')}.`,
  )];
}

function changedFileCoverage(report, changedFiles, reportFile) {
  const diagnostics = [];
  const owners = new Map();
  const ids = new Set();
  for (const surface of report.surfaces || []) {
    if (ids.has(surface.id)) {
      diagnostics.push(diagnostic('ADOPTION_SURFACE_ID_DUPLICATE', reportFile, `Surface id ${surface.id} is declared more than once.`));
    }
    ids.add(surface.id);
  }
  const pathGroups = [
    ['scope.paths', report.scope?.paths || []],
    ...((report.surfaces || []).map((surface) => [`surface ${surface.id}`, surface.paths || []])),
    ['scope.excluded', (report.scope?.excluded || []).map((entry) => entry.path)],
  ];
  for (const [owner, patterns] of pathGroups) {
    for (const pattern of patterns) {
      if (!pathPatternRegex(pattern)) {
        diagnostics.push(diagnostic('ADOPTION_REPORT_PATH', reportFile, `${owner} contains an unsafe repository path: ${pattern}.`));
      }
    }
  }

  for (const file of changedFiles) {
    const scopeMatches = (report.scope?.paths || []).filter((pattern) => matchesPathPattern(file, pattern));
    if (scopeMatches.length === 0) {
      diagnostics.push(diagnostic(
        'ADOPTION_SCOPE_COVERAGE',
        reportFile,
        `Changed UI file ${file} is outside report.scope.paths.`,
      ));
    }
    const exclusions = (report.scope?.excluded || []).filter((entry) => matchesPathPattern(file, entry.path));
    const surfaces = (report.surfaces || []).filter((surface) => matchesAnyPath(file, surface.paths));
    if (exclusions.length > 1 || surfaces.length > 1 || (exclusions.length > 0 && surfaces.length > 0)) {
      diagnostics.push(diagnostic(
        'ADOPTION_CHANGED_FILE_AMBIGUOUS',
        reportFile,
        `Changed UI file ${file} must resolve to exactly one surface or one declared exclusion; matched ${surfaces.length} surface(s) and ${exclusions.length} exclusion(s).`,
      ));
      continue;
    }
    if (exclusions.length === 0 && surfaces.length === 0) {
      diagnostics.push(diagnostic(
        'ADOPTION_CHANGED_FILE_COVERAGE',
        reportFile,
        `Changed UI file ${file} is not owned by any report surface or declared exclusion.`,
      ));
      continue;
    }
    if (surfaces.length === 1) owners.set(file, surfaces[0]);
  }
  return { diagnostics, owners };
}

function sortedDiagnostics(diagnostics) {
  return diagnostics.sort((left, right) => left.code.localeCompare(right.code)
    || left.file.localeCompare(right.file)
    || (left.line || 0) - (right.line || 0)
    || left.message.localeCompare(right.message));
}

async function writeCheckResult(root, outputPath, result) {
  if (!outputPath) return;
  const absolute = path.resolve(root, outputPath);
  if (!isWithin(root, absolute) || !await resolvesWithin(root, absolute)) {
    throw new Error('Adoption check output must resolve inside the consumer repository.');
  }
  try {
    const current = await lstat(absolute);
    if (!current.isFile() || current.isSymbolicLink()) {
      throw new Error('Adoption check output must not be a directory, symbolic link, or reparse point.');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(path.dirname(absolute), { recursive: true });
  const temporary = path.join(
    path.dirname(absolute),
    `.${path.basename(absolute)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporary, `${JSON.stringify(result, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporary, absolute);
  } finally {
    await rm(temporary, { force: true });
  }
}

/**
 * Check a consumer adoption report against the actual changed UI lines. The
 * report supplies human decisions for semantic quality; deterministic facts
 * make it impossible to silently mark an affected facet not-applicable.
 */
export async function runAdoptionCheck(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const ldsRoot = path.resolve(options.ldsRoot || process.cwd());
  const requestedConfigPath = options.configPath || DEFAULT_CONFIG;
  const base = options.base || null;
  const head = options.head || 'HEAD';
  const loadedConfig = await loadAdoptionConfig(root, requestedConfigPath);
  const diagnostics = [...loadedConfig.diagnostics];
  const baselineConfig = base
    ? await loadAdoptionConfigAtRef(root, loadedConfig.configFile, base)
    : null;
  if (baselineConfig) diagnostics.push(...baselineConfig.diagnostics);
  if (baselineConfig?.config && loadedConfig.config && loadedConfig.diagnostics.length === 0
    && canonicalJson(baselineConfig.config) !== canonicalJson(loadedConfig.config)) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONFIG_CHANGED',
      loadedConfig.configFile,
      'The adoption config differs from the base revision. Scan roots, exclusions, style ownership, and report location cannot be self-modified by the UI change under review.',
    ));
  }
  const config = baselineConfig?.config || loadedConfig.config;
  const configuredReportDirectory = config?.reportDirectory || '.lds';
  const reportCandidate = options.reportPath || path.join(configuredReportDirectory, DEFAULT_REPORT_NAME);
  const reportPath = path.resolve(root, reportCandidate);
  const reportFile = slash(path.relative(root, reportPath));
  let range = base ? diffRange(base, head) : null;
  let report = null;
  let changedFiles = [];
  let allFacts = new Set();
  let surfaceFacts = [];
  let verified = null;

  const finish = async () => {
    const finalDiagnostics = sortedDiagnostics(diagnostics);
    const result = {
      schemaVersion: 1,
      kind: 'lds-ui-adoption-check-result',
      passed: !finalDiagnostics.some((entry) => entry.severity === 'error'),
      contract: verified ? {
        id: verified.contract.kind,
        version: verified.contract.contractVersion,
        sha256: sha256(JSON.stringify(verified.contract)),
      } : null,
      config: config ? {
        file: loadedConfig.configFile,
        repository: config.repository,
      } : { file: loadedConfig.configFile },
      target: { root: slash(root), base, head, range, scopeMode: report?.scope?.mode || null },
      changedFiles,
      facts: [...allFacts].sort(),
      surfaces: surfaceFacts,
      diagnostics: finalDiagnostics,
    };
    await writeCheckResult(root, options.outputPath, result);
    return { ...result, report };
  };

  if (!isWithin(root, reportPath) || !await resolvesWithin(root, reportPath)) {
    diagnostics.push(diagnostic('ADOPTION_REPORT_PATH', reportFile, 'The adoption report must be inside the consumer repository.'));
  } else if (config) {
    const reportDirectory = path.resolve(root, config.reportDirectory);
    if (!isWithin(reportDirectory, reportPath)) {
      diagnostics.push(diagnostic(
        'ADOPTION_REPORT_LOCATION',
        reportFile,
        `The adoption report must be inside configured reportDirectory ${config.reportDirectory}.`,
      ));
    }
  }

  try {
    verified = await verifyAdoptionContract({
      ldsRoot,
      contractPath: options.contractPath,
      contractSchemaPath: options.contractSchemaPath,
      reportSchemaPath: options.reportSchemaPath,
    });
    diagnostics.push(...verified.diagnostics);
  } catch (error) {
    diagnostics.push(diagnostic('ADOPTION_CONTRACT_READ', reportFile, error.message));
    return finish();
  }
  if (diagnostics.some((entry) => entry.severity === 'error')) {
    return finish();
  }
  if (!base) {
    diagnostics.push(diagnostic('ADOPTION_DIFF_BASE', reportFile, 'A git diff base must be supplied with --base.'));
    return finish();
  }
  if (baselineConfig?.missing) {
    range = diffRange(base, head);
    let bootstrapChanges;
    try {
      bootstrapChanges = parseNameStatus(await git(root, [
        'diff', '--name-status', '-z', '--find-renames', '--diff-filter=ACMR', range,
      ]));
    } catch (error) {
      diagnostics.push(diagnostic('ADOPTION_GIT_DIFF', reportFile, error.stderr?.trim() || error.message));
      return finish();
    }
    const bootstrapUiFiles = bootstrapChanges
      .map((change) => change.file)
      .filter((file) => isUiFile(file) && !excludedPath(file));
    if (bootstrapUiFiles.length > 0) {
      diagnostics.push(diagnostic(
        'ADOPTION_CONFIG_BOOTSTRAP_UI',
        loadedConfig.configFile,
        `A first adoption config must land without UI changes. Move these files to a later reviewed change: ${bootstrapUiFiles.join(', ')}.`,
      ));
      return finish();
    }
    const bootstrapStyleImports = options.requiredStyleImports?.length
      ? options.requiredStyleImports
      : config?.requiredStyleImports || [];
    diagnostics.push(...await styleImportDiagnostics(
      root,
      options.styleEntry || config?.styleEntry,
      bootstrapStyleImports,
    ));
    return finish();
  }

  try {
    report = await readJson(reportPath);
  } catch (error) {
    diagnostics.push(diagnostic('ADOPTION_REPORT_READ', reportFile, error.message));
    return finish();
  }
  diagnostics.push(...await reportSchemaPinDiagnostics(
    report,
    reportPath,
    root,
    verified.paths.reportSchemaPath,
    reportFile,
  ));
  const validateReport = strictValidator(verified.reportSchema);
  const decisionDiagnostics = adoptionDecisionDiagnostics(report, verified.contract, reportFile);
  const verificationDiagnostics = adoptionVerificationDiagnostics(report, reportFile);
  const placeholderDiagnostics = placeholderAttestationDiagnostics(report, reportFile);
  if (!validateReport(report)) {
    diagnostics.push(...schemaDiagnostics(validateReport, reportFile, 'ADOPTION_REPORT_SCHEMA'));
    diagnostics.push(...decisionDiagnostics);
    diagnostics.push(...verificationDiagnostics);
    diagnostics.push(...placeholderDiagnostics);
    return finish();
  }
  diagnostics.push(...decisionDiagnostics);
  diagnostics.push(...verificationDiagnostics);
  diagnostics.push(...placeholderDiagnostics);
  if (report.contractVersion !== verified.contract.contractVersion) {
    diagnostics.push(diagnostic(
      'ADOPTION_CONTRACT_VERSION',
      reportFile,
      `Report targets contract version ${report.contractVersion}; expected ${verified.contract.contractVersion}.`,
    ));
  }
  range = diffRange(base, head);
  let changes;
  try {
    changes = parseNameStatus(await git(root, [
      'diff', '--name-status', '-z', '--find-renames', '--diff-filter=ACMR', range,
    ]));
  } catch (error) {
    diagnostics.push(diagnostic('ADOPTION_GIT_DIFF', reportFile, error.stderr?.trim() || error.message));
    return finish();
  }

  const uiRoots = config?.uiRoots || [];
  const extraExclusions = [
    ...(config?.excludedPaths || []),
    ...(options.exclusions || []),
  ];
  const fullSurface = report.scope.mode === 'full-surface';
  const analysisEntriesByFile = new Map();
  if (fullSurface) {
    for (const file of (await collectRepositoryUiFiles(root))
      .filter((candidate) => matchesAnyPath(candidate, report.scope.paths || []))) {
      analysisEntriesByFile.set(file, { file, fullSurface: true });
    }
  }
  // Even in full-surface mode, changed UI outside the declared report scope
  // must reach coverage diagnostics instead of disappearing before ownership
  // is checked. Files already selected for full inspection keep full-line mode.
  for (const change of changes) {
    if (!analysisEntriesByFile.has(change.file)) {
      analysisEntriesByFile.set(change.file, { ...change, fullSurface: false });
    }
  }
  const analysisEntries = [...analysisEntriesByFile.values()];
  const relevant = [];
  const factsByFile = new Map();
  const rawFindings = [];
  for (const entry of analysisEntries) {
    if (!isUiFile(entry.file)
      || !matchesAnyPath(entry.file, uiRoots)
      || excludedPath(entry.file, extraExclusions)) continue;
    if (isAssetFile(entry.file)) {
      relevant.push(entry.file);
      factsByFile.set(entry.file, new Set(['asset-change']));
      continue;
    }
    if (!isTextUiFile(entry.file)) continue;
    const absolute = path.resolve(root, entry.file);
    if (!await resolvesWithin(root, absolute)) {
      diagnostics.push(diagnostic(
        'ADOPTION_UI_PATH_ESCAPE',
        entry.file,
        'Analyzed UI path resolves outside the consumer repository or through a broken link.',
      ));
      continue;
    }
    if (!await exists(absolute)) continue;
    const source = await readFile(absolute, 'utf8');
    const lineNumbers = entry.fullSurface
      ? new Set(source.split(/\r?\n/).map((_, index) => index + 1))
      : await changedLineNumbers(root, range, entry.file);
    const lines = relevantChangedLines(source, lineNumbers);
    // A comment-only change has no adoption surface and cannot force a report.
    if (lines.length === 0) continue;
    relevant.push(entry.file);
    const fileFacts = createFacts(entry.file, lines, false);
    for (const finding of rawVisualFindings(entry.file, lines)) {
      rawFindings.push({ file: entry.file, ...finding });
      fileFacts.add('raw-visual-literal');
    }
    factsByFile.set(entry.file, fileFacts);
  }

  changedFiles = [...new Set(relevant)].sort();
  for (const facts of factsByFile.values()) for (const fact of facts) allFacts.add(fact);
  const coverage = changedFileCoverage(report, changedFiles, reportFile);
  diagnostics.push(...coverage.diagnostics);
  for (const finding of rawFindings.filter((entry) => coverage.owners.has(entry.file))) {
    diagnostics.push(diagnostic(
      'ADOPTION_RAW_VISUAL_LITERAL',
      finding.file,
      `Analyzed UI code contains raw visual value ${finding.value}; resolve it through an LDS or reviewed product token.`,
      finding.line,
    ));
  }

  const factsBySurface = new Map((report.surfaces || []).map((surface) => [surface, new Set()]));
  for (const [file, surface] of coverage.owners) {
    for (const fact of factsByFile.get(file) || []) factsBySurface.get(surface).add(fact);
  }
  for (const surface of report.surfaces || []) {
    const facts = factsBySurface.get(surface) || new Set();
    const ownedFiles = [...coverage.owners.entries()]
      .filter(([, owner]) => owner === surface)
      .map(([file]) => file);
    diagnostics.push(...facetDiagnostics(surface, facts, verified.contract, reportFile, ownedFiles));
  }
  surfaceFacts = (report.surfaces || []).map((surface) => ({
    id: surface.id,
    files: [...coverage.owners.entries()]
      .filter(([, owner]) => owner === surface)
      .map(([file]) => file)
      .sort(),
    facts: [...(factsBySurface.get(surface) || [])].sort(),
  }));

  const exceptions = await exceptionDiagnostics(report, reportFile, root, options.now);
  diagnostics.push(...exceptions.diagnostics);
  diagnostics.push(...await evidenceDiagnostics(
    report,
    verified.contract,
    root,
    ldsRoot,
    options.storybookIndex,
    reportFile,
  ));

  const requiredStyleImports = (options.requiredStyleImports?.length
    ? options.requiredStyleImports
    : config?.requiredStyleImports || [])
    .filter(Boolean);
  const styleEntry = options.styleEntry || config?.styleEntry;
  diagnostics.push(...await styleImportDiagnostics(root, styleEntry, requiredStyleImports));
  applyActiveExceptions(diagnostics, exceptions.active);
  return finish();
}

export function printAdoptionDiagnostics(diagnostics) {
  for (const item of diagnostics) {
    const location = item.line ? `${item.file}:${item.line}` : item.file;
    console.error(`[${item.code}] ${location} ${item.message}`);
  }
}

async function applyAdoptionFixtureMutation(root, fixturesRoot, mutation) {
  const target = path.resolve(root, mutation.file);
  if (!isWithin(root, target)) throw new Error(`Unsafe fixture mutation path: ${mutation.file}.`);
  if (mutation.delete) {
    await rm(target, { force: true });
    return;
  }
  await mkdir(path.dirname(target), { recursive: true });
  if (mutation.copyFrom) {
    const source = path.resolve(fixturesRoot, mutation.copyFrom);
    if (!isWithin(fixturesRoot, source)) throw new Error(`Unsafe fixture source path: ${mutation.copyFrom}.`);
    await cp(source, target);
    return;
  }
  if (mutation.write != null) {
    await writeFile(target, mutation.write, 'utf8');
    return;
  }
  const source = await readFile(target, 'utf8');
  if (mutation.append != null) {
    await writeFile(target, `${source}${mutation.append}`, 'utf8');
    return;
  }
  if (mutation.replace != null) {
    if (!source.includes(mutation.replace)) {
      throw new Error(`Fixture mutation did not find ${mutation.replace} in ${mutation.file}.`);
    }
    await writeFile(target, source.replace(mutation.replace, mutation.with ?? ''), 'utf8');
  }
}

async function hydrateFixtureSignatures(root, reportPath) {
  let source = await readFile(reportPath, 'utf8');
  const placeholders = [...source.matchAll(/AUTO_SHA256:([^"\s]+)/g)];
  for (const placeholder of placeholders) {
    const relative = relativeRepositoryPath(placeholder[1]);
    if (!relative) throw new Error(`Unsafe fixture signature path: ${placeholder[1]}.`);
    const signature = sha256(await readFile(path.resolve(root, relative)));
    source = source.replace(placeholder[0], signature);
  }
  await writeFile(reportPath, source, 'utf8');
}

async function verifyAdoptionActionGuards(ldsRoot) {
  const actionPath = path.join(ldsRoot, '.github', 'actions', 'lds-adoption', 'action.yml');
  const source = await readFile(actionPath, 'utf8');
  const requiredGuards = [
    ['CR input rejection', '$value.IndexOf("`r")'],
    ['LF input rejection', '$value.IndexOf("`n")'],
    ['NUL input rejection', '$value.IndexOf([char] 0)'],
    ['artifact allowlist', "$artifactName -notmatch '^[A-Za-z0-9._-]{1,120}$'"],
    ['result leaf inspection', 'Get-Item -Force -LiteralPath $result'],
    ['link and junction traversal rejection', 'Assert-NoLinkTraversal'],
    ['reparse-point detection', '[System.IO.FileAttributes]::ReparsePoint'],
    ['consumer-root link guard', 'Assert-NoLinkTraversal $workspaceRoot $consumerRoot'],
    ['result-path link guard', 'Assert-NoLinkTraversal $consumerRoot $result'],
  ];
  for (const inputName of [
    'root', 'output', 'artifact-name', 'config', 'report', 'base', 'head', 'storybook-index',
  ]) {
    requiredGuards.push([`${inputName} input validation`, `"${inputName}" = $env:`]);
  }
  const missing = requiredGuards
    .filter(([, marker]) => !source.includes(marker))
    .map(([label]) => label);
  if (missing.length > 0) {
    throw new Error(`LDS adoption action is missing static input guards: ${missing.join(', ')}.`);
  }
  console.log('Adoption fixture action-input-and-overwrite-guards: pass');
}

async function verifyRealPathContainmentFixture(temporaryRoot) {
  const consumer = path.join(temporaryRoot, 'realpath-consumer');
  const outside = path.join(temporaryRoot, 'realpath-outside');
  await Promise.all([
    mkdir(consumer, { recursive: true }),
    mkdir(outside, { recursive: true }),
  ]);
  const linkedArtifacts = path.join(consumer, 'visual-artifacts');
  await symlink(outside, linkedArtifacts, process.platform === 'win32' ? 'junction' : 'dir');
  const escapedResult = path.join(linkedArtifacts, 'adoption', 'check-result.json');
  if (await resolvesWithin(consumer, escapedResult)) {
    throw new Error('Real-path containment accepted an output beneath an escaping link or junction.');
  }
  console.log('Adoption fixture realpath-link-escape: pass (escape rejected)');
}

/**
 * Execute positive and negative adoption fixtures in real temporary git
 * repositories. Using actual commits keeps changed-line parsing and rename
 * behavior under test rather than mocking the most important boundary.
 */
export async function verifyAdoptionFixtures(options = {}) {
  const fixturesRoot = path.resolve(options.fixturesRoot || path.join(packageDirectory, 'fixtures', 'adoption'));
  const suite = await readJson(path.join(fixturesRoot, 'cases.json'));
  const ldsRoot = path.resolve(options.ldsRoot || path.resolve(packageDirectory, '..', '..'));
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'lds-adoption-'));
  try {
    for (const fixture of suite.cases) {
      const caseRoot = path.join(temporaryRoot, fixture.name);
      await cp(path.join(fixturesRoot, 'consumer'), caseRoot, { recursive: true });
      await cp(
        path.join(ldsRoot, DEFAULT_REPORT_SCHEMA),
        path.join(caseRoot, '.lds', 'LDS_UI_ADOPTION_REPORT.schema.json'),
      );
      if (fixture.bootstrapConfig) {
        await rm(path.join(caseRoot, '.lds'), { recursive: true, force: true });
      }
      await git(caseRoot, ['init', '--quiet']);
      await git(caseRoot, ['config', 'user.email', 'lds-conformance@example.invalid']);
      await git(caseRoot, ['config', 'user.name', 'LDS conformance fixture']);
      await git(caseRoot, ['add', '--all']);
      await git(caseRoot, ['commit', '--quiet', '-m', 'base']);
      const base = (await git(caseRoot, ['rev-parse', 'HEAD'])).trim();

      if (fixture.bootstrapConfig) {
        await cp(path.join(fixturesRoot, 'consumer', '.lds'), path.join(caseRoot, '.lds'), { recursive: true });
        await cp(
          path.join(ldsRoot, DEFAULT_REPORT_SCHEMA),
          path.join(caseRoot, '.lds', 'LDS_UI_ADOPTION_REPORT.schema.json'),
        );
      }

      if (fixture.applyCommon !== false) {
        for (const mutation of suite.commonMutations || []) {
          await applyAdoptionFixtureMutation(caseRoot, fixturesRoot, mutation);
        }
      }
      for (const mutation of fixture.mutations || []) {
        await applyAdoptionFixtureMutation(caseRoot, fixturesRoot, mutation);
      }
      await hydrateFixtureSignatures(caseRoot, path.join(caseRoot, '.lds', 'adoption-report.json'));
      await git(caseRoot, ['add', '--all']);
      await git(caseRoot, ['commit', '--quiet', '--allow-empty', '-m', fixture.name]);
      const head = (await git(caseRoot, ['rev-parse', 'HEAD'])).trim();

      const result = await runAdoptionCheck({
        root: caseRoot,
        ldsRoot,
        configPath: '.lds/adoption.config.json',
        reportPath: '.lds/adoption-report.json',
        base,
        head,
        storybookIndex: fixture.omitStorybookIndex ? null : 'evidence/storybook-index.json',
        now: new Date(suite.now),
      });
      const actual = [...new Set(result.diagnostics.map((entry) => entry.code))].sort();
      const expected = [...fixture.expectedCodes].sort();
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        printAdoptionDiagnostics(result.diagnostics);
        throw new Error(`Adoption fixture ${fixture.name} expected ${expected.join(', ') || 'pass'} but received ${actual.join(', ') || 'pass'}.`);
      }
      if (fixture.exerciseCli) {
        const output = '.lds/adoption-check-result.json';
        const cliArguments = [
          path.join(moduleDirectory, 'cli.mjs'),
          'check-adoption',
          '--root', caseRoot,
          '--lds-root', ldsRoot,
          '--config', '.lds/adoption.config.json',
          '--report', '.lds/adoption-report.json',
          '--base', base,
          '--head', head,
          '--storybook-index', 'evidence/storybook-index.json',
          '--output', output,
        ];
        await execFileAsync(process.execPath, cliArguments, { cwd: caseRoot, encoding: 'utf8' });
        // A regular prior result is atomically replaceable; only links,
        // reparse points, directories, and escaping ancestors are rejected.
        await execFileAsync(process.execPath, cliArguments, { cwd: caseRoot, encoding: 'utf8' });
        const cliResult = await readJson(path.join(caseRoot, output));
        if (!cliResult.passed || cliResult.kind !== 'lds-ui-adoption-check-result') {
          throw new Error(`Adoption fixture ${fixture.name} did not produce a passing CLI result.`);
        }
      }
      console.log(`Adoption fixture ${fixture.name}: ${expected.join(', ') || 'pass'}`);
    }
    await verifyAdoptionActionGuards(ldsRoot);
    await verifyRealPathContainmentFixture(temporaryRoot);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}
