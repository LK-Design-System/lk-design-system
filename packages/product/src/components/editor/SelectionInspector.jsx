import React from 'react';
import { ActionArea } from '@lk-design-system/lds-core/components/buttons/ActionArea';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';
import { StatusIndicator } from '@lk-design-system/lds-core/components/content/StatusIndicator';
import { Tag } from '@lk-design-system/lds-core/components/feedback/Tag';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { DropdownMenu } from '@lk-design-system/lds-core/components/overlay/DropdownMenu';
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText,
} from '@lk-design-system/lds-core/component-authoring';

function displayScalarValue(value, mixed) {
  if (mixed || value == null) return '—';
  const normalizedValue = normalizeValueText(value);
  return normalizedValue === '' ? '—' : normalizedValue;
}
function displayValueNode(value, mixed) {
  if (mixed || value == null || value === '') return '—';
  if (typeof value === 'boolean') return String(value);
  return value;
}

function FieldValue({ field }) {
  const toneColor = {
    cautionary: 'var(--color-semantic-status-cautionary-text)',
    negative: 'var(--color-semantic-status-negative-text)',
    warning: 'var(--color-semantic-status-cautionary-text)',
    danger: 'var(--color-semantic-status-negative-text)',
  }[field.tone] || (field.mixed ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-label-strong)');
  // Every row is a different property, so the value column is never a series to
  // compare down. Right-aligning numbers here buys no digit alignment either —
  // the unit rides along in the same span, and `m²` and `m/s` are different
  // widths, so the digits land in a different place on every row — while the
  // text rows stay left. The result is a column ragged on both edges. One left
  // edge for every value; `align` stays available for the rare explicit case.
  const align = field.align ?? 'left';
  const renderedValue = displayScalarValue(field.value, field.mixed);
  const normalizedUnit = field.mixed ? '' : normalizeUnit(field.unit);
  const unitSeparator = getUnitSeparator(normalizedUnit);
  const attachedUnit = isAttachedUnit(normalizedUnit);

  return (
    <span
      data-selection-inspector-value=""
      data-unit-attachment={normalizedUnit === '' ? 'none' : attachedUnit ? 'attached' : 'spaced'}
      style={{
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: toneColor,
        fontSize: 'var(--label2-size)',
        lineHeight: 'var(--label2-line)',
        fontWeight: field.mixed ? 'var(--fw-medium)' : 'var(--fw-semibold)',
        letterSpacing: 0,
        textAlign: align,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span>{renderedValue}</span>
      {normalizedUnit !== '' && (
        <span style={{ color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-medium)' }}>
          {unitSeparator}{normalizedUnit}
        </span>
      )}
    </span>
  );
}

function InspectorFields({ fields = [] }) {
  return (
    <div>
      {fields.map((field, index) => (
        <div
          key={`${field.label}-${index}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(88px, 0.8fr) minmax(0, 1.2fr)',
            alignItems: 'center',
            gap: 'var(--space-3)',
            minHeight: 'var(--control-h-md)',
            padding: 'var(--space-2) 0',
            borderBottom: '1px solid var(--color-semantic-line-normal-alternative)',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)', letterSpacing: 0 }}>
            {field.label}
          </span>
          {field.valueNode != null
            ? displayValueNode(field.valueNode, field.mixed)
            : <FieldValue field={field} />}
        </div>
      ))}
    </div>
  );
}

function InspectorSection({ section }) {
  const collapsible = section.collapsible !== false && section.title != null;
  const [expanded, setExpanded] = React.useState(section.defaultExpanded !== false);
  const contentId = React.useId();
  const content = (
    <div id={contentId} hidden={collapsible && !expanded}>
      <InspectorFields fields={section.fields} />
      {section.children}
    </div>
  );

  return (
    <section style={{ minWidth: 0, borderTop: '1px solid var(--color-semantic-line-normal-alternative)' }}>
      {section.title != null && (
        collapsible ? (
          /* Wrap the disclosure control in a heading so the section title carries
             document structure (WCAG 1.3.1), matching the static branch's level.
             The heading is a bare block wrapper; the button owns the visuals. */
          <h4 style={{ margin: 0, font: 'inherit', color: 'inherit' }}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={contentId}
              onClick={() => setExpanded((value) => !value)}
              style={{ width: '100%', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', padding: 0, border: 0, background: 'transparent', color: 'var(--color-semantic-label-strong)', fontFamily: 'var(--font-sans)', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)' }}>{section.title}</span>
              <Icon name={expanded ? 'chevron-up-small' : 'chevron-down-small'} size={16} aria-hidden="true" />
            </button>
          </h4>
        ) : (
          <h4 style={{ minHeight: 40, display: 'flex', alignItems: 'center', margin: 0, fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>
            {section.title}
          </h4>
        )
      )}
      {content}
    </section>
  );
}

/**
 * LK ROBOTICS - SelectionInspector
 * Selection-bound properties region for map, scene, annotation, and robotics
 * editor objects. The fixed identity header stays visible while sections scroll.
 */
export function SelectionInspector({
  item,
  selectionCount,
  title = '선택 객체',
  titleVisuallyHidden = false,
  emptyLabel = '선택한 객체가 없습니다.',
  sections = [],
  actions,
  menuItems,
  menuLabel = '객체 작업',
  onClearSelection,
  clearSelectionLabel = '선택 해제',
  clearSelectionAriaLabel = '모든 선택 해제',
  children,
  style,
  ...rest
}) {
  const hasItem = item != null;
  const count = selectionCount ?? (hasItem ? 1 : 0);
  const canClearSelection = hasItem && typeof onClearSelection === 'function';
  const hasMenu = hasItem && (menuItems?.length ?? 0) > 0;
  const selectionName = count > 1 ? `${count}개 객체 선택` : item?.label;

  // Object-scoped commands belong beside the object's identity, not in the
  // commit footer — deleting the selection is not a step in the apply/cancel
  // flow, and a lone danger button parked opposite 적용 reads as a second
  // commit action. They collapse into one overflow trigger rather than a row of
  // icons: a bare trash glyph next to the clear-selection X pairs two
  // destructive-looking controls whose consequences are nothing alike.
  //
  // Held as a value because its row depends on whether the eyebrow is drawn:
  // with a visible title they share that row, and without one they ride the
  // object-name line instead of stranding an empty band above it.
  const controls = (hasMenu || canClearSelection) ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginInlineStart: 'auto', flexShrink: 0 }}>
      {hasMenu && (
        <DropdownMenu
          align="right"
          items={menuItems}
          trigger={(
            /* `plain`, not `ghost`: these rest on the header surface the panel
               owns, the same placement as the Modal/Drawer close buttons. The
               hairline `ghost` box is for controls floating over content that
               must assert their own boundary. */
            <IconButton type="button" size="sm" variant="plain" round={false} label={menuLabel}>
              <Icon name="more-vertical" size={16} aria-hidden="true" />
            </IconButton>
          )}
        />
      )}
      {canClearSelection && (
        <IconButton
          type="button"
          size="sm"
          variant="plain"
          round={false}
          label={clearSelectionAriaLabel}
          title={typeof clearSelectionLabel === 'string' ? clearSelectionLabel : clearSelectionAriaLabel}
          onClick={onClearSelection}
        >
          <Icon name="close" size={16} aria-hidden="true" />
        </IconButton>
      )}
    </span>
  ) : null;

  // With the eyebrow hidden and nothing selected there is no header content at
  // all. The element stays so the two grid rows keep their shape — the empty
  // state centres itself in the second row — but sheds the padding and rule
  // that would otherwise draw an empty band across the top of the panel.
  const headerHasContent = !titleVisuallyHidden || hasItem;

  return (
    <section
      aria-label={typeof title === 'string' ? title : '선택 객체 속성'}
      style={{
        display: 'grid',
        gridTemplateRows: hasItem && actions != null ? 'auto minmax(0, 1fr) auto' : 'auto minmax(0, 1fr)',
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-elevated-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <header style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0, padding: headerHasContent ? 'var(--space-3) var(--space-4)' : 0, borderBottom: headerHasContent ? '1px solid var(--color-semantic-line-normal-normal)' : 'none', boxSizing: 'border-box' }}>
        {/* Docked inside `CanvasEditorShell`, the panel region is already named
            by `panelLabel`, and the object's own name sits directly below — so
            the eyebrow says a third time what two other elements already say.
            `titleVisuallyHidden` drops it from view there. The region keeps its
            accessible name either way: the `<section>` is labelled by `title`
            through `aria-label`, not by this element. */}
        {!titleVisuallyHidden && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', minWidth: 0 }}>
            <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)' }}>
              {title}
            </strong>
            {controls}
          </div>
        )}
        {hasItem && (
          <div style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
            {/* Without an eyebrow row to hold them, the controls sit on the
                object-name line. Parking them on a row of their own would leave
                a band of empty header above the name — the panel would look
                like it had lost its title rather than never drawn one. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
              <h3 style={{ flex: 1, minWidth: 0, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', letterSpacing: 0 }}>
                {selectionName}
              </h3>
              {titleVisuallyHidden && controls}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
              {item.kind != null && <Tag tone="neutral">{item.kind}</Tag>}
              {item.status != null && (
                item.statusPresentation === 'indicator'
                  ? <StatusIndicator tone={item.statusTone || 'signal'}>{item.status}</StatusIndicator>
                  : <StatusBadge tone={item.statusTone || 'signal'}>{item.status}</StatusBadge>
              )}
            </div>
          </div>
        )}
      </header>

      <div style={{ minHeight: 0, overflow: 'auto', padding: hasItem ? '0 var(--space-4) var(--space-4)' : 'var(--space-4)', boxSizing: 'border-box' }}>
        {hasItem ? (
          <>
            {sections.map((section, index) => <InspectorSection key={`${section.title || 'section'}-${index}`} section={section} />)}
            {children}
          </>
        ) : (
          <div role="status" style={{ minHeight: 180, display: 'grid', placeItems: 'center', alignContent: 'center', gap: 'var(--space-3)', color: 'var(--color-semantic-label-neutral)', textAlign: 'center' }}>
            <Icon name="crosshair" size={24} aria-hidden="true" />
            <span style={{ maxWidth: 220, fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)' }}>{emptyLabel}</span>
          </div>
        )}
      </div>

      {hasItem && actions != null && (
        <ActionArea compact align="end">
          {actions}
        </ActionArea>
      )}
    </section>
  );
}
