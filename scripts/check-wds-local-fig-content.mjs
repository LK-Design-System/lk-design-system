import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

const audit = await readJson('docs/references/wds/FIGMA_LOCAL_CONTENT_AUDIT.json');
const gate = await readJson('docs/references/wds/COVERAGE_COMPLETION_GATE.json');
const queue = await readJson('docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json');
const tokenSource = await readJson('tokens/source.json');
const typographyCss = await readFile('tokens/typography.css', 'utf8');
const gridCss = await readFile('tokens/grid.css', 'utf8');

const pageIds = new Set((audit.pages || []).map((page) => page.id));
const targetIds = new Set((audit.targets || []).map((target) => target.node.id));
const componentSections = audit.componentSections || [];

const requiredPages = {
  '0:1': 'Overview',
  '395:1958': 'Makers’ Principle',
  '1173:12995': 'Resource',
  '1174:12996': 'Guideline',
  '3242:22217': 'Foundation',
  '15625:32983': 'Color - Semantic',
  '15625:52196': 'Color - Atomic',
  '15625:54522': 'Typography',
  '15625:57936': 'Grid',
  '16222:137703': '1 Theme',
  '16222:137704': '2 Element',
  '16222:137705': '3 Component',
  '16257:145132': 'Theme Icon',
  '16257:145133': 'Theme Logo',
  '16355:159654': 'Guidelines',
  '16486:130929': 'Updates'
};

const requiredTargets = {
  '15625:32983': 'Color - Semantic',
  '15625:52196': 'Color - Atomic',
  '15625:54522': 'Typography',
  '15625:57936': 'Grid',
  '1173:12995': 'Resource',
  '16222:137703': '1 Theme',
  '16222:137704': '2 Element',
  '16222:137705': '3 Component',
  '16215:35516': 'Action',
  '16215:30100': 'Selection and Input',
  '16215:25192': 'Content',
  '16215:20255': 'Navigation',
  '16215:19283': 'Feedback',
  '16215:17599': 'Presentation'
};

for (const [id, label] of Object.entries(requiredPages)) {
  assert(pageIds.has(id), `WDS local fig audit is missing page ${label} (${id}).`);
}

for (const [id, label] of Object.entries(requiredTargets)) {
  assert(targetIds.has(id), `WDS local fig audit is missing target ${label} (${id}).`);
}

assert(audit.decode?.nodeChangeCount >= 100000, 'WDS local fig audit decoded too few node changes.');
assert(audit.decode?.blobCount >= 10000, 'WDS local fig audit decoded too few blobs.');
assert((audit.pageSectionIndex || []).length === (audit.pages || []).length, 'WDS local fig page index must cover every page.');
assert((audit.targets || []).length >= 35, 'WDS local fig target summaries must include full Theme/Element/Component/Foundation coverage.');
assert(componentSections.length >= 57, 'WDS local fig component/section summaries must include detailed section coverage.');

function findTarget(id) {
  return (audit.targets || []).find((target) => target.node.id === id);
}

function targetText(id) {
  const target = findTarget(id);
  assert(target, `WDS local fig audit is missing target ${id}.`);
  return (target.uniqueText || []).join('\n');
}

function assertTargetText(id, label, fragments) {
  const text = targetText(id);
  for (const fragment of fragments) {
    assert(text.includes(fragment), `${label} is missing WDS source text: ${fragment}`);
  }
}

function assertCss(css, fileLabel, fragment) {
  assert(css.includes(fragment), `${fileLabel} is missing expected WDS token fragment: ${fragment}`);
}

assertTargetText('15625:32983', 'Color - Semantic', [
  'Static',
  'Primary',
  'Label',
  'Background',
  'Interaction',
  'Line',
  'Status',
  'Accent',
  'Inverse',
  'Fill',
  'Material',
  'Shadow',
  'color-semantic-interaction-inactive',
  'color-semantic-interaction-disable',
  'color-semantic-line-normal-normal',
  'color-component-material-dimmer',
  'color-semantic-background-transparent-normal',
  'shadow-normal-xlarge'
]);

assertTargetText('15625:54522', 'Typography', [
  'Pretendard JP',
  '7단계',
  '18개',
  'Display 1',
  'Display 2',
  'Display 3',
  'Title 1',
  'Title 2',
  'Title 3',
  'Heading 1',
  'Heading 2',
  'Headline 1',
  'Headline 2',
  'Body 1/Normal',
  'Body 1/Reading',
  'Body 2/Normal',
  'Body 2/Reading',
  'Label 1/Normal',
  'Label 1/Reading',
  'Label 2',
  'Caption 1',
  'Caption 2',
  '56px',
  '72px (1.286)',
  '-0.0319em'
]);

assertTargetText('15625:57936', 'Grid', [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '768px',
  '992px',
  '1200px',
  '1600px',
  '4px',
  '20px',
  '2단 컬럼',
  '3단 컬럼',
  '12단 컬럼',
  '1100px',
  '1440px'
]);

assertCss(typographyCss, 'tokens/typography.css', '--display1-spacing: -0.0319em;');
assertCss(gridCss, 'tokens/grid.css', '--grid-columns-mobile: 2;');
assertCss(gridCss, 'tokens/grid.css', '--grid-columns-tablet: 3;');
assertCss(gridCss, 'tokens/grid.css', '--grid-columns-desktop: 12;');
assertCss(gridCss, 'tokens/grid.css', '--grid-columns: var(--grid-columns-mobile);');
assertCss(gridCss, 'tokens/grid.css', '@media (min-width: 1200px)');
assertCss(gridCss, 'tokens/grid.css', '--grid-columns: var(--grid-columns-desktop);');

assert(
  tokenSource.primitive?.grid?.columnsMobile?.$value === 2 &&
    tokenSource.primitive?.grid?.columnsTablet?.$value === 3 &&
    tokenSource.primitive?.grid?.columnsDesktop?.$value === 12,
  'tokens/source.json must expose WDS mobile/tablet/desktop grid column tokens.'
);

function findSection(label) {
  return componentSections.find((section) => {
    const firstLabel = section.directChildren?.[0]?.label;
    return firstLabel === label || section.node.name === label;
  });
}

function axisValues(section, axisName) {
  const axis = (section?.variantAxes || []).find((item) => item.name === axisName);
  return new Set(axis?.values || []);
}

function assertAxis(label, axisName, values) {
  const section = findSection(label);
  assert(section, `WDS local fig audit is missing section summary for ${label}.`);
  const actual = axisValues(section, axisName);
  for (const value of values) {
    assert(actual.has(value), `${label} is missing WDS axis ${axisName}=${value}.`);
  }
}

assertAxis('Button', 'Variant', ['Solid', 'Outlined']);
assertAxis('Button', 'Color', ['Primary', 'Assistive']);
assertAxis('Text Button', 'Size', ['Small', 'Medium']);
assertAxis('Icon Button', 'Size', ['Small', 'Medium', 'Custom']);
assertAxis('Chip', 'Size', ['XSmall', 'Small', 'Medium', 'Large']);
assertAxis('Textinput', 'Status', ['Normal', 'Positive', 'Negative']);
assertAxis('Textinput', 'Resize', ['Normal', 'Fixed', 'Limit']);
assertAxis('Select', 'Render', ['Text', 'Chip']);
assertAxis('Control', 'State', ['Unchecked', 'Checked', 'Indeterminate']);
assertAxis('Segmented Control', 'Variant', ['Solid', 'Outlined']);
assertAxis('Content Badge', 'Variant', ['Solid', 'Outlined']);
assertAxis('Avatar', 'Variant', ['Person', 'Company', 'Academy']);
assertAxis('List Cell', 'Vertical Padding', ['None', 'Small', 'Medium', 'Large']);
assertAxis('Tab', 'Resize', ['Fill', 'Hug']);
assertAxis('Category', 'Variant', ['Normal', 'Alternative']);
assertAxis('Toast', 'Variant', ['Normal', 'Positive', 'Cautionary', 'Negative']);
assertAxis('Alert', 'Platform', ['iOS', 'Android', 'Web']);
assertAxis('Menu', 'Variant', ['Normal', 'Radio', 'Checkbox']);
assertAxis('Tooltip', 'Position', ['Top', 'Right', 'Bottom', 'Left']);
assertAxis('Skeleton', 'Length', ['25%', '50%', '75%', '100%']);

assert(
  gate.currentCounts?.localFigContentTargets === audit.targets.length,
  'Coverage completion gate localFigContentTargets must match FIGMA_LOCAL_CONTENT_AUDIT target count.'
);
assert(
  gate.currentCounts?.localFigComponentSections === componentSections.length,
  'Coverage completion gate localFigComponentSections must match FIGMA_LOCAL_CONTENT_AUDIT component section count.'
);
assert(
  queue.externalAccess?.localFigExtraction?.targetSummaries === audit.targets.length,
  'Figma node audit queue targetSummaries must match FIGMA_LOCAL_CONTENT_AUDIT target count.'
);
assert(
  queue.externalAccess?.localFigExtraction?.componentSectionSummaries === componentSections.length,
  'Figma node audit queue componentSectionSummaries must match FIGMA_LOCAL_CONTENT_AUDIT component section count.'
);

console.log(
  `Validated WDS local fig content: ${audit.pages.length} pages, ${audit.targets.length} targets, ${componentSections.length} section summaries, ${audit.decode.nodeChangeCount} node changes.`
);
