import { EditorToolbar } from '../../src/index.js';

const readonlyItems = [
  { value: 'select', label: 'Select' },
  { value: 'region', label: 'Region', disabled: true, disabledReason: 'Read-only layer' },
] as const;

const controlled = (
  <EditorToolbar
    items={readonlyItems}
    value="select"
    onChange={(value) => value.toUpperCase()}
    orientation="horizontal"
    disabledReason="Document is read-only"
  />
);

const uncontrolled = <EditorToolbar items={readonlyItems} defaultValue="region" />;

const missingLabel = [{ value: 'select' }] as const;
// @ts-expect-error Icon-only editor tools require a human-readable label.
const invalidMissingLabel = <EditorToolbar items={missingLabel} />;

// @ts-expect-error Viewer-only appearance must not leak into EditorToolbar.
const invalidAppearance = <EditorToolbar items={readonlyItems} appearance="surface" />;

// @ts-expect-error Orientation is a closed vertical/horizontal axis.
const invalidOrientation = <EditorToolbar items={readonlyItems} orientation="diagonal" />;

// @ts-expect-error EditorToolbar emits string tool values.
const invalidOnChange = <EditorToolbar items={readonlyItems} onChange={(value: number) => value} />;

void [controlled, uncontrolled, invalidMissingLabel, invalidAppearance, invalidOrientation, invalidOnChange];
