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
    phrases: ['Required component contract', 'Refinement public surface register', 'LdsProvider runtime contract', 'Initial state matrix', 'Disallowed patterns'],
  },
  {
    file: 'docs/ROBOTICS_PATTERNS.md',
    phrases: ['Domain component contracts', 'Status semantics', 'Do not publish end-to-end flow pages'],
  },
  {
    file: 'docs/OPERATING_MODEL.md',
    phrases: ['Contribution path', 'Pull request checklist', 'Release checklist'],
  },
  {
    file: 'docs/COMPONENT_SURFACE_CONTRACT.md',
    phrases: ['Root and native target', 'Named parts', 'Component variables', 'Initial 15-component conformance register'],
  },
  {
    file: 'docs/OVERLAY_PLATFORM_CONTRACT.md',
    phrases: ['Portal and runtime scope', 'Anchored overlays', 'Modal overlays', 'Required evidence'],
  },
];

const refinementComponents = [
  ['Button', 'components/buttons/Button.d.ts', 'stories/Button.stories.jsx'],
  ['Input', 'components/forms/Input.d.ts', 'stories/FormInput.stories.jsx'],
  ['Textarea', 'components/forms/Textarea.d.ts', 'stories/FormTextarea.stories.jsx'],
  ['SearchField', 'components/forms/SearchField.d.ts', 'stories/FormSearchAutocomplete.stories.jsx'],
  ['Select', 'components/forms/Select.d.ts', 'stories/FormSelect.stories.jsx'],
  ['FieldAction', 'components/forms/FieldAction.d.ts', 'stories/FormFieldAction.stories.jsx'],
  ['SegmentedControl', 'components/selection/SegmentedControl.d.ts', 'stories/SelectionSegmentedControl.stories.jsx'],
  ['Tabs', 'components/navigation/Tabs.d.ts', 'stories/NavigationTabs.stories.jsx'],
  ['Card', 'components/cards/Card.d.ts', 'stories/Card.stories.jsx'],
  ['DataToolbar', 'components/data/DataToolbar.d.ts', 'stories/DataToolbar.stories.jsx'],
  ['SideNav', 'components/navigation/SideNav.d.ts', 'stories/NavigationSideNav.stories.jsx'],
  ['DropdownMenu', 'components/overlay/DropdownMenu.d.ts', 'stories/OverlayDropdownMenu.stories.jsx'],
  ['Popover', 'components/overlay/Popover.d.ts', 'stories/OverlayPopover.stories.jsx'],
  ['Tooltip', 'components/content/Tooltip.d.ts', 'stories/ContentTooltip.stories.jsx'],
  ['Modal', 'components/overlay/Modal.d.ts', 'stories/OverlayModal.stories.jsx'],
];

const portalDeclarations = [
  'components/forms/Select.d.ts',
  'components/overlay/DropdownMenu.d.ts',
  'components/overlay/Popover.d.ts',
  'components/content/Tooltip.d.ts',
  'components/overlay/Modal.d.ts',
  'components/overlay/Drawer.d.ts',
  'components/overlay/Sheet.d.ts',
  'components/overlay/ConfirmDialog.d.ts',
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

for (const [name, declarationFile, storyFile] of refinementComponents) {
  try {
    const declaration = await readProjectFile(declarationFile);
    for (const phrase of [`export type ${name}Part`, 'classNames?:', 'styles?:', 'vars?:']) {
      if (!declaration.includes(phrase)) failures.push(`${declarationFile} is missing ${name} surface declaration: ${phrase}`);
    }
    if (!declaration.includes('RefAttributes<') && !declaration.includes('ref?: React.ComponentPropsWithRef')) {
      failures.push(`${declarationFile} does not declare the ${name} ref target.`);
    }
  } catch (error) {
    failures.push(`${declarationFile} could not be read: ${error.message}`);
  }

  try {
    const story = await readProjectFile(storyFile);
    if (!story.includes('Surface and ref contract') && !story.includes('Surface, ref, and Portal contract') && !story.includes('surface and ref contract')) {
      failures.push(`${storyFile} is missing the ${name} surface/ref Storybook contract.`);
    }
  } catch (error) {
    failures.push(`${storyFile} could not be read: ${error.message}`);
  }
}

for (const declarationFile of portalDeclarations) {
  try {
    const declaration = await readProjectFile(declarationFile);
    for (const phrase of ['withinPortal?:', 'portalTarget?:', 'zIndex?:']) {
      if (!declaration.includes(phrase)) failures.push(`${declarationFile} is missing overlay API: ${phrase}`);
    }
  } catch (error) {
    failures.push(`${declarationFile} could not be read: ${error.message}`);
  }
}

try {
  const provider = await readProjectFile('components/selection/LdsProvider.d.ts');
  for (const phrase of ['LdsProviderProps', 'colorScheme?:', 'storageManager?:', 'portalTarget?:', 'zIndexBase?:', 'LdsColorSchemeScript']) {
    if (!provider.includes(phrase)) failures.push(`components/selection/LdsProvider.d.ts is missing runtime API: ${phrase}`);
  }
} catch (error) {
  failures.push(`components/selection/LdsProvider.d.ts could not be read: ${error.message}`);
}

try {
  const overlayPlatform = await readProjectFile('components/overlay/overlay-platform.js');
  for (const phrase of ['createPortal', 'OverlayRuntimeProvider', 'useOverlayLayer', 'data-lds-overlay-portal', 'inheritedPortalScope']) {
    if (!overlayPlatform.includes(phrase)) failures.push(`components/overlay/overlay-platform.js is missing platform behavior: ${phrase}`);
  }
} catch (error) {
  failures.push(`components/overlay/overlay-platform.js could not be read: ${error.message}`);
}

assert(failures.length === 0, `Design system contract coverage failed:\n${failures.join('\n')}`);

console.log(`Validated design system contract coverage: ${requiredDocs.length} docs, ${refinementComponents.length} component surfaces, ${portalDeclarations.length} Portal declarations, and Provider/overlay runtime contracts.`);
