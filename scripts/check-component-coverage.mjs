import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const docsRoot = path.join(root, 'docs', 'components');
const dedupBaselinePath = 'docs/references/quality/STORYBOOK_GUIDE_DEDUP_BASELINE.json';
const updateDedupBaseline = process.argv.includes('--update-dedup-baseline');
const metricVersion = 2;
const metricGuideDenominator = 173;
const hardDedupCeilings = {
  meanDuplicatedSharePercent: 61,
  guidesOverSixtyPercent: 92,
};
const guideFields = [
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
const sectionStatuses = new Set([
  'evidence',
  'omitted-by-author',
  'omitted-no-evidence',
  'canonical-reference',
]);
// Metric v2 deliberately measures the PRD's decision-prose fields, not API/property data or code.
// Each array entry is one unit; repeated entries remain repeated in a guide's share.
const proseSelectors = {
  purpose: (guide) => [guide.purpose],
  useWhen: (guide) => guide.useWhen,
  avoidWhen: (guide) => guide.avoidWhen,
  anatomyRules: (guide) => guide.anatomy.map(({ rule }) => rule),
  stateRules: (guide) => guide.states.map(({ rule }) => rule),
  behavior: (guide) => guide.behavior,
  // Quantitative prompt rules are prose; CSS custom-property rows are token data.
  quantitativeRules: (guide) => guide.quantitativeRules
    .filter(({ subject }) => !subject.startsWith('--'))
    .map(({ rule }) => rule),
  responsive: (guide) => guide.responsive,
  contentGuidance: (guide) => guide.contentGuidance,
  accessibility: (guide) => guide.accessibility,
  exceptions: (guide) => guide.exceptions,
  relatedRelationships: (guide) => guide.related.map(({ relationship }) => relationship),
  migration: (guide) => guide.migration,
};
const markdownHeadingsByField = {
  useWhen: '## 사용 판단',
  avoidWhen: '## 사용 판단',
  anatomy: '## Anatomy',
  properties: '## Properties',
  states: '## States',
  behavior: '## Behavior and interaction',
  quantitativeRules: '## 정량 규칙',
  responsive: '## Responsive',
  contentGuidance: '## Content and writing',
  accessibility: '## Accessibility',
  exceptions: '## Exceptions',
  related: '## Related components',
  examples: '## Examples',
  tokens: '## Tokens and API',
  apiLinks: '## Tokens and API',
  migration: '## Migration',
};
const knownGenericFallbacks = [
  '{title}는 {family} 영역에서 반복되는 인터페이스 결정을 일관된 API와 접근성 계약으로 제공합니다.',
  '{title}가 소유하는 {family} 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.',
  '제품별 구현 대신 공개 {owner} API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.',
  '같은 판단이 화면마다 반복된다면 화면에서 다시 정하지 말고 이 페이지의 계약을 따릅니다.',
  '{title}가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.',
  '동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.',
  '표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.',
  '{owner}의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다.',
  '별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다.',
  '0개 내장. source/API에 없는 수치 정책은 제품 계층이 소유하고 컴포넌트에는 추가하지 않습니다.',
  '{owner}의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.',
  '상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.',
  '제품 데이터와 side effect는 callback으로 위임하고 {owner}는 표시·입력 상태만 소유합니다.',
  '320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.',
  '고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.',
  '사용자에게 보이는 {title} 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.',
  '아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.',
  'native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.',
  '키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.',
  '색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.',
  '제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 {owner}의 범용 API에 넣지 않습니다.',
  '접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.',
  '현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.',
  '대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hasEvidence(value) {
  return Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0;
}

function regexEscape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeUnit(value, guide) {
  let normalized = String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  const titleOwnerValues = [
    [guide.title, '{title}'],
    [guide.primaryOwner, '{owner}'],
  ]
    .filter(([candidate]) => candidate)
    .sort(([left], [right]) => right.length - left.length);
  for (const [candidate, replacement] of titleOwnerValues) {
    normalized = normalized.replace(new RegExp(regexEscape(candidate.normalize('NFC')), 'gu'), replacement);
  }
  return normalized;
}

function proseUnits(guide) {
  return Object.values(proseSelectors)
    .flatMap((select) => select(guide))
    .filter((value) => typeof value === 'string')
    .map((value) => normalizeUnit(value, guide))
    .filter((value) => [...value].length >= 20);
}

function genericFallbackUnits(guide) {
  return new Set(knownGenericFallbacks.map((unit) =>
    unit.replaceAll('{family}', guide.family.normalize('NFC'))));
}

function calculateDedupMetric(guides) {
  assert(guides.length === metricGuideDenominator, `Dedup metric denominator drifted: ${guides.length}/${metricGuideDenominator}.`);
  const unitsByGuide = new Map(guides.map((guide) => [guide.slug, proseUnits(guide)]));
  const guideSlugsByUnit = new Map();
  for (const [slug, units] of unitsByGuide) {
    for (const unit of units) {
      const slugs = guideSlugsByUnit.get(unit) || new Set();
      slugs.add(slug);
      guideSlugsByUnit.set(unit, slugs);
    }
  }
  const duplicatedUnits = new Set([...guideSlugsByUnit]
    .filter(([, slugs]) => slugs.size > 1)
    .map(([unit]) => unit));
  const guideShares = guides.map((guide) => {
    const units = unitsByGuide.get(guide.slug);
    const duplicated = units.filter((unit) => duplicatedUnits.has(unit)).length;
    return units.length ? duplicated / units.length : 0;
  });
  const meanDuplicatedShare = guideShares.reduce((sum, share) => sum + share, 0) / metricGuideDenominator;
  const fallbackUnits = new Set(guides.flatMap((guide) => {
    const genericUnits = genericFallbackUnits(guide);
    return unitsByGuide.get(guide.slug).filter((unit) => genericUnits.has(unit));
  }));
  return {
    metricVersion,
    guideDenominator: metricGuideDenominator,
    totalUnits: [...unitsByGuide.values()].reduce((sum, units) => sum + units.length, 0),
    duplicatedUnits: duplicatedUnits.size,
    meanDuplicatedSharePercent: Math.round(meanDuplicatedShare * 100),
    guidesOverSixtyPercent: guideShares.filter((share) => share > 0.6).length,
    knownGenericFallbackUnits: fallbackUnits.size,
  };
}

function assertCanonicalContract(guides) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  for (const guide of guides) {
    assert(
      guide.canonicalGuide === null
        || (
          typeof guide.canonicalGuide === 'object'
          && typeof guide.canonicalGuide.slug === 'string'
          && typeof guide.canonicalGuide.title === 'string'
          && typeof guide.canonicalGuide.storybookDocsId === 'string'
          && Object.keys(guide.canonicalGuide).sort().join(',') === 'slug,storybookDocsId,title'
        ),
      `${guide.slug}: canonicalGuide must be null or a direct { slug, title, storybookDocsId } reference.`,
    );
    assert(Array.isArray(guide.guideDeltaFields), `${guide.slug}: guideDeltaFields must be an array.`);
    assert(
      new Set(guide.guideDeltaFields).size === guide.guideDeltaFields.length
        && guide.guideDeltaFields.every((field) => guideFields.includes(field)),
      `${guide.slug}: guideDeltaFields contains duplicate or unknown fields.`,
    );
    assert(
      guide.sectionStatus
        && Object.keys(guide.sectionStatus).sort().join(',') === [...guideFields].sort().join(','),
      `${guide.slug}: sectionStatus must cover every guide field exactly once.`,
    );
    for (const field of guideFields) {
      const status = guide.sectionStatus[field];
      const populated = hasEvidence(guide[field]);
      assert(sectionStatuses.has(status), `${guide.slug}: ${field} has invalid section status "${status}".`);
      assert(
        populated === (status === 'evidence'),
        `${guide.slug}: ${field} must be populated exactly when sectionStatus is "evidence".`,
      );
    }

    if (guide.canonicalGuide === null) {
      assert(guide.guideDeltaFields.length === 0, `${guide.slug}: a standalone guide cannot declare delta fields.`);
      assert(
        !Object.values(guide.sectionStatus).includes('canonical-reference'),
        `${guide.slug}: a standalone guide cannot contain canonical-reference sections.`,
      );
      continue;
    }

    assert(guide.guideDeltaFields.length > 0, `${guide.slug}: a canonical guide reference requires delta fields.`);
    const canonical = bySlug.get(guide.canonicalGuide.slug);
    assert(canonical && canonical !== guide, `${guide.slug}: canonical guide target is missing or self-referential.`);
    assert(canonical.canonicalGuide === null, `${guide.slug}: canonical guide target must be direct, not another delta.`);
    assert(canonical.title === guide.canonicalGuide.title, `${guide.slug}: canonical guide title is stale.`);
    assert(
      guide.canonicalGuide.storybookDocsId
        === `${canonical.storybook.entryStoryId.split('--')[0]}--docs`,
      `${guide.slug}: canonical guide Storybook Docs ID is stale.`,
    );
    assert(canonical.primaryOwner === guide.primaryOwner, `${guide.slug}: canonical guide must have the same primary owner.`);
    const purposeUnit = normalizeUnit(guide.purpose, guide);
    for (const field of ['useWhen', 'avoidWhen']) {
      for (const value of guide[field]) {
        const decisionUnit = normalizeUnit(value, guide);
        assert(
          purposeUnit !== decisionUnit
            && !purposeUnit.includes(decisionUnit)
            && !decisionUnit.includes(purposeUnit),
          `${guide.slug}: purpose must not restate its ${field} evidence.`,
        );
      }
    }
    for (const field of guideFields) {
      const expectedStatus = guide.guideDeltaFields.includes(field) ? 'evidence' : 'canonical-reference';
      assert(
        guide.sectionStatus[field] === expectedStatus,
        `${guide.slug}: ${field} must have sectionStatus "${expectedStatus}".`,
      );
    }
  }
}

function assertSameOwnerDedup(guides) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  for (const contract of [
    {
      slug: 'product-operations-dashboard-dashboard-shell',
      canonicalSlug: 'product-navigation-dashboard-navigation',
      formerlyDuplicatedFields: [
        'useWhen', 'avoidWhen', 'anatomy', 'properties', 'states', 'behavior', 'quantitativeRules',
        'responsive', 'contentGuidance', 'accessibility', 'exceptions', 'examples', 'tokens', 'migration',
      ],
    },
    {
      slug: 'theme-status-brand-spinner',
      canonicalSlug: 'core-components-status-spinner',
      formerlyDuplicatedFields: [
        'useWhen', 'behavior', 'responsive', 'accessibility', 'exceptions', 'examples', 'migration',
      ],
    },
  ]) {
    const guide = bySlug.get(contract.slug);
    assert(guide, `Missing same-owner dedup guide: ${contract.slug}.`);
    assert(
      guide.canonicalGuide?.slug === contract.canonicalSlug,
      `${contract.slug}: expected a direct canonical reference to ${contract.canonicalSlug}.`,
    );
    const canonicalGuide = bySlug.get(contract.canonicalSlug);
    assert(canonicalGuide, `Missing canonical guide: ${contract.canonicalSlug}.`);
    const canonicalUnits = new Set(proseUnits(canonicalGuide));
    const copiedCanonicalUnits = proseUnits(guide).filter((unit) => canonicalUnits.has(unit));
    assert(
      copiedCanonicalUnits.length === 0,
      `${contract.slug}: local deltas copied ${copiedCanonicalUnits.length} canonical prose units.`,
    );
    for (const field of contract.formerlyDuplicatedFields) {
      assert(
        guide.sectionStatus[field] === 'canonical-reference' && !hasEvidence(guide[field]),
        `${contract.slug}: formerly duplicated ${field} must be represented only by its canonical reference.`,
      );
    }
  }

  const media = bySlug.get('core-components-content-media-patterns');
  const contentBadge = bySlug.get('core-components-content-content-badge');
  assert(media && contentBadge, 'Media Patterns and Content Badge guides are required.');
  assert(media.primaryOwner === 'Thumbnail', 'Media Patterns primary owner must be Thumbnail.');
  assert(
    !media.ownerComponents.includes('ContentBadge')
      && !media.supportingComponents.includes('ContentBadge')
      && media.canonicalGuide?.slug !== contentBadge.slug,
    'Media Patterns must not retain ContentBadge as an owner, supporting component, or canonical guide.',
  );
  const contentBadgeUnits = new Set(proseUnits(contentBadge));
  const derivedDuplicates = [...proseUnits(media)].filter((unit) => contentBadgeUnits.has(unit));
  assert(
    derivedDuplicates.length === 0,
    `Media Patterns retained ${derivedDuplicates.length} ContentBadge-derived prose units (expected 0 after removing 9 derived duplicates).`,
  );
}

const [contentSource, schemaSource, entrySource, auditSource, preview, existingDedupBaselineSource] = await Promise.all([
  read('docs/components/component-content.json'),
  read('docs/components/component-content.schema.json'),
  read('src/index.js'),
  read('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json'),
  read('.storybook/preview.jsx'),
  read(dedupBaselinePath).catch(() => null),
]);
const content = JSON.parse(contentSource);
const schema = JSON.parse(schemaSource);
const audit = JSON.parse(auditSource);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
assert(validate(content), `Component content schema violations:\n${ajv.errorsText(validate.errors, { separator: '\n' })}`);

const entryLines = [...entrySource.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+'(\.\.\/components\/([^']+?)\.jsx)';$/gm)];
const expectedExports = new Set(entryLines.flatMap((match) => match[1].split(',').map((item) => item.trim().split(/\s+as\s+/).at(-1))));
assert(content.summary.componentEntries === entryLines.length, `Component entry census drifted: ${content.summary.componentEntries}/${entryLines.length}.`);
assert(content.entries.length === entryLines.length, `Compiled component entries drifted: ${content.entries.length}/${entryLines.length}.`);
assert(content.summary.publicExports === expectedExports.size, `Named export census drifted: ${content.summary.publicExports}/${expectedExports.size}.`);

const entryIds = new Set();
const compiledExports = new Set();
for (const entry of content.entries) {
  assert(!entryIds.has(entry.id), `Duplicate component entry id: ${entry.id}`);
  entryIds.add(entry.id);
  entry.exports.forEach((name) => compiledExports.add(name));
  for (const contractPath of [entry.source, entry.typeContract, entry.prompt]) {
    await access(path.join(root, contractPath));
  }
  assert(entry.promptSha256.length === 64, `${entry.title}: prompt source fingerprint is missing.`);
}
assert(
  [...expectedExports].every((name) => compiledExports.has(name)) && compiledExports.size === expectedExports.size,
  'Every named public export must appear exactly in the compiled component registry.',
);

const nonComponentDecisionPages = new Set([
  'LDS Core/Patterns/Loading',
]);
// Mirrors generate-component-docs.mjs: Foundation pages and the IA audit's
// "Other" meta layer are not component pages, so no guide is expected for them.
const expectedPages = audit.pages.filter((page) => page.layer !== 'Foundation'
  && page.layer !== 'Other'
  && !nonComponentDecisionPages.has(page.title));
const guideTitles = new Set();
const guideSlugs = new Set();
for (const guide of content.guides) {
  assert(!guideTitles.has(guide.storybookTitle), `Duplicate component guide title: ${guide.storybookTitle}`);
  assert(!guideSlugs.has(guide.slug), `Duplicate component guide slug: ${guide.slug}`);
  guideTitles.add(guide.storybookTitle);
  guideSlugs.add(guide.slug);
  assert(guide.storybook.publicStories.length >= 1, `${guide.slug}: public Storybook evidence is required.`);
  assert(guide.storybook.entryStoryId, `${guide.slug}: an audience entry story id is required.`);
  assert(guide.platformStatus.react === 'implemented', `${guide.slug}: React status must match public implementation evidence.`);
  assert(
    guide.platformStatus.ios === 'not-tracked' && guide.platformStatus.android === 'not-tracked',
    `${guide.slug}: this repository must not invent external platform status.`,
  );
  const generatedGuide = path.join(docsRoot, 'guides', `${guide.slug}.md`);
  const guideText = await readFile(generatedGuide, 'utf8');
  assert(guideText.startsWith(`# ${guide.title}\n`), `${guide.slug}: generated guide title is stale.`);
  assert(guideText.includes(`component-content.json#${guide.slug}`), `${guide.slug}: generated guide source link is stale.`);
  assert(guideText.includes('## Sources'), `${guide.slug}: generated guide is missing its source evidence.`);
  if (guide.canonicalGuide) {
    assert(
      guideText.includes(`](${guide.canonicalGuide.slug}.md)`),
      `${guide.slug}: generated guide is missing its direct canonical reference.`,
    );
  }
  for (const heading of new Set(Object.values(markdownHeadingsByField))) {
    const shouldRender = Object.entries(markdownHeadingsByField).some(
      ([field, fieldHeading]) => fieldHeading === heading && guide.sectionStatus[field] === 'evidence',
    );
    assert(
      guideText.includes(heading) === shouldRender,
      `${guide.slug}: ${heading} does not match its evidence statuses.`,
    );
  }
}

assertCanonicalContract(content.guides);
assertSameOwnerDedup(content.guides);

assert(content.guides.length === expectedPages.length, `Component guide page census drifted: ${content.guides.length}/${expectedPages.length}.`);
for (const page of expectedPages) {
  assert(guideTitles.has(page.title), `Missing structured component guide: ${page.title}`);
}
assert(preview.includes('componentGuideByTitle'), 'Storybook preview must connect overview stories to structured component guides.');
assert(preview.includes('<ComponentGuideForStory'), 'Storybook preview must render the complete component guide.');
// The guide belongs on the Docs tab. Rendering it on the Canvas buries the component the page
// is named after under several thousand pixels of prose, which is how this surface drifted.
assert(
  /docs:\s*\{[^}]*page:\s*GuideDocsPage/s.test(preview),
  'Storybook preview must render the component guide through a docs page, not on the story canvas.',
);
assert(
  !/export const tags\s*=\s*\[[^\]]*'autodocs'/.test(preview),
  'Autodocs must be opted into per component meta; enabling it globally gives Foundation and catalog pages a Docs tab that only repeats the story.',
);
assert(!preview.includes("'Overview', 'Progress Board'"), 'Operational catalog and progress pages must not lead the component sidebar.');

const generated = await readdir(path.join(docsRoot, 'guides'));
assert(generated.filter((name) => name.endsWith('.md')).length === content.guides.length, 'Generated component guide files do not match the registry.');
const runtimeGuides = await readdir(path.join(docsRoot, 'runtime'));
assert(runtimeGuides.filter((name) => name.endsWith('.json')).length === content.guides.length, 'Lazy component guide runtime files do not match the registry.');
for (const artifact of [
  'README.md',
  'COMPONENT_REFERENCE.md',
  'PROGRESS_BOARD.md',
  'component-guide-index.json',
  'component-guide-runtime.json',
  'llms.txt',
]) {
  const text = await readFile(path.join(docsRoot, artifact), 'utf8');
  assert(text.trim().length > 100, `Generated component artifact is empty: ${artifact}`);
}
const llms = await readFile(path.join(docsRoot, 'llms.txt'), 'utf8');
assert(content.guides.every((guide) => llms.includes(`# ${guide.title}`)), 'LLM bundle must contain every component decision guide.');

const dedupMetric = calculateDedupMetric(content.guides);
assert(
  dedupMetric.knownGenericFallbackUnits === 0,
  `Known generic fallback prose remains in ${dedupMetric.knownGenericFallbackUnits} normalized units.`,
);
assert(
  dedupMetric.meanDuplicatedSharePercent <= hardDedupCeilings.meanDuplicatedSharePercent,
  `Guide prose duplication is ${dedupMetric.meanDuplicatedSharePercent}% (hard ceiling ${hardDedupCeilings.meanDuplicatedSharePercent}%).`,
);
assert(
  dedupMetric.guidesOverSixtyPercent <= hardDedupCeilings.guidesOverSixtyPercent,
  `${dedupMetric.guidesOverSixtyPercent} guides exceed 60% duplicated prose (hard ceiling ${hardDedupCeilings.guidesOverSixtyPercent}).`,
);

const dedupInputHashes = {
  componentContentSha256: sha256(contentSource),
  informationArchitectureAuditSha256: sha256(auditSource),
};
const existingDedupBaseline = existingDedupBaselineSource ? JSON.parse(existingDedupBaselineSource) : null;
if (updateDedupBaseline) {
  const previousCeilings = existingDedupBaseline?.metricVersion === metricVersion
    ? existingDedupBaseline.ceilings
    : hardDedupCeilings;
  assert(
    Number.isInteger(previousCeilings.meanDuplicatedSharePercent)
      && Number.isInteger(previousCeilings.guidesOverSixtyPercent),
    'Existing guide dedup baseline ceilings are invalid.',
  );
  const ceilings = {
    meanDuplicatedSharePercent: Math.min(
      previousCeilings.meanDuplicatedSharePercent,
      hardDedupCeilings.meanDuplicatedSharePercent,
      dedupMetric.meanDuplicatedSharePercent,
    ),
    guidesOverSixtyPercent: Math.min(
      previousCeilings.guidesOverSixtyPercent,
      hardDedupCeilings.guidesOverSixtyPercent,
      dedupMetric.guidesOverSixtyPercent,
    ),
  };
  assert(
    dedupMetric.meanDuplicatedSharePercent <= ceilings.meanDuplicatedSharePercent
      && dedupMetric.guidesOverSixtyPercent <= ceilings.guidesOverSixtyPercent,
    'Guide dedup metrics regressed; --update-dedup-baseline may only lower existing ceilings.',
  );
  await writeFile(
    path.join(root, dedupBaselinePath),
    `${JSON.stringify({
      metricVersion,
      inputHashes: dedupInputHashes,
      observed: dedupMetric,
      ceilings,
    }, null, 2)}\n`,
  );
} else {
  assert(existingDedupBaseline, `Missing dedup baseline: ${dedupBaselinePath}`);
  assert(existingDedupBaseline.metricVersion === metricVersion, 'Guide dedup metric version drifted.');
  assert(
    Number.isInteger(existingDedupBaseline.ceilings?.meanDuplicatedSharePercent)
      && Number.isInteger(existingDedupBaseline.ceilings?.guidesOverSixtyPercent),
    'Guide dedup baseline ceilings are invalid.',
  );
  assert(
    JSON.stringify(existingDedupBaseline.inputHashes) === JSON.stringify(dedupInputHashes),
    `Guide dedup baseline inputs are stale. Regenerate artifacts, then run this check with --update-dedup-baseline.`,
  );
  assert(
    existingDedupBaseline.ceilings.meanDuplicatedSharePercent <= hardDedupCeilings.meanDuplicatedSharePercent
      && existingDedupBaseline.ceilings.guidesOverSixtyPercent <= hardDedupCeilings.guidesOverSixtyPercent,
    'Guide dedup baseline ceilings exceed the hard limits.',
  );
  assert(
    dedupMetric.meanDuplicatedSharePercent <= existingDedupBaseline.ceilings.meanDuplicatedSharePercent,
    `Guide prose duplication regressed: ${dedupMetric.meanDuplicatedSharePercent}%/${existingDedupBaseline.ceilings.meanDuplicatedSharePercent}%.`,
  );
  assert(
    dedupMetric.guidesOverSixtyPercent <= existingDedupBaseline.ceilings.guidesOverSixtyPercent,
    `High-duplication guide count regressed: ${dedupMetric.guidesOverSixtyPercent}/${existingDedupBaseline.ceilings.guidesOverSixtyPercent}.`,
  );
  assert(
    JSON.stringify(existingDedupBaseline.observed) === JSON.stringify(dedupMetric),
    'Guide dedup observed metric drifted from its reproducible baseline.',
  );
}

console.log(
  `Validated Component completeness: ${content.entries.length} entries / ${content.summary.publicExports} exports, `
  + `${content.guides.length} evidence-only decision guides; `
  + `${dedupMetric.meanDuplicatedSharePercent}% mean duplicated prose and ${dedupMetric.guidesOverSixtyPercent} guides over 60%.`,
);
