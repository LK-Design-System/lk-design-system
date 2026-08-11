import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const auditPath = 'docs/references/brand/PRODUCT_BRAND_ASSET_AUDIT.json';
const documentationPath = 'docs/PRODUCT_FRONTEND_COVERAGE.md';
const constructionPath = 'assets/brand/lk-logo-construction.json';
const requiredProducts = ['web-viz', 'control', 'portal'];
const expectedRepositories = new Map([
  ['web-viz', 'LK-ROBOTICS/lk_web_viz'],
  ['control', 'LK-ROBOTICS/lkrobotics-control-full-daedeok'],
  ['portal', 'LK-ROBOTICS-AX/lk_portal'],
]);
const classifications = new Set([
  'migration-required',
  'contract-compatible-upgrade-required',
  'current',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string.`);
}

async function assertLocalReference(reference, label) {
  assertNonEmptyString(reference, label);
  assert(!path.isAbsolute(reference), `${label} must be repository-relative.`);
  await access(path.join(root, reference));
}

const audit = JSON.parse(await readFile(path.join(root, auditPath), 'utf8'));
const documentation = await readFile(path.join(root, documentationPath), 'utf8');
const construction = JSON.parse(await readFile(path.join(root, constructionPath), 'utf8'));

assert(audit.schemaVersion === 1, 'Brand product audit schemaVersion must be 1.');
assert(/^\d{4}-\d{2}-\d{2}$/.test(audit.auditedAt), 'Brand product audit date must use YYYY-MM-DD.');
assertNonEmptyString(audit.purpose, 'audit.purpose');
assert(audit.evidenceVerification?.sourceObjects === 'manually-verified-against-local-git-objects-at-audit-date', 'Audit must state how external Git objects were verified.');
assert(
  audit.evidenceVerification?.automatedCheck === 'validates-required-product-coverage-pin-format-documentation-and-brand-size-contracts-without-fetching-product-repositories',
  'Audit must state the bounded automated-check scope.',
);
assert(audit.standard?.constructionVersion === construction.constructionVersion, 'Audit construction version must match the construction manifest.');
assert(audit.standard?.geometryVersion === construction.symbol.geometryVersion, 'Audit geometry version must match the construction manifest.');
assert(audit.standard?.smallUseVariantApproved === false, 'No unapproved small-use LK redraw may be claimed.');
await assertLocalReference(audit.standard.constructionManifest, 'standard.constructionManifest');
await assertLocalReference(audit.standard.runtimeComponent, 'standard.runtimeComponent');
await assertLocalReference(audit.standard.runtimeProductLockupComponent, 'standard.runtimeProductLockupComponent');
await assertLocalReference(audit.standard.productLockupRegistry, 'standard.productLockupRegistry');
await assertLocalReference(audit.standard.productLockupStandard, 'standard.productLockupStandard');
assert(
  JSON.stringify(audit.standard.approvedProductKeys) === JSON.stringify(['console', 'portal']),
  'The initial ProductLockup registry must contain only console and portal in canonical order.',
);
assert(new Set(audit.standard.approvedProductKeys).size === audit.standard.approvedProductKeys.length, 'ProductLockup registry keys must be unique.');
const productLockupModule = await import(pathToFileURL(path.join(root, audit.standard.productLockupRegistry)).href);
assert(
  JSON.stringify(productLockupModule.PRODUCT_LOCKUP_KEYS) === JSON.stringify(audit.standard.approvedProductKeys),
  'Brand audit approvedProductKeys must match the runtime ProductLockup registry.',
);

for (const boundary of ['designSystemOwns', 'productOwns']) {
  const values = audit.ownershipBoundary?.[boundary];
  assert(Array.isArray(values) && values.length >= 3, `ownershipBoundary.${boundary} must contain at least three rules.`);
  values.forEach((value, index) => assertNonEmptyString(value, `ownershipBoundary.${boundary}[${index}]`));
}

assert(Array.isArray(audit.requiredProducts), 'requiredProducts must be an array.');
assert(JSON.stringify(audit.requiredProducts) === JSON.stringify(requiredProducts), 'requiredProducts must pin the three mandated product reviews in order.');
assert(Array.isArray(audit.reviews) && audit.reviews.length === requiredProducts.length, 'Exactly three brand product reviews are required.');

const reviewIds = new Set();
for (const review of audit.reviews) {
  assert(requiredProducts.includes(review.id), `Unexpected product review: ${review.id}`);
  assert(!reviewIds.has(review.id), `Duplicate product review: ${review.id}`);
  reviewIds.add(review.id);
  assertNonEmptyString(review.repository, `${review.id}.repository`);
  assert(review.repository === expectedRepositories.get(review.id), `${review.id}.repository must match the pinned required product repository.`);
  assert(/^[0-9a-f]{40}$/.test(review.sourceRevision), `${review.id}.sourceRevision must be a full Git commit SHA.`);
  assert(classifications.has(review.classification), `${review.id}.classification is invalid.`);
  assertNonEmptyString(review.finding, `${review.id}.finding`);
  assert(review.replacement && typeof review.replacement === 'object', `${review.id}.replacement must be an object.`);
  assert(review.replacement.identityComponent === 'ProductLockup', `${review.id}.replacement must use the ProductLockup registry standard.`);
  assert(!Object.hasOwn(review.replacement, 'productName'), `${review.id}.replacement must not expose a free-form productName API.`);
  if (review.replacement.approvedProductKey !== null) {
    assert(
      audit.standard.approvedProductKeys.includes(review.replacement.approvedProductKey),
      `${review.id}.replacement.approvedProductKey must exist in the approved ProductLockup registry.`,
    );
  }
  assert(Array.isArray(review.sourceEvidence) && review.sourceEvidence.length >= 2, `${review.id}.sourceEvidence must contain at least two pins.`);

  const evidencePaths = new Set();
  for (const [index, evidence] of review.sourceEvidence.entries()) {
    assertNonEmptyString(evidence.path, `${review.id}.sourceEvidence[${index}].path`);
    assert(!path.isAbsolute(evidence.path), `${review.id} evidence paths must be repository-relative.`);
    assert(!evidencePaths.has(evidence.path), `${review.id} has duplicate evidence path ${evidence.path}.`);
    evidencePaths.add(evidence.path);
    assert(/^[0-9a-f]{40}$/.test(evidence.blobSha), `${review.id} evidence ${evidence.path} must pin a full Git blob SHA.`);
    assertNonEmptyString(evidence.note, `${review.id}.sourceEvidence[${index}].note`);
  }

  assert(documentation.includes(review.sourceRevision), `${documentationPath} must cite ${review.id} revision ${review.sourceRevision}.`);
  assert(documentation.includes(`\`${review.id}\``), `${documentationPath} must identify the ${review.id} review.`);
}

for (const requiredProduct of requiredProducts) {
  assert(reviewIds.has(requiredProduct), `Missing product review: ${requiredProduct}`);
}

assert(audit.reviews.find((review) => review.id === 'web-viz')?.classification === 'migration-required', 'Web Viz gradient PNG must remain an explicit migration gap until replaced.');
assert(audit.reviews.find((review) => review.id === 'control')?.classification === 'migration-required', 'Control local logo assets must remain an explicit migration gap until replaced.');
assert(
  audit.reviews.find((review) => review.id === 'portal')?.classification === 'contract-compatible-upgrade-required',
  'LK Portal must retain the compatible-composition/package-upgrade distinction.',
);
const webVizReplacement = audit.reviews.find((review) => review.id === 'web-viz').replacement;
assert(webVizReplacement.registryStatus === 'registry-name-approval-pending', 'Web Viz must remain registry-name-approval pending.');
assert(webVizReplacement.approvedProductKey === null, 'Web Viz must not claim an approved ProductLockup key.');
assertNonEmptyString(webVizReplacement.requiredProductAction, 'web-viz.replacement.requiredProductAction');
assert(webVizReplacement.interimHeaderVariant === 'mark', 'Web Viz must use the approved mark while ProductLockup naming is pending.');
assert(webVizReplacement.interimHeaderRenderedHeightPx >= construction.layout.mark.minimumRenderedHeightPx, 'Web Viz interim header mark must meet the mark minimum.');
assert(webVizReplacement.loginRenderedHeightPx >= construction.layout.mark.minimumRenderedHeightPx, 'Web Viz login replacement must meet the mark minimum.');
const controlReplacement = audit.reviews.find((review) => review.id === 'control').replacement;
assert(controlReplacement.registryStatus === 'registry-name-approval-pending', 'Control must remain registry-name-approval pending.');
assert(controlReplacement.approvedProductKey === null, 'Control must not claim an approved ProductLockup key.');
assertNonEmptyString(controlReplacement.requiredProductAction, 'control.replacement.requiredProductAction');
assert(controlReplacement.collapsedVariant === 'mark', 'Control collapsed navigation must use the approved mark while ProductLockup naming is pending.');
assert(controlReplacement.collapsedRenderedHeightPx >= construction.layout.mark.minimumRenderedHeightPx, 'Control collapsed mark must meet the mark minimum.');
assert(controlReplacement.navigationRenderedSquarePx < construction.layout.officialSquare.minimumRenderedSquarePx, 'Control navigation must preserve the documented official-square gap until migrated.');
assert(controlReplacement.loginRenderedSquarePx >= construction.layout.officialSquare.minimumRenderedSquarePx, 'Control login replacement must meet the official-square minimum.');
const portalReplacement = audit.reviews.find((review) => review.id === 'portal').replacement;
assert(portalReplacement.registryStatus === 'approved', 'LK Portal must remain an approved ProductLockup registry entry.');
assert(portalReplacement.approvedProductKey === 'portal', 'LK Portal must resolve through the approved portal ProductLockup key.');
assert(portalReplacement.assetKind === 'fixed-outlined-lockup', 'LK Portal must use a fixed outlined asset, not live product-name text.');
assert(portalReplacement.collapsedMode === 'compact', 'LK Portal must use ProductLockup compact mode in collapsed navigation.');
assert(portalReplacement.collapsedVariant === 'mark', 'LK Portal collapsed navigation must use the approved mark.');
assert(portalReplacement.renderedHeightPx >= construction.layout.mark.minimumRenderedHeightPx, 'LK Portal mark usage must meet the rendered mark minimum.');
assert(documentation.includes('npm run check:brand-products'), `${documentationPath} must document the brand product audit check.`);

console.log(`Validated product brand asset audit: ${audit.reviews.length} products, geometry v${audit.standard.geometryVersion}.`);
