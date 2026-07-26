import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildDescriptionReview,
  extractPrimaryDescriptions,
  normalizeDescription,
  validateDescriptionReview,
} from './check-storybook-primary-description-review.mjs';

async function fixture(files, pages) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'lds-description-review-'));
  await Promise.all(
    Object.entries(files).map(async ([relativePath, source]) => {
      const file = path.join(root, relativePath);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, source);
    }),
  );
  const auditPath = path.join(root, 'audit.json');
  await writeFile(auditPath, JSON.stringify({ pages }));
  return { root, auditPath };
}

function page(importPath, stories) {
  return { title: importPath, importPath, stories };
}

function story(exportName, role = 'overview', visibility = 'public') {
  return { id: `${exportName.toLowerCase()}--story`, exportName, role, visibility };
}

test('normalizes Unicode, whitespace, and sentence boundaries before hashing', () => {
  assert.deepEqual(
    normalizeDescription('  Cafe\u0301 \n 첫째 문장.   둘째 문장!  '),
    ['Café 첫째 문장.', '둘째 문장!'],
  );
});

test('extracts direct, local const, template, concatenation, and object-spread descriptions', async () => {
  const { root, auditPath } = await fixture(
    {
      'stories/Forms.stories.jsx': `
        const subject = '버튼';
        const ending = '설명입니다.';
        const docs = { description: { story: \`\${subject} 기본 \${ending}\` } };
        const parameters = { docs };
        export const Overview = {
          ...{ name: '개요' },
          parameters: { ...parameters, docs: { ...docs } },
        };
      `,
    },
    [page('./stories/Forms.stories.jsx', [story('Overview')])],
  );

  const [entry] = await extractPrimaryDescriptions({ root, auditPath });
  assert.equal(entry.description, '버튼 기본 설명입니다.');
});

test('extracts storyDescription calls used directly or through a spread', async () => {
  const { root, auditPath } = await fixture(
    {
      'stories/Calls.stories.jsx': `
        const lead = '직접 호출';
        const shared = { ...storyDescription('스프레드 호출.') };
        export const Direct = { parameters: storyDescription(lead + ' 설명.') };
        export const Spread = { parameters: { ...shared } };
      `,
    },
    [
      page('./stories/Calls.stories.jsx', [
        story('Spread', 'usage'),
        story('Direct', 'overview'),
      ]),
    ],
  );

  const [entry] = await extractPrimaryDescriptions({ root, auditPath });
  assert.equal(entry.exportName, 'Direct');
  assert.equal(entry.description, '직접 호출 설명.');
});

test('selects the public overview and falls back to the first public story', async () => {
  const { root, auditPath } = await fixture(
    {
      'stories/Selection.stories.jsx': `
        export const HiddenOverview = { parameters: storyDescription('숨김.') };
        export const FirstPublic = { parameters: storyDescription('첫 공개.') };
        export const LaterPublic = { parameters: storyDescription('나중 공개.') };
      `,
    },
    [
      page('./stories/Selection.stories.jsx', [
        story('HiddenOverview', 'overview', 'hidden'),
        story('FirstPublic', 'usage'),
        story('LaterPublic', 'scenario'),
      ]),
    ],
  );

  const [entry] = await extractPrimaryDescriptions({ root, auditPath });
  assert.equal(entry.exportName, 'FirstPublic');
  assert.equal(entry.description, '첫 공개.');
});

test('uses checked-in Foundation helper templates and canonical foundation data', async () => {
  const { root, auditPath } = await fixture(
    {
      'docs/foundations/foundation-content.json': JSON.stringify({
        foundations: [{ slug: 'color', title: 'Color' }],
      }),
      'stories/FoundationGuide.shared.jsx': `
        export function foundationGuideStory(slug, name = '개요') {
          const foundation = getFoundation(slug);
          return { name, parameters: storyDescription(\`\${foundation.title} guide 설명.\`) };
        }
      `,
      'stories/FoundationSpecimen.shared.jsx': `
        export function foundationSpecimenStory(slug, name = '개요') {
          const foundation = foundations.get(slug);
          return { name, parameters: storyDescription(\`\${foundation.title} specimen 설명.\`) };
        }
      `,
      'stories/Foundation.stories.jsx': `
        export const Overview = { ...foundationSpecimenStory('color'), name: '개요' };
      `,
    },
    [page('./stories/Foundation.stories.jsx', [story('Overview', 'foundation-reference')])],
  );

  const [entry] = await extractPrimaryDescriptions({ root, auditPath });
  assert.equal(entry.description, 'Color specimen 설명.');
});

test('rejects unsupported or unresolved expressions instead of executing source', async () => {
  const { root, auditPath } = await fixture(
    {
      'stories/Unsafe.stories.jsx': `
        export const Overview = {
          parameters: storyDescription(readFileSync('secret.txt')),
        };
      `,
    },
    [page('./stories/Unsafe.stories.jsx', [story('Overview')])],
  );

  await assert.rejects(
    extractPrimaryDescriptions({ root, auditPath }),
    /Unsafe\.stories\.jsx.*Unsupported call "readFileSync"/s,
  );
});

test('update preserves reviewed decisions by sentence hash and leaves new sentences unreviewed', () => {
  const first = buildDescriptionReview([
    {
      pageTitle: 'Button',
      importPath: './stories/Button.stories.jsx',
      storyId: 'button--overview',
      exportName: 'Overview',
      description: '첫 문장. 둘째 문장.',
    },
  ]);
  first.entries[0].sentences[0].decision = 'retained-in-canvas';

  const next = buildDescriptionReview(
    [
      {
        pageTitle: 'Button',
        importPath: './stories/Button.stories.jsx',
        storyId: 'button--overview',
        exportName: 'Overview',
        description: '첫 문장. 새 문장.',
      },
    ],
    first,
  );

  assert.equal(next.entries[0].sentences[0].decision, 'retained-in-canvas');
  assert.equal(next.entries[0].sentences[1].decision, 'unreviewed');
  assert.equal(next.migrations[0].reason, 'deleted-sentence');
  assert.throws(() => validateDescriptionReview(next), /unreviewed|migration/i);
});

test('check rejects missing, changed, and deleted entries', () => {
  const reviewed = buildDescriptionReview([
    {
      pageTitle: 'Button',
      importPath: './stories/Button.stories.jsx',
      storyId: 'button--overview',
      exportName: 'Overview',
      description: '검토된 설명.',
    },
  ]);
  reviewed.entries[0].sentences[0].decision = 'retained-in-canvas';

  assert.doesNotThrow(() => validateDescriptionReview(reviewed, reviewed.entries));
  assert.throws(() => validateDescriptionReview(reviewed, []), /deleted|missing/i);
  assert.throws(
    () =>
      validateDescriptionReview(reviewed, [
        { ...reviewed.entries[0], descriptionHash: 'changed' },
      ]),
    /changed/i,
  );
});

test('review JSON is stable and readable after serialization', async () => {
  const review = buildDescriptionReview([]);
  const { root } = await fixture({}, []);
  const file = path.join(root, 'review.json');
  await writeFile(file, `${JSON.stringify(review, null, 2)}\n`);
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), review);
});
