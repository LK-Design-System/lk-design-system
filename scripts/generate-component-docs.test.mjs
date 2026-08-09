import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const generatorPath = path.join(root, 'scripts', 'generate-component-docs.mjs');
const allowedGuideFields = [
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

const dashboardNavigation = {
  story: 'stories/NavigationDashboard.stories.jsx',
  slug: 'product-navigation-dashboard-navigation',
  title: 'Dashboard Navigation',
};
const dashboardShell = {
  story: 'stories/LayoutDashboardShell.stories.jsx',
  slug: 'product-operations-dashboard-dashboard-shell',
  title: 'LDS Product/Operations Dashboard/Dashboard Shell',
};
const actionArea = {
  story: 'stories/ActionArea.stories.jsx',
  slug: 'core-components-action-action-area',
};

async function copyFixture(relativePath, workspace) {
  await cp(path.join(root, relativePath), path.join(workspace, relativePath), {
    recursive: true,
  });
}

async function createWorkspace(t) {
  const temporaryRoot = path.join(root, 'tmp');
  await mkdir(temporaryRoot, { recursive: true });
  const workspace = await mkdtemp(path.join(temporaryRoot, 'component-docs-test-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));

  await Promise.all([
    copyFixture('components', workspace),
    copyFixture('src', workspace),
    copyFixture('stories', workspace),
    copyFixture('tokens', workspace),
    copyFixture('scripts/generate-component-docs.mjs', workspace),
    copyFixture('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json', workspace),
    copyFixture('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json', workspace),
  ]);
  return workspace;
}

async function addStoryGuideFields(workspace, storyPath, fields) {
  const absolutePath = path.join(workspace, storyPath);
  let source = await readFile(absolutePath, 'utf8');
  const marker = 'storyGuide: {';
  assert.ok(source.includes(marker), `${storyPath} must contain parameters.storyGuide`);
  for (const name of Object.keys(fields)) {
    source = source.replace(new RegExp(`^[\\t ]+${name}:.*\\r?\\n`, 'm'), '');
  }
  const declarations = Object.entries(fields)
    .map(([name, value]) => `      ${name}: ${JSON.stringify(value)},`)
    .join('\n');
  const firstReserved = source.search(
    /^[\t ]+(?:omitGuideFields|canonicalGuide|guideDeltaFields):/m,
  );
  const updated = firstReserved >= 0
    ? `${source.slice(0, firstReserved)}${declarations}\n${source.slice(firstReserved)}`
    : source.replace(marker, `${marker}\n${declarations}`);
  await writeFile(
    absolutePath,
    updated,
  );
}

async function addRawStoryGuideDeclarations(workspace, storyPath, declarations) {
  const absolutePath = path.join(workspace, storyPath);
  const source = await readFile(absolutePath, 'utf8');
  const marker = 'storyGuide: {';
  assert.ok(source.includes(marker), `${storyPath} must contain parameters.storyGuide`);
  await writeFile(
    absolutePath,
    source.replace(marker, `${marker}\n${declarations}`),
  );
}

async function replaceStoryGuideDescription(workspace, storyPath, description) {
  const absolutePath = path.join(workspace, storyPath);
  const source = await readFile(absolutePath, 'utf8');
  const storyGuideStart = source.indexOf('storyGuide: {');
  assert.notEqual(storyGuideStart, -1, `${storyPath} must contain parameters.storyGuide`);
  const descriptionMatch = source.slice(storyGuideStart).match(
    /description:\s*(?:\r?\n\s*)?'[^']*'/,
  );
  assert.ok(descriptionMatch, `${storyPath} must contain storyGuide.description`);
  const start = storyGuideStart + descriptionMatch.index;
  const replacement = `description: ${JSON.stringify(description)}`;
  await writeFile(
    absolutePath,
    `${source.slice(0, start)}${replacement}${source.slice(start + descriptionMatch[0].length)}`,
  );
}

async function makeActionAreaADashboardOwner(workspace) {
  const auditPath = path.join(
    workspace,
    'docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json',
  );
  const audit = JSON.parse(await readFile(auditPath, 'utf8'));
  const page = audit.pages.find(({ importPath }) => importPath === `./${actionArea.story}`);
  page.primaryOwner = 'DashboardShell';
  page.ownerComponents = ['DashboardShell'];
  await writeFile(auditPath, `${JSON.stringify(audit, null, 2)}\n`);

  const classificationPath = path.join(
    workspace,
    'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json',
  );
  const classification = JSON.parse(await readFile(classificationPath, 'utf8'));
  const group = classification.groups.find(({ exports }) => exports.includes('DashboardShell'));
  group.storyEvidence = [...new Set([...(group.storyEvidence || []), actionArea.story])];
  await writeFile(classificationPath, `${JSON.stringify(classification, null, 2)}\n`);
}

async function runGenerator(workspace) {
  try {
    const result = await execFileAsync(process.execPath, ['scripts/generate-component-docs.mjs'], {
      cwd: workspace,
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024,
      timeout: 30_000,
    });
    return { ok: true, output: `${result.stdout}${result.stderr}` };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout || ''}${error.stderr || ''}${error.message || ''}`,
    };
  }
}

async function generatedRegistry(workspace) {
  return JSON.parse(
    await readFile(path.join(workspace, 'docs/components/component-content.json'), 'utf8'),
  );
}

function guideBySlug(registry, slug) {
  const guide = registry.guides.find((candidate) => candidate.slug === slug);
  assert.ok(guide, `expected generated guide ${slug}`);
  return guide;
}

async function generatedTreeDigest(directory) {
  const hash = createHash('sha256');
  async function visit(current, relative = '') {
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const childRelative = path.join(relative, entry.name);
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(child, childRelative);
      } else {
        hash.update(childRelative.replaceAll(path.sep, '/'));
        hash.update(await readFile(child));
      }
    }
  }
  await visit(directory);
  return hash.digest('hex');
}

async function expectRejected(t, configure, expectedMessage) {
  const workspace = await createWorkspace(t);
  await configure(workspace);
  const result = await runGenerator(workspace);
  assert.equal(result.ok, false, `generator unexpectedly succeeded:\n${result.output}`);
  assert.match(result.output, expectedMessage);
}

test('preserves established Card and header evidence when density guide limits expand', async (t) => {
  const workspace = await createWorkspace(t);
  const result = await runGenerator(workspace);
  assert.equal(result.ok, true, result.output);

  const registry = await generatedRegistry(workspace);
  const card = guideBySlug(registry, 'core-components-content-card');
  const featureCard = guideBySlug(registry, 'product-content-feature-card');
  const recordHeader = guideBySlug(registry, 'product-content-record-header');

  assert.ok(card.properties.some(({ name }) => name === 'density'));
  assert.ok(card.properties.some(({ name }) => name === 'bottomContent'));
  assert.ok(card.quantitativeRules.some(({ rule }) => rule.includes('SaveButton(save)')));
  assert.ok(card.quantitativeRules.some(({ rule }) => rule.startsWith('Card —')));
  assert.ok(card.responsive.some((rule) => rule.startsWith('vars accepts only')));
  assert.ok(featureCard.quantitativeRules.some(({ subject }) => subject === '--color-semantic-accent-foreground-blue'));
  assert.ok(recordHeader.quantitativeRules.some(({ subject }) => subject === '--color-semantic-label-normal'));
});

test('emits normalized author omissions and an evidence-only section status', async (t) => {
  const workspace = await createWorkspace(t);
  await addStoryGuideFields(workspace, 'stories/Button.stories.jsx', {
    omitGuideFields: ' migration, , exceptions, ',
  });

  const result = await runGenerator(workspace);
  assert.equal(result.ok, true, result.output);
  const registry = await generatedRegistry(workspace);
  const button = guideBySlug(registry, 'core-components-action-button');

  assert.equal(button.canonicalGuide, null);
  assert.deepEqual(button.guideDeltaFields, []);
  assert.deepEqual(Object.keys(button.sectionStatus), allowedGuideFields);
  assert.equal(button.sectionStatus.migration, 'omitted-by-author');
  assert.equal(button.sectionStatus.exceptions, 'omitted-by-author');
  assert.deepEqual(button.migration, []);
  assert.deepEqual(button.exceptions, []);
  assert.ok(
    registry.guides.some((guide) =>
      Object.entries(guide.sectionStatus).some(
        ([field, status]) => status === 'omitted-no-evidence'
          && (Array.isArray(guide[field]) ? guide[field].length === 0 : guide[field] === ''),
      )),
    'at least one generated field without source evidence must be omitted',
  );
  assert.ok(
    registry.entries.some((entry) => entry.props.some((prop) => prop.description === '')),
    'a prop without JSDoc must retain an empty description',
  );
  for (const guide of registry.guides) {
    const sourceDescriptions = new Set(
      registry.entries
        .filter((entry) => guide.ownerComponents.includes(entry.title))
        .flatMap((entry) => entry.props.map((prop) => prop.description))
        .filter(Boolean),
    );
    for (const { rule } of [...guide.anatomy, ...guide.states]) {
      assert.ok(
        sourceDescriptions.has(rule),
        `${guide.slug} anatomy/state rule must be direct JSDoc evidence: ${rule}`,
      );
    }
  }
});

test('emits a trimmed canonical reference and preserves normalized delta order', async (t) => {
  const workspace = await createWorkspace(t);
  await addStoryGuideFields(workspace, dashboardShell.story, {
    canonicalGuide: `  ${dashboardNavigation.slug}  `,
    guideDeltaFields: ' apiLinks, , purpose, ',
  });

  const result = await runGenerator(workspace);
  assert.equal(result.ok, true, result.output);
  const registry = await generatedRegistry(workspace);
  const delta = guideBySlug(registry, dashboardShell.slug);

  assert.deepEqual(delta.canonicalGuide, {
    slug: dashboardNavigation.slug,
    title: dashboardNavigation.title,
    storybookDocsId: 'lds-product-navigation-dashboard-navigation--docs',
  });
  assert.deepEqual(delta.guideDeltaFields, ['apiLinks', 'purpose']);
  assert.equal(delta.sectionStatus.apiLinks, 'evidence');
  assert.equal(delta.sectionStatus.purpose, 'evidence');
  for (const field of allowedGuideFields.filter(
    (field) => !delta.guideDeltaFields.includes(field),
  )) {
    assert.equal(delta.sectionStatus[field], 'canonical-reference', field);
  }
});

test('does not copy canonical section content into delta runtime or Markdown', async (t) => {
  const workspace = await createWorkspace(t);
  await addStoryGuideFields(workspace, dashboardShell.story, {
    canonicalGuide: dashboardNavigation.slug,
    guideDeltaFields: 'purpose',
  });

  const result = await runGenerator(workspace);
  assert.equal(result.ok, true, result.output);
  const registry = await generatedRegistry(workspace);
  const canonical = guideBySlug(registry, dashboardNavigation.slug);
  const delta = guideBySlug(registry, dashboardShell.slug);
  const runtime = await readFile(
    path.join(workspace, `docs/components/runtime/${dashboardShell.slug}.json`),
    'utf8',
  );
  const markdown = await readFile(
    path.join(workspace, `docs/components/guides/${dashboardShell.slug}.md`),
    'utf8',
  );

  assert.deepEqual(delta.behavior, []);
  assert.ok(canonical.behavior.length > 0);
  assert.equal(runtime.includes(canonical.behavior[0]), false);
  assert.equal(markdown.includes(canonical.behavior[0]), false);
  assert.equal(
    markdown.split(`[reference](${dashboardNavigation.slug}.md)`).length - 1,
    1,
    'a delta guide must render exactly one direct canonical callout',
  );
});

test('canonical delta purpose does not repeat its avoid evidence', async (t) => {
  const workspace = await createWorkspace(t);
  const result = await runGenerator(workspace);
  assert.equal(result.ok, true, result.output);

  const registry = await generatedRegistry(workspace);
  const brandSpinner = guideBySlug(registry, 'theme-status-brand-spinner');
  const positivePurpose = '브랜드 진입점이나 제품 전환처럼 출처를 함께 강조하는 짧은 대기에 적합합니다.';
  const avoidRule = '일반 콘텐츠 로딩·버튼 진행 상태에는 사용하지 않고 LDS Core의 기본 Spinner 또는 Loading State를 사용하세요.';
  const markdown = await readFile(
    path.join(workspace, 'docs/components/guides/theme-status-brand-spinner.md'),
    'utf8',
  );

  assert.equal(brandSpinner.purpose, positivePurpose);
  assert.deepEqual(brandSpinner.avoidWhen, [avoidRule]);
  assert.equal(
    markdown.split(avoidRule).length - 1,
    1,
    'Brand Spinner avoid evidence must appear only in the decision section.',
  );
});

test('rejects a canonical purpose delta with only avoid-oriented description evidence', async (t) => {
  await expectRejected(
    t,
    async (workspace) => {
      await replaceStoryGuideDescription(
        workspace,
        dashboardShell.story,
        '이 표면에는 사용하지 말고 더 단순한 패턴을 대신 사용하세요.',
      );
    },
    /purpose.*source evidence/i,
  );
});

test('generates byte-identical output on repeated runs', async (t) => {
  const workspace = await createWorkspace(t);
  await addStoryGuideFields(workspace, dashboardShell.story, {
    canonicalGuide: dashboardNavigation.slug,
    guideDeltaFields: 'purpose',
  });

  const first = await runGenerator(workspace);
  assert.equal(first.ok, true, first.output);
  const firstDigest = await generatedTreeDigest(path.join(workspace, 'docs/components'));
  const second = await runGenerator(workspace);
  assert.equal(second.ok, true, second.output);
  const secondDigest = await generatedTreeDigest(path.join(workspace, 'docs/components'));
  assert.equal(secondDigest, firstDigest);
});

test('rejects a duplicate normalized guide field', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, 'stories/Button.stories.jsx', {
      omitGuideFields: ' migration, migration ',
    }),
    /(?:duplicate.*migration|migration.*duplicate)/i,
  );
});

test('rejects unsupported reserved metadata value syntax', async (t) => {
  const cases = [
    ['identifier', '      omitGuideFields: reservedFields,'],
    ['array', "      omitGuideFields: ['migration'],"],
    ['object', "      omitGuideFields: { field: 'migration' },"],
    ['template expression', '      omitGuideFields: `migration, ${extraField}`,'],
  ];
  for (const [label, declaration] of cases) {
    await t.test(label, async (subtest) => {
      await expectRejected(
        subtest,
        (workspace) => addRawStoryGuideDeclarations(
          workspace,
          'stories/Button.stories.jsx',
          declaration,
        ),
        /omitGuideFields.*string literal/i,
      );
    });
  }
});

test('rejects spread, separated, and duplicate reserved metadata', async (t) => {
  const cases = [
    ['spread', '      ...reservedMetadata,', /does not support spread/i],
    [
      'separated',
      "      omitGuideFields: 'migration',\n      note: 'separator',\n      canonicalGuide: 'some-guide',",
      /reserved.*contiguous/i,
    ],
    [
      'duplicate',
      "      omitGuideFields: 'migration',\n      omitGuideFields: 'exceptions',",
      /duplicate.*omitGuideFields/i,
    ],
  ];
  for (const [label, declarations, expected] of cases) {
    await t.test(label, async (subtest) => {
      await expectRejected(
        subtest,
        (workspace) => addRawStoryGuideDeclarations(
          workspace,
          'stories/Button.stories.jsx',
          declarations,
        ),
        expected,
      );
    });
  }
});

test('rejects a malformed non-object storyGuide declaration', async (t) => {
  await expectRejected(
    t,
    async (workspace) => {
      const storyPath = path.join(workspace, 'stories/Button.stories.jsx');
      const source = await readFile(storyPath, 'utf8');
      await writeFile(storyPath, source.replace('storyGuide: {', 'storyGuide: guideMetadata, legacyGuide: {'));
    },
    /storyGuide must be an object literal/i,
  );
});

test('rejects computed reserved metadata declarations', async (t) => {
  await expectRejected(
    t,
    (workspace) => addRawStoryGuideDeclarations(
      workspace,
      'stories/Button.stories.jsx',
      "      ['omitGuideFields']: 'migration',",
    ),
    /omitGuideFields.*direct property name/i,
  );
});

test('rejects an unknown guide field', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, 'stories/Button.stories.jsx', {
      omitGuideFields: 'migration, imaginaryField',
    }),
    /(?:unknown|allowed|guide field).*imaginaryField|imaginaryField.*(?:unknown|allowed|guide field)/i,
  );
});

test('rejects an empty delta field declaration', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, dashboardShell.story, {
      canonicalGuide: dashboardNavigation.slug,
      guideDeltaFields: ' , , ',
    }),
    /(?:delta.*(?:empty|required)|(?:empty|required).*delta)/i,
  );
});

test('rejects delta fields without a canonical guide', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, 'stories/Button.stories.jsx', {
      guideDeltaFields: 'purpose',
    }),
    /(?:delta.*canonical|canonical.*delta)/i,
  );
});

test('rejects author omissions on a canonical delta guide', async (t) => {
  await expectRejected(
    t,
    async (workspace) => {
      await addStoryGuideFields(workspace, dashboardShell.story, {
        canonicalGuide: dashboardNavigation.slug,
        guideDeltaFields: 'purpose',
        omitGuideFields: 'migration',
      });
    },
    /(?:omit.*canonical|canonical.*omit)/i,
  );
});

test('rejects an unknown canonical target', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, dashboardShell.story, {
      canonicalGuide: 'missing-guide',
      guideDeltaFields: 'purpose',
    }),
    /(?:unknown|missing|not found).*missing-guide|missing-guide.*(?:unknown|missing|not found)/i,
  );
});

test('rejects a self-referencing canonical target', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, dashboardShell.story, {
      canonicalGuide: dashboardShell.slug,
      guideDeltaFields: 'purpose',
    }),
    /(?:self|itself).*canonical|canonical.*(?:self|itself)/i,
  );
});

test('rejects a canonical target that is itself a delta guide', async (t) => {
  await expectRejected(
    t,
    async (workspace) => {
      await makeActionAreaADashboardOwner(workspace);
      await addStoryGuideFields(workspace, dashboardNavigation.story, {
        canonicalGuide: dashboardShell.slug,
        guideDeltaFields: 'purpose',
      });
      await addStoryGuideFields(workspace, dashboardShell.story, {
        canonicalGuide: actionArea.slug,
        guideDeltaFields: 'purpose',
      });
    },
    /(?:target.*delta|delta.*target)/i,
  );
});

test('rejects a canonical reference cycle', async (t) => {
  await expectRejected(
    t,
    async (workspace) => {
      await makeActionAreaADashboardOwner(workspace);
      await addStoryGuideFields(workspace, dashboardNavigation.story, {
        canonicalGuide: dashboardShell.slug,
        guideDeltaFields: 'purpose',
      });
      await addStoryGuideFields(workspace, dashboardShell.story, {
        canonicalGuide: actionArea.slug,
        guideDeltaFields: 'purpose',
      });
      await addStoryGuideFields(workspace, actionArea.story, {
        canonicalGuide: dashboardNavigation.slug,
        guideDeltaFields: 'purpose',
      });
    },
    /cycle|cyclic/i,
  );
});

test('rejects a canonical guide owned by a different primary component', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, actionArea.story, {
      canonicalGuide: dashboardNavigation.slug,
      guideDeltaFields: 'purpose',
    }),
    /(?:owner|ownership).*ActionArea|ActionArea.*(?:owner|ownership)|(?:owner|ownership).*DashboardShell/i,
  );
});

test('rejects a declared delta field without source evidence', async (t) => {
  await expectRejected(
    t,
    (workspace) => addStoryGuideFields(workspace, dashboardShell.story, {
      canonicalGuide: dashboardNavigation.slug,
      guideDeltaFields: 'migration',
    }),
    /(?:migration.*evidence|evidence.*migration)/i,
  );
});
