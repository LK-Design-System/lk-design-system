import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const requiredDocs = [
  {
    file: 'docs/ACCESSIBILITY_CONTRACTS.md',
    phrases: ['Keyboard baseline', 'Focus policy', 'Release gate'],
  },
  {
    file: 'docs/TOKEN_GOVERNANCE.md',
    phrases: ['Token layers', 'Lifecycle', 'Figma sync contract'],
  },
  {
    file: 'docs/COMPONENT_API_STATE_MATRIX.md',
    phrases: ['Required component contract', 'Initial state matrix', 'Disallowed patterns'],
  },
  {
    file: 'docs/ROBOTICS_PATTERNS.md',
    phrases: ['Domain component contracts', 'Status semantics', 'Do not publish end-to-end flow pages'],
  },
  {
    file: 'docs/OPERATING_MODEL.md',
    phrases: ['Contribution path', 'Pull request checklist', 'Release checklist'],
  },
];

const requiredStories = [
  {
    file: 'stories/OperatingGuides.stories.jsx',
    exports: ['AccessibilityContracts', 'TokenGovernance', 'ComponentStateMatrix', 'RoboticsComponentContracts'],
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readProjectFile(file) {
  return readFile(path.join(root, file), 'utf8');
}

const failures = [];

for (const doc of requiredDocs) {
  try {
    const source = await readProjectFile(doc.file);
    for (const phrase of doc.phrases) {
      if (!source.includes(phrase)) failures.push(`${doc.file} is missing required section: ${phrase}`);
    }
  } catch (error) {
    failures.push(`${doc.file} could not be read: ${error.message}`);
  }
}

for (const story of requiredStories) {
  try {
    const source = await readProjectFile(story.file);
    for (const exportName of story.exports) {
      if (!source.includes(`export const ${exportName}`)) failures.push(`${story.file} is missing Storybook export: ${exportName}`);
    }
  } catch (error) {
    failures.push(`${story.file} could not be read: ${error.message}`);
  }
}

assert(failures.length === 0, `Design system contract coverage failed:\n${failures.join('\n')}`);

console.log(`Validated design system contract coverage: ${requiredDocs.length} docs, ${requiredStories.length} Storybook files.`);
