import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractRelativePath = 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json';
const contractSchemaRelativePath = 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.schema.json';
const reportSchemaRelativePath = 'docs/references/adoption/LDS_UI_ADOPTION_REPORT.schema.json';
const reportExampleRelativePath = 'docs/references/adoption/LDS_UI_ADOPTION_REPORT.example.json';
const workflowRelativePath = 'docs/LDS_UI_ADOPTION_WORKFLOW.md';
const llmsRelativePath = 'llms.txt';

const check = process.argv.includes('--check');
const printTarget = process.argv.find((argument) => argument.startsWith('--print='))?.split('=')[1];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function readJson(relativePath) {
  return JSON.parse(await read(relativePath));
}

function bullets(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function decisionBullets(items) {
  return bullets(items.map(({ id, label }) => `\`${id}\`: ${label}`));
}

function codeBullets(items) {
  return bullets(items.map((item) => `\`${item}\``));
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

function docLink(target, label = target) {
  const relative = path.posix.relative('docs', target.replaceAll('\\', '/'));
  return `[${label}](${relative})`;
}

function rootLink(target, label = target) {
  return `[${label}](${target.replaceAll('\\', '/')})`;
}

function renderReportExample(contract) {
  const reviewedDecision = (requirements, detail) => ({
    verdict: 'reviewed',
    detail,
    evidence: [{ kind: 'decision', ref: 'replace-with-reproducible-evidence' }],
    decisions: requirements.map(({ id, label }) => ({
      decisionId: id,
      outcome: `Replace with the concrete ${label} outcome.`,
      evidence: [{ kind: 'source', ref: `replace-with-${id}-evidence` }],
    })),
  });
  const report = {
    $schema: './LDS_UI_ADOPTION_REPORT.schema.json',
    schemaVersion: 1,
    kind: 'lds-ui-adoption-report',
    contractVersion: contract.contractVersion,
    id: 'replace-with-adoption-id',
    scope: { mode: contract.scopeModes.default, paths: ['src/ui/**'], excluded: [] },
    surfaces: [{
      id: 'replace-with-surface-id',
      paths: ['src/ui/**'],
      facets: Object.fromEntries(contract.facets.map((facet) => [
        facet.id,
        reviewedDecision(
          facet.requiredDecisions,
          `Replace with the reviewed ${facet.title} decision summary and ownership boundary.`,
        ),
      ])),
      componentMapping: reviewedDecision(
        contract.componentMapping.requiredDecisions,
        'Replace with the reviewed owner-package component and composition mapping summary.',
      ),
      verification: {
        viewports: ['1280x800', '360x800'],
        viewportDisposition: 'Replace with normal and narrow viewport verification results.',
        themes: ['light', 'dark'],
        themeDisposition: 'Replace with supported theme and color-scheme verification results.',
        states: ['ready', 'loading'],
        stateDisposition: 'Replace with representative ready and non-ready state verification results.',
        evidence: [{ kind: 'check', ref: 'replace-with-verification-artifact-path' }],
      },
    }],
    exceptions: [],
  };
  return `${JSON.stringify(report, null, 2)}\n`;
}

function renderFacet(facet) {
  const triggerRows = facet.hardTriggers.length
    ? facet.hardTriggers.map((trigger) => [
        `\`${trigger.id}\``,
        trigger.fact,
        trigger.requiredEvidenceKinds.map((kind) => `\`${kind}\``).join(' · '),
      ])
    : [['—', '자동 hard trigger 없음', '작업 범위에 따라 직접 판정']];

  return `### ${facet.title} (\`${facet.id}\`)

${facet.purpose}

Foundation: ${facet.foundationIds.map((id) => `\`${id}\``).join(' · ')}

필수 결정:

${decisionBullets(facet.requiredDecisions)}

Hard trigger:

${table(['ID', '관찰 사실', '필수 evidence kind'], triggerRows)}

참조:

${bullets(facet.references.map((reference) => docLink(reference)))}`;
}

function renderWorkflow(contract) {
  const facetTemplateRows = contract.facets.map((facet) => [
    `\`${facet.id}\``,
    facet.title,
    '`reviewed` / `not-applicable` / `blocked`',
    '관찰·결정·typed evidence 또는 N/A·차단 이유',
  ]);

  return `# LDS UI 적용·전환 워크플로

| Field | Value |
| --- | --- |
| Type | Generated canonical workflow |
| Status | Current |
| Owner | Design system owner |
| Source | \`${contractRelativePath}\` |
| Contract version | \`${contract.contractVersion}\` |

> ${contract.invariant}

이 문서는 \`${contractRelativePath}\`에서 생성됩니다. 직접 수정하지 않습니다. 계약 자체를 바꿀 때는 JSON과 schema를 검토한 뒤 \`node scripts/generate-lds-adoption-docs.mjs\`를 실행합니다.

## 적용 범위

다음 요청은 LDS UI adoption 작업입니다.

${bullets(contract.triggers)}

제품의 실제 동작·데이터·권한·route·backend orchestration은 제품이 소유합니다. LDS adoption은 그 위에 component뿐 아니라 token/theme, layout과 시각 foundation, state/pattern/motion, asset/iconography/brand, content/internationalization, accessibility 계약을 함께 적용합니다.

전환 중 shared component, token, asset, pattern의 변경 필요가 발견되어도 제품 전환 요청이 그 변경 권한을 자동으로 부여하지 않습니다. 해당 변경은 [컴포넌트 워크플로](COMPONENT_WORKFLOW.md), [토큰 거버넌스](TOKEN_GOVERNANCE.md), 저장소의 scope escalation gate를 따로 적용합니다.

## 판정과 typed evidence

각 surface는 6개 facet과 component mapping을 모두 기록합니다. 아래 세 verdict는 facet decision에 적용하며, \`componentMapping\`은 \`reviewed\` 또는 \`blocked\`만 허용합니다.

- \`reviewed\`: 결정을 검토했고 typed evidence가 하나 이상 있습니다.
- \`not-applicable\`: 적용되지 않는 구체적 이유를 \`reasonCode\`와 \`detail\`로 기록합니다.
- \`blocked\`: 완료를 선언하지 않고 차단 원인을 \`detail\`로 기록합니다.

허용 evidence kind:

${codeBullets(contract.evidenceKinds)}

\`source\`, \`asset\`, \`visual\`, \`copy-catalog\`, \`check\`의 \`ref\`는 소비 저장소 안에 실제 존재하는 repo-relative 파일 또는 검사 산출물 경로여야 합니다. Bare 검사 명령이나 자유문장은 \`check\` evidence가 아닙니다. \`token\`은 pinned LDS token inventory에 존재하는 이름이나 경로를, \`story\`는 built Storybook index에 존재하는 exact story ID를 가리키며 story evidence를 쓰거나 story hard trigger가 발생하면 CLI의 \`--storybook-index\`가 필수입니다. \`decision\`은 다른 근거를 설명하는 보조 링크일 뿐 각 세부 결정의 유일한 evidence가 될 수 없습니다.

## 작업 전 탐색 순서

1. 대상 route·surface·source file과 실제 ready/non-ready 상태, 사용자 문구, asset을 inventory합니다.
2. [Foundation index](foundations/README.md)에서 관련 원리와 선택 기준을 읽습니다. 단일 AI context가 필요하면 [Foundation LLM bundle](foundations/llms.txt)을 대신 사용합니다.
3. 관련 CSS 이름과 설명을 [token source](../tokens/source.json)에서 확인합니다. generated CSS 값만 보고 의미를 추론하지 않습니다.
4. 후보 component를 정한 뒤 [component index](components/README.md)와 해당 targeted guide를 읽습니다. 전체 [component LLM bundle](components/llms.txt)은 retrieval/indexing 용도이며 매 작업에서 통째로 읽는 필수 입력이 아닙니다.
5. hard trigger가 있으면 해당 facet이 요구하는 evidence kind와 전문 계약을 반드시 확인합니다.
6. 아래 report schema에 surface별 판정을 기록한 뒤에 component mapping을 확정합니다.

## 필수 facet

${contract.facets.map(renderFacet).join('\n\n')}

## ${contract.componentMapping.title} (\`componentMapping\`)

${contract.componentMapping.purpose}

필수 결정:

${decisionBullets(contract.componentMapping.requiredDecisions)}

참조:

${bullets(contract.componentMapping.references.map((reference) => docLink(reference)))}

component mapping은 6개 비컴포넌트 facet을 대신하지 않습니다. 기존 component를 재사용했더라도 surrounding layout, theme runtime, copy, state, asset과 accessibility 판정은 별도로 남깁니다.

## Report 작성 계약

검증 가능한 attestation은 [\`LDS_UI_ADOPTION_REPORT.schema.json\`](references/adoption/LDS_UI_ADOPTION_REPORT.schema.json)을 따릅니다. 한 report는 scope와 하나 이상의 surface를 가지며, 각 surface에는 다음 항목이 모두 있어야 합니다.

${table(['키', '역할', '판정', '최소 기록'], facetTemplateRows.concat([
    ['`componentMapping`', contract.componentMapping.title, '`reviewed` / `blocked`', 'owner package·reuse/composition·제품 경계 evidence'],
    ['`verification`', '대표 렌더와 상호작용 검증', '별도 verdict 없음', 'viewport·theme·state·typed evidence'],
  ]))}

Report의 기본 \`scope.mode\`는 \`${contract.scopeModes.default}\`입니다. ${contract.scopeModes.fullSurfaceRule}

\`changed-ui\`는 자동 축소 모드가 아닙니다. ${contract.scopeModes.changedUiRule} 기존 화면을 "LDS로 전환", migrate, convert, restyle, parity 구현하거나 materially redesign하는 요청에는 반드시 \`full-surface\`를 사용합니다. 제외 경로는 조용히 생략하지 않고 \`scope.excluded\`에 reason code와 detail을 둡니다.

### Consumer repository setup and enforcement

\`adoption-checklist.json\`은 읽기 전용 계약입니다. 이 파일을 수정하지 않습니다. [Schema-valid report template](references/adoption/LDS_UI_ADOPTION_REPORT.example.json)을 소비 저장소의 \`.lds/adoption-report.json\`으로 복사할 때, template의 상대 \`$schema\`가 가리키는 [report schema](references/adoption/LDS_UI_ADOPTION_REPORT.schema.json)도 같은 디렉터리에 그 basename 그대로 함께 복사합니다. Placeholder를 실제 outcome과 evidence로 모두 교체하며, copied schema는 pinned LDS revision에서 온 read-only 입력으로 관리합니다.

소비 저장소에 [config schema](../packages/conformance/schemas/lds-ui-adoption-config.schema.json)를 따르는 \`.lds/adoption.config.json\`을 둡니다. 기본 report 경로는 \`.lds/adoption-report.json\`이며 config의 \`reportDirectory\`와 CLI \`--report\`로 명시적으로 바꿀 수 있습니다.

\`\`\`json
{
  "schemaVersion": 1,
  "kind": "lds-ui-adoption-config",
  "repository": "consumer-ui",
  "uiRoots": ["src/**"],
  "styleEntry": "src/styles.css",
  "requiredStyleImports": [
    "@lk-design-system/lds-core/styles.css",
    "@lk-design-system/lds-theme/styles.css",
    "@lk-design-system/lds-product/styles.css"
  ],
  "excludedPaths": ["src/generated/**"],
  "reportDirectory": ".lds"
}
\`\`\`

로컬과 CI는 동일한 pinned LDS checkout의 CLI를 실행합니다.

\`\`\`sh
node <pinned-lds>/packages/conformance/src/cli.mjs check-adoption --root . --lds-root <pinned-lds> --config .lds/adoption.config.json --report .lds/adoption-report.json --base <base-sha> --head <head-sha> --output visual-artifacts/adoption/check-result.json
\`\`\`

GitHub Actions에서는 [composite action](../.github/actions/lds-adoption/action.yml)을 immutable LDS commit SHA로 pin합니다. diff base를 읽을 수 있게 caller의 \`actions/checkout\`에 \`fetch-depth: 0\`을 설정합니다.

\`\`\`yaml
- uses: actions/checkout@<immutable-sha>
  with:
    fetch-depth: 0
- uses: LK-Design-System/lk-design-system/.github/actions/lds-adoption@<immutable-lds-sha>
  with:
    root: .
    config: .lds/adoption.config.json
    report: .lds/adoption-report.json
    base: \${{ github.event.pull_request.base.sha }}
    head: \${{ github.sha }}
\`\`\`

## 예외 계약

허용된 예외도 영구적인 무기명 면제가 아닙니다. 각 예외는 다음 필드를 모두 가집니다.

${codeBullets(contract.completion.exceptionRequirements)}

\`signature\`는 예외가 허용하는 정확한 현재 위반의 SHA-256이며, 내용이 달라지면 다시 검토합니다. \`expiresAt\` 이후의 예외는 완료 evidence로 사용할 수 없습니다.

## 완료 조건

- 필수 facet: ${contract.completion.requiredFacetIds.map((id) => `\`${id}\``).join(' · ')}
- \`componentMapping\` 필수: ${contract.completion.requiresComponentMapping ? '예' : '아니요'}
- \`blocked\` 판정이 있으면 완료 실패: ${contract.completion.blockedVerdictFails ? '예' : '아니요'}
- \`not-applicable\`은 이유 필수: ${contract.completion.notApplicableRequiresReason ? '예' : '아니요'}

검증 범위:

${bullets(contract.completion.verification)}

마지막 보고에는 대상 surface, 6개 facet과 component mapping 판정, 사용한 evidence, 남은 예외와 product-owned seam, 실행한 검증을 요약합니다.
`;
}

function renderLlms(contract) {
  return `# LK Design System AI entry

Canonical machine contract: ${rootLink(contractRelativePath)}
Human workflow: ${rootLink(workflowRelativePath)}
Report schema: ${rootLink(reportSchemaRelativePath)}
Contract version: ${contract.contractVersion}

MANDATORY: ${contract.invariant}

For every new product UI, LDS adoption, migration, conversion, restyle, parity implementation, or material redesign:

1. Read ${workflowRelativePath} before editing.
2. Use \`${contract.scopeModes.default}\` for an existing-surface migration, conversion, restyle, parity implementation, or material redesign; \`changed-ui\` is only for an explicitly bounded incremental adoption with the untouched boundary documented.
3. Review all six non-component facets and componentMapping for every surface.
4. Use exactly one verdict per facet decision: ${contract.verdicts.join(' | ')}.
5. componentMapping must be reviewed or blocked; it cannot be not-applicable.
6. A not-applicable facet verdict requires a concrete reason; a blocked verdict prevents completion.
7. Record typed, reproducible evidence using: ${contract.evidenceKinds.join(' | ')}.
8. Validate durable attestations against ${reportSchemaRelativePath}.
9. Create a separate consumer report from ${reportExampleRelativePath}; never edit the generated checklist in a package or \`node_modules\`.
10. Run \`check-adoption\` locally and the pinned \`.github/actions/lds-adoption\` composite action in CI with full git history.

The six required facets are:

${contract.facets.map((facet, index) => `${index + 1}. ${facet.id} — ${facet.title}: ${facet.purpose}`).join('\n')}

Component selection happens only after those decisions:

- componentMapping — ${contract.componentMapping.purpose}

## Facet contract

${contract.facets.map((facet) => `### ${facet.id}: ${facet.title}

Purpose: ${facet.purpose}

Foundation ids: ${facet.foundationIds.join(' | ')}

Required decisions:

${decisionBullets(facet.requiredDecisions)}

Hard triggers:

${facet.hardTriggers.length ? facet.hardTriggers.map((trigger) => `- ${trigger.id}: ${trigger.fact} Evidence: ${trigger.requiredEvidenceKinds.join(' | ')}.`).join('\n') : '- None declared.'}

References:

${bullets(facet.references.map((reference) => rootLink(reference)))}`).join('\n\n')}

## componentMapping contract

Purpose: ${contract.componentMapping.purpose}

Required decisions:

${decisionBullets(contract.componentMapping.requiredDecisions)}

References:

${bullets(contract.componentMapping.references.map((reference) => rootLink(reference)))}

componentMapping must be reviewed or blocked and must include typed evidence when reviewed.

## Completion contract

- Required facet ids: ${contract.completion.requiredFacetIds.join(' | ')}
- componentMapping required: ${contract.completion.requiresComponentMapping}
- blocked verdict fails completion: ${contract.completion.blockedVerdictFails}
- not-applicable facet requires reason: ${contract.completion.notApplicableRequiresReason}
- exception fields: ${contract.completion.exceptionRequirements.join(' | ')}

Verification:

${bullets(contract.completion.verification)}

Detailed non-component guidance:

- ${rootLink('docs/agent-skills/lds-ui/SKILL.md')} — consumer agent skill; copy docs/agent-skills/lds-ui into the consuming repository's .claude/skills/lds-ui
- ${rootLink('docs/foundations/README.md')} — human Foundation index
- ${rootLink('docs/foundations/llms.txt')} — complete generated Foundation context
- ${rootLink('tokens/source.json')} — structured token source of truth
- ${rootLink('docs/LOADING_PATTERN.md')} — cross-component loading selection
- ${rootLink('packages/core/assets/icons/manifest.json')} — icon inventory
- ${rootLink('docs/components/README.md')} — targeted component-guide entry
- ${rootLink('docs/components/llms.txt')} — large retrieval bundle; load selectively
`;
}

async function verifyReference(reference) {
  if (/^https?:\/\//.test(reference)) return;
  try {
    await access(path.join(root, reference));
  } catch {
    throw new Error(`Adoption contract reference does not exist: ${reference}`);
  }
}

async function validateSources(contract, contractSchema, reportSchema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateContract = ajv.compile(contractSchema);
  assert(validateContract(contract), `Adoption contract schema violations:\n${ajv.errorsText(validateContract.errors, { separator: '\n' })}`);
  ajv.compile(reportSchema);

  const facetIds = contract.facets.map(({ id }) => id);
  assert(new Set(facetIds).size === facetIds.length, 'Adoption facet ids must be unique.');
  assert(
    JSON.stringify(facetIds) === JSON.stringify(contract.completion.requiredFacetIds),
    'Adoption facets and completion.requiredFacetIds must have identical order and membership.',
  );

  const reportFacetProperties = reportSchema.$defs?.surface?.properties?.facets?.properties ?? {};
  const reportFacetIds = Object.keys(reportFacetProperties);
  assert(
    JSON.stringify(reportFacetIds) === JSON.stringify(facetIds),
    'Report schema facet properties must match the adoption contract facets.',
  );

  const reportVerdicts = reportSchema.$defs?.decision?.properties?.verdict?.enum ?? [];
  assert(
    JSON.stringify(reportVerdicts) === JSON.stringify(contract.verdicts),
    'Report schema verdicts must match the adoption contract verdicts.',
  );

  const componentVerdicts = reportSchema.$defs?.componentDecision?.properties?.verdict?.enum ?? [];
  assert(
    JSON.stringify(componentVerdicts) === JSON.stringify(['reviewed', 'blocked']),
    'Report schema componentMapping verdicts must be reviewed or blocked.',
  );

  const reportEvidenceKinds = reportSchema.$defs?.evidence?.properties?.kind?.enum ?? [];
  assert(
    JSON.stringify(reportEvidenceKinds) === JSON.stringify(contract.evidenceKinds),
    'Report schema evidence kinds must match the adoption contract evidence kinds.',
  );

  const reportScopeModes = reportSchema.$defs?.scope?.properties?.mode?.enum ?? [];
  assert(
    reportScopeModes.includes(contract.scopeModes.default)
      && reportScopeModes.includes('changed-ui')
      && reportScopeModes.includes('full-surface'),
    'Report schema scope modes must include the canonical default, changed-ui, and full-surface.',
  );

  const foundationContent = await readJson('docs/foundations/foundation-content.json');
  const foundationIds = new Set(foundationContent.foundations.map(({ slug }) => slug));
  const assignedFoundationIds = contract.facets.flatMap((facet) => facet.foundationIds);
  assert(
    assignedFoundationIds.length === new Set(assignedFoundationIds).size,
    'Every canonical Foundation must belong to exactly one adoption facet.',
  );
  assert(
    assignedFoundationIds.length === foundationIds.size
      && assignedFoundationIds.every((foundationId) => foundationIds.has(foundationId)),
    'Adoption facets must cover the complete canonical Foundation inventory.',
  );
  for (const facet of contract.facets) {
    for (const foundationId of facet.foundationIds) {
      assert(foundationIds.has(foundationId), `${facet.id}: unknown Foundation id ${foundationId}.`);
    }
    const schemaRequirements = (reportSchema.$defs?.[`${facet.id}Decisions`]?.allOf ?? [])
      .map((entry) => entry.contains?.properties?.decisionId?.const)
      .filter(Boolean);
    assert(
      JSON.stringify(schemaRequirements) === JSON.stringify(facet.requiredDecisions.map(({ id }) => id)),
      `${facet.id}: report decision requirements must exactly match the canonical contract.`,
    );
    assert(
      facet.requiredDecisions.length === new Set(facet.requiredDecisions.map(({ id }) => id)).size,
      `${facet.id}: required decision ids must be unique.`,
    );
    for (const reference of facet.references) await verifyReference(reference);
  }
  const componentSchemaRequirements = (reportSchema.$defs?.componentMappingDecisions?.allOf ?? [])
    .map((entry) => entry.contains?.properties?.decisionId?.const)
    .filter(Boolean);
  assert(
    JSON.stringify(componentSchemaRequirements) === JSON.stringify(contract.componentMapping.requiredDecisions.map(({ id }) => id)),
    'componentMapping report decision requirements must exactly match the canonical contract.',
  );
  assert(
    contract.componentMapping.requiredDecisions.length
      === new Set(contract.componentMapping.requiredDecisions.map(({ id }) => id)).size,
    'componentMapping required decision ids must be unique.',
  );
  for (const reference of contract.componentMapping.references) await verifyReference(reference);
}

async function emit(relativePath, content) {
  const expected = content.endsWith('\n') ? content : `${content}\n`;
  const absolute = path.join(root, relativePath);
  if (check) {
    const current = await readFile(absolute, 'utf8').catch(() => '');
    assert(current === expected, `Generated adoption artifact is stale: ${relativePath}`);
    return;
  }
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, expected, 'utf8');
}

const [contract, contractSchema, reportSchema] = await Promise.all([
  readJson(contractRelativePath),
  readJson(contractSchemaRelativePath),
  readJson(reportSchemaRelativePath),
]);

await validateSources(contract, contractSchema, reportSchema);
const workflow = renderWorkflow(contract);
const llms = renderLlms(contract);
const reportExample = renderReportExample(contract);
const exampleAjv = new Ajv2020({ allErrors: true, strict: true });
addFormats(exampleAjv);
const validateReportExample = exampleAjv.compile(reportSchema);
assert(
  validateReportExample(JSON.parse(reportExample)),
  `Generated adoption report example is invalid:\n${exampleAjv.errorsText(validateReportExample.errors, { separator: '\n' })}`,
);

if (printTarget) {
  if (printTarget === 'workflow') process.stdout.write(workflow);
  else if (printTarget === 'llms') process.stdout.write(llms);
  else if (printTarget === 'report-example') process.stdout.write(reportExample);
  else throw new Error(`Unknown --print target: ${printTarget}`);
} else {
  await emit(workflowRelativePath, workflow);
  await emit(llmsRelativePath, llms);
  await emit(reportExampleRelativePath, reportExample);
  console.log(`${check ? 'Validated' : 'Generated'} LDS adoption workflow and root LLM entry from contract version ${contract.contractVersion}.`);
}
