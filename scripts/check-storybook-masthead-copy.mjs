import path from 'node:path';
import { auditStorybookMastheadCopy } from '../packages/conformance/src/storybook-masthead-copy.mjs';

const root = process.cwd();
const contractPath = path.join(
  root,
  'docs',
  'references',
  'quality',
  'STORYBOOK_MASTHEAD_COPY_CONTRACT.json',
);
const result = await auditStorybookMastheadCopy({ root, contractPath });

if (result.findings.length > 0) {
  for (const finding of result.findings) {
    const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
    console.error(`[${finding.code}] ${location} ${finding.message}`);
  }
  process.exitCode = 1;
} else {
  const metrics = result.metrics;
  console.log(
    `Storybook masthead copy passed (${metrics.count} pages; `
      + `mean ${metrics.meanCharacters}, median ${metrics.medianCharacters}, `
      + `p90 ${metrics.p90Characters}, max ${metrics.maximumCharacters} characters).`,
  );
}
