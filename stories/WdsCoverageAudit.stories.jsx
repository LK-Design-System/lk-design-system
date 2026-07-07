import React from 'react';
import coverageAudit from '../docs/references/wds/COVERAGE_AUDIT.json';
import coverageDetailAudit from '../docs/references/wds/COVERAGE_DETAIL_AUDIT.json';
import foundationAudit from '../docs/references/wds/FOUNDATION_AUDIT.json';
import foundationSourcePdfs from '../docs/references/wds/FOUNDATION_SOURCE_PDFS.json';
import componentSourcePdfs from '../docs/references/wds/COMPONENT_SOURCE_PDFS.json';
import figmaNodeAuditQueue from '../docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json';
import completionGate from '../docs/references/wds/COVERAGE_COMPLETION_GATE.json';
import publicExportClassification from '../docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json';
import variantAuditChecklist from '../docs/references/wds/VARIANT_AUDIT_CHECKLIST.json';

const meta = {
  title: 'Documents/WDS Alignment/Coverage Audit',
  parameters: {
    docs: {
      description: {
        component: 'Section-level coverage audit between WDS Community Figma structure and LDS Storybook, token, and component coverage.',
      },
    },
  },
};

export default meta;

const statusTone = {
  covered: { label: 'Covered', color: 'var(--color-positive)', bg: 'color-mix(in srgb, var(--color-positive) 14%, transparent)' },
  'theme-overridden': { label: 'Theme override', color: 'var(--color-primary)', bg: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' },
  partial: { label: 'Partial', color: 'var(--color-cautionary)', bg: 'color-mix(in srgb, var(--color-cautionary) 16%, transparent)' },
  'needs-detail-audit': { label: 'Needs detail audit', color: 'var(--label-alternative)', bg: 'var(--fill-normal)' },
  'not-covered': { label: 'Not covered', color: 'var(--color-danger)', bg: 'color-mix(in srgb, var(--color-danger) 12%, transparent)' },
};

const rows = coverageAudit.pages.flatMap((page) =>
  page.sections.map((section) => ({
    page: page.wdsPage,
    ...section,
  }))
);
const familyRows = coverageDetailAudit.families;
const foundationRows = foundationAudit.foundations;
const sourcePdfRows = foundationSourcePdfs.pdfs;
const componentPdfRows = componentSourcePdfs.pdfs;
const figmaQueueRows = figmaNodeAuditQueue.queue;
const completionGateRows = completionGate.localEvidenceGates;
const exportGroups = publicExportClassification.groups;
const variantFamilies = variantAuditChecklist.families;

const classificationTone = {
  'direct-wds': { label: 'Direct WDS', color: 'var(--color-positive)', bg: 'color-mix(in srgb, var(--color-positive) 14%, transparent)' },
  'wds-adjacent': { label: 'WDS adjacent', color: 'var(--color-cautionary)', bg: 'color-mix(in srgb, var(--color-cautionary) 16%, transparent)' },
  'theme-override': { label: 'Theme override', color: 'var(--color-primary)', bg: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' },
  'product-extension': { label: 'Product extension', color: 'var(--label-neutral)', bg: 'var(--fill-normal)' },
  'robotics-extension': { label: 'Robotics extension', color: 'var(--color-primary)', bg: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' },
};

function StatusPill({ status }) {
  const tone = statusTone[status] || statusTone['needs-detail-audit'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 24,
        padding: '0 var(--space-2)',
        borderRadius: '999px',
        background: tone.bg,
        color: tone.color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {tone.label}
    </span>
  );
}

function ClassificationPill({ classification }) {
  const tone = classificationTone[classification] || classificationTone['wds-adjacent'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 24,
        padding: '0 var(--space-2)',
        borderRadius: '999px',
        background: tone.bg,
        color: tone.color,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {tone.label}
    </span>
  );
}

function CodeList({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
      {items.map((item) => (
        <code
          key={item}
          style={{
            display: 'inline-flex',
            maxWidth: '100%',
            padding: '2px var(--space-2)',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--fill-normal)',
            color: 'var(--label-neutral)',
            fontSize: 12,
            wordBreak: 'break-word',
          }}
        >
          {item}
        </code>
      ))}
    </div>
  );
}

function queueStatusToCoverageStatus(status) {
  if (status === 'confirmed-covered') return 'covered';
  if (status === 'theme-override-review') return 'theme-overridden';
  if (status === 'local-evidence-pending-figma') return 'partial';
  return 'needs-detail-audit';
}

function gateStatusToCoverageStatus(status) {
  if (status === 'met') return 'covered';
  if (status === 'not-met') return 'not-covered';
  return 'partial';
}

function AuditTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS source', 'Status', 'LDS coverage', 'Gap notes'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.page}-${row.wdsSection}`}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 220 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.page}</strong>
                <span style={{ color: 'var(--label-neutral)' }}>{row.wdsSection}</span>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.figmaNodeId}
                </code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 150 }}>
                <StatusPill status={row.status} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <CodeList items={row.ldsCoverage} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FoundationTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS foundation', 'Status', 'Token evidence', 'Story/file evidence', 'Notes'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {foundationRows.map((row) => (
            <tr key={row.wdsSource}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 230 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.wdsSource}</strong>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 150 }}>
                <StatusPill status={row.status === 'mapped' ? 'covered' : row.status === 'theme-overridden' ? 'theme-overridden' : 'needs-detail-audit'} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 300 }}>
                {row.cssTokens.length > 0 ? <CodeList items={row.cssTokens} /> : <span style={{ color: 'var(--label-alternative)' }}>No runtime CSS token</span>}
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <CodeList items={[...row.storyEvidence, ...row.fileEvidence]} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FoundationSourcePdfTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS source', 'PDF file', 'Extracted structure', 'Local evidence'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sourcePdfRows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 240 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.wdsSource}</strong>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.id}
                </code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 240 }}>
                <CodeList items={[row.file]} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 320 }}>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                  {row.extractedStructure.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <CodeList items={row.localEvidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentSourcePdfTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS source', 'PDF file', 'Extracted structure', 'Local evidence'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {componentPdfRows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 240 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.wdsSource}</strong>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.id}
                </code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 240 }}>
                <CodeList items={[row.file]} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 320 }}>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                  {row.extractedStructure.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <CodeList items={row.localEvidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FigmaNodeQueueTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1180, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS node', 'Status', 'Closure criteria', 'Local evidence', 'Next Figma reads'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {figmaQueueRows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 240 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.wdsSource}</strong>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.figmaNodeId}
                </code>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.id}
                </code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 170 }}>
                <StatusPill status={queueStatusToCoverageStatus(row.status)} />
                <span style={{ display: 'block', marginTop: 'var(--space-2)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.status}
                </span>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 330 }}>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                  {row.closureCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 260 }}>
                <CodeList items={row.localEvidence} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 300 }}>
                {row.nextFigmaReads.length > 0 ? (
                  <CodeList items={row.nextFigmaReads} />
                ) : (
                  <span style={{ color: 'var(--label-alternative)' }}>No pending Figma read</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompletionGateTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['Gate', 'Status', 'Evidence', 'Criteria'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {completionGateRows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 230 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.id}</strong>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 190 }}>
                <StatusPill status={gateStatusToCoverageStatus(row.status)} />
                <span style={{ display: 'block', marginTop: 'var(--space-2)', color: 'var(--label-alternative)', fontSize: 12 }}>
                  {row.status}
                </span>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 300 }}>
                <CodeList items={[row.evidence]} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                {row.criteria}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FamilyTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1060, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS family', 'Status', 'Components', 'Stories', 'Pending Figma audit'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {familyRows.map((row) => (
            <tr key={row.wdsFamily}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 220 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.wdsFamily}</strong>
                <span style={{ color: 'var(--label-neutral)' }}>{row.wdsSection}</span>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 150 }}>
                <StatusPill status={row.status === 'extension-evidence' ? 'theme-overridden' : 'partial'} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 310 }}>
                <CodeList items={row.components.map((component) => component.name)} />
                {row.extensionComponents?.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <CodeList items={row.extensionComponents.map((component) => `+ ${component.name}`)} />
                  </div>
                )}
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 280 }}>
                <CodeList items={row.stories} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {row.pendingFigmaAudit.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportClassificationTable() {
  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['Group', 'Layer', 'Classification', 'Exports', 'Evidence'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exportGroups.map((group) => (
            <tr key={group.name}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 220 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{group.name}</strong>
                {group.wdsFamily && (
                  <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>
                    {group.wdsFamily}
                  </code>
                )}
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 150 }}>
                <code style={{ color: 'var(--label-neutral)', fontSize: 12 }}>{group.layer}</code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 170 }}>
                <ClassificationPill classification={group.classification} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <CodeList items={group.exports} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 280 }}>
                <CodeList items={group.storyEvidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VariantChecklistTable() {
  const checklistRows = variantFamilies.flatMap((family) =>
    family.checks.map((check) => ({
      family: family.wdsFamily,
      familyStatus: family.status,
      ...check,
    }))
  );

  return (
    <div style={{ overflowX: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse', background: 'var(--surface-card)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-subtle)' }}>
            {['WDS family', 'Variant check', 'WDS checks', 'Storybook evidence'].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: 'var(--space-3)',
                  borderBottom: 'var(--border-hairline)',
                  color: 'var(--label-normal)',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {checklistRows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 210 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.family}</strong>
                <StatusPill status={row.familyStatus === 'extension-boundary' ? 'theme-overridden' : 'needs-detail-audit'} />
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 220 }}>
                <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{row.label}</strong>
                <code style={{ display: 'block', marginTop: 'var(--space-1)', color: 'var(--label-alternative)', fontSize: 12 }}>{row.id}</code>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 360 }}>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--label-neutral)', lineHeight: 1.55 }}>
                  {row.wdsChecks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: 'var(--space-3)', borderBottom: 'var(--border-hairline)', verticalAlign: 'top', width: 320 }}>
                <CodeList items={row.localEvidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const SectionMatrix = {
  name: 'Section matrix',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1180 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          WDS coverage audit
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          WDS source sections vs LDS coverage
        </h1>
        <p style={{ margin: 0, maxWidth: 860, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          This matrix tracks whether LDS preserves WDS Community structure directly, replaces it through an LK theme override, or still needs a detail audit.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{coverageAudit.pages.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>WDS pages inspected</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{rows.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>Section rows tracked</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{coverageAudit.knownCoveredFindings.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>Confirmed detail findings</span>
        </div>
      </section>

      <AuditTable />
    </main>
  ),
};

export const CompletionGate = {
  name: 'Completion gate',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1180 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Coverage completion gate
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          Full WDS coverage is {completionGate.claimStatus}
        </h1>
        <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          {completionGate.claimPolicy}
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {completionGate.currentCounts.figmaNodeQueueRows}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Figma node rows</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--color-cautionary)', fontSize: 24 }}>
            {completionGate.currentCounts.pendingFigmaNodeRows}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Pending node rows</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {completionGate.currentCounts.requiredExternalFigmaReads}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Required Figma reads</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {completionGate.currentCounts.publicExportsClassified}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Classified public exports</span>
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)', color: 'var(--label-strong)' }}>
          Not-ready reasons
        </h2>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          {completionGate.notReadyReasons.map((reason) => (
            <article
              key={reason.id}
              style={{
                padding: 'var(--space-4)',
                border: 'var(--border-hairline)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-card)',
              }}
            >
              <strong style={{ display: 'block', color: 'var(--label-strong)' }}>{reason.id}</strong>
              <p style={{ margin: 'var(--space-2) 0', color: 'var(--label-neutral)', lineHeight: 1.55 }}>{reason.detail}</p>
              <CodeList items={[reason.source]} />
            </article>
          ))}
        </div>
      </section>

      <CompletionGateTable />
    </main>
  ),
};

export const DetailBacklog = {
  name: 'Detail backlog',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 920 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Next audit targets
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          Node-level parity backlog
        </h1>
      </header>

      <ol style={{ margin: 0, paddingLeft: 22, display: 'grid', gap: 'var(--space-3)', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
        {coverageAudit.nextDetailAuditTargets.map((target) => (
          <li key={target}>{target}</li>
        ))}
      </ol>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>
          Confirmed detail coverage
        </h2>
        {coverageAudit.knownCoveredFindings.map((finding) => (
          <article key={finding.figmaNodeId} style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--label-strong)' }}>{finding.wdsSource}</strong>
            <CodeList items={finding.ldsCoverage} />
            <p style={{ margin: 'var(--space-3) 0 0', color: 'var(--label-neutral)', lineHeight: 1.55 }}>{finding.notes}</p>
          </article>
        ))}
      </section>
    </main>
  ),
};

export const FoundationMatrix = {
  name: 'Foundation matrix',
  render: () => {
    const tokenCount = foundationRows.reduce((total, row) => total + row.cssTokens.length, 0);
    const mappedCount = foundationRows.filter((row) => row.status === 'mapped').length;

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
        <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
            Foundation coverage
          </p>
          <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
            WDS foundations mapped to LDS tokens
          </h1>
          <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            This matrix tracks WDS theme and element foundations across LDS token files, Storybook foundation pages, and LK theme overrides.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{foundationRows.length}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Foundation rows</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{mappedCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Mapped rows</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{tokenCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>CSS token refs</span>
          </div>
        </section>

        <FoundationTable />
      </main>
    );
  },
};

export const FoundationSourcePdfs = {
  name: 'Foundation source PDFs',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Local Figma PDF evidence
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          PDF exports mapped to LDS foundation evidence
        </h1>
        <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          These local Figma PDF exports preserve the source evidence for Basic Ratio, Spacing Safe Area, and Decorate
          Gradient/Interaction while full Figma node reads are rate-limited.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{sourcePdfRows.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>PDF exports tracked</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {sourcePdfRows.reduce((total, row) => total + row.localEvidence.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Local evidence refs</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {sourcePdfRows.reduce((total, row) => total + row.extractedStructure.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Extracted source notes</span>
        </div>
      </section>

      <FoundationSourcePdfTable />
    </main>
  ),
};

export const ComponentSourcePdfs = {
  name: 'Component source PDFs',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Local component PDF evidence
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          Component PDFs mapped to LDS components and stories
        </h1>
        <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          These local Figma PDF exports preserve component source evidence for Layout Essential/Divider and Action Area/controls
          while full Figma node reads are rate-limited.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{componentPdfRows.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>Component PDF exports</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {componentPdfRows.reduce((total, row) => total + row.localEvidence.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Local evidence refs</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {componentPdfRows.reduce((total, row) => total + row.extractedStructure.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Extracted source notes</span>
        </div>
      </section>

      <ComponentSourcePdfTable />
    </main>
  ),
};

export const FigmaNodeQueue = {
  name: 'Figma node queue',
  render: () => {
    const pendingCount = figmaQueueRows.filter((row) => row.status !== 'confirmed-covered').length;
    const confirmedCount = figmaQueueRows.length - pendingCount;

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1240 }}>
        <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
            Figma source audit queue
          </p>
          <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
            Node-level reads still needed for full WDS coverage
          </h1>
          <p style={{ margin: 0, maxWidth: 920, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            This queue prevents broad `partial` rows from hiding missing work. Every WDS section row has a concrete source node, closure criteria,
            local LDS evidence, and the next read to perform once Figma access is available.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{figmaQueueRows.length}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Queued source nodes</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{pendingCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Pending Figma reads</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{confirmedCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Confirmed detail nodes</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 16 }}>{figmaNodeAuditQueue.externalAccess.currentStatus}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>External access status</span>
          </div>
        </section>

        <FigmaNodeQueueTable />
      </main>
    );
  },
};

export const FamilyEvidence = {
  name: 'Family evidence',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          WDS family evidence
        </p>
        <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
          WDS component families mapped to LDS code
        </h1>
        <p style={{ margin: 0, maxWidth: 880, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          This table proves local LDS evidence for each WDS family in `TOKEN_MAP.json`: implementation file, public export, and Storybook coverage.
          It still leaves Figma node-level variant parity as the next audit pass.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{familyRows.length}</strong>
          <span style={{ color: 'var(--label-neutral)' }}>WDS family rows</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {familyRows.reduce((total, row) => total + row.components.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Core component evidence rows</span>
        </div>
        <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
          <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>
            {familyRows.reduce((total, row) => total + row.stories.length, 0)}
          </strong>
          <span style={{ color: 'var(--label-neutral)' }}>Story evidence links</span>
        </div>
      </section>

      <FamilyTable />
    </main>
  ),
};

export const PublicExportClassification = {
  name: 'Public export classification',
  render: () => {
    const exportCount = exportGroups.reduce((total, group) => total + group.exports.length, 0);
    const directWdsCount = exportGroups
      .filter((group) => group.classification === 'direct-wds')
      .reduce((total, group) => total + group.exports.length, 0);
    const extensionCount = exportGroups
      .filter((group) => group.classification.endsWith('extension'))
      .reduce((total, group) => total + group.exports.length, 0);

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
        <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
            Public export classification
          </p>
          <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
            Every LDS export has a WDS/LK layer
          </h1>
          <p style={{ margin: 0, maxWidth: 880, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            This table prevents LDS-only components from silently becoming WDS Core. Each public export is classified as direct WDS,
            WDS-adjacent, LK theme override, product extension, or robotics extension.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{exportCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Public exports classified</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{directWdsCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Direct WDS exports</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{extensionCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Extension exports</span>
          </div>
        </section>

        <ExportClassificationTable />
      </main>
    );
  },
};

export const VariantAuditChecklist = {
  name: 'Variant audit checklist',
  render: () => {
    const checkCount = variantFamilies.reduce((total, family) => total + family.checks.length, 0);
    const evidenceCount = variantFamilies.reduce(
      (total, family) => total + family.checks.reduce((subtotal, check) => subtotal + check.localEvidence.length, 0),
      0
    );

    return (
      <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 1220 }}>
        <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
            Variant parity checklist
          </p>
          <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>
            What still needs Figma comparison
          </h1>
          <p style={{ margin: 0, maxWidth: 900, color: 'var(--label-neutral)', lineHeight: 1.6 }}>
            Each row names the WDS variant, state, slot, or behavior that must be checked against the Figma source.
            The Storybook evidence links show where LDS currently demonstrates the corresponding behavior.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{variantFamilies.length}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>WDS families tracked</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{checkCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Variant checks</span>
          </div>
          <div style={{ padding: 'var(--space-4)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)' }}>
            <strong style={{ display: 'block', color: 'var(--label-strong)', fontSize: 24 }}>{evidenceCount}</strong>
            <span style={{ color: 'var(--label-neutral)' }}>Story evidence refs</span>
          </div>
        </section>

        <VariantChecklistTable />
      </main>
    );
  },
};
