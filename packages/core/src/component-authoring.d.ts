export {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs,
} from './components/internal/surface.js';
export type { LdsClassNames, LdsStyles, LdsVars } from './components/internal/surface.js';
export { normalizeBoundedValue } from './components/internal/bounded-value.js';
export type {
  NormalizedBoundedValue,
  NormalizeBoundedValueOptions,
} from './components/internal/bounded-value.js';
export {
  formatValueWithUnit,
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText,
} from './components/internal/unit-format.js';
export type { DisplayScalar } from './components/internal/unit-format.js';
export {
  FieldLabel,
  FieldMessage,
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  mergeIds,
  useFieldMetadata,
} from './components/forms/field-shared.js';
export type {
  FieldLabelProps,
  FieldMessageProps,
  FieldMetadata,
  FieldStackProps,
  FieldStatus,
  FieldStatusIconProps,
  FieldTypographyStyle,
  FieldVisualState,
  UseFieldMetadataOptions,
} from './components/forms/field-shared.js';
export {
  STATUS_TONE_STYLE,
  embeddedBandStyle,
  normalizeStatusTone,
  statusToneStyle,
} from './components/status/status-presentation.js';
export type {
  StatusTone,
  StatusToneAlias,
  StatusTonePresentation,
} from './components/status/status-presentation.js';
