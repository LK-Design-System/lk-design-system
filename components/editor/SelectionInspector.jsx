import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { StatusBadge } from '../content/StatusBadge.jsx';
import { Icon } from '../icon/Icon.jsx';

function FieldValue({ field }) {
  const toneColor = 'var(--color-semantic-label-strong)';

  return (
    <strong
      style={{
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: toneColor,
        fontSize: 'var(--label2-size)',
        lineHeight: 'var(--label2-line)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 0,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {field.value}
      {field.unit != null && (
        <span style={{ marginLeft: 3, color: 'var(--color-semantic-label-neutral)', fontWeight: 'var(--fw-medium)' }}>
          {field.unit}
        </span>
      )}
    </strong>
  );
}

function InspectorSection({ section }) {
  return (
    <section style={{ display: 'grid', gap: 0, minWidth: 0 }}>
      {section.title != null && (
        <h4 style={{ margin: '14px 0 5px', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-extra)', letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)' }}>
          {section.title}
        </h4>
      )}
      <div style={{ borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
        {(section.fields || []).map((field, index) => (
          <div
            key={`${field.label}-${index}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(72px, 0.8fr) minmax(0, 1fr)',
              alignItems: 'center',
              gap: 10,
              minHeight: 34,
              padding: '7px 0',
              borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)', letterSpacing: 0 }}>
              {field.label}
            </span>
            {field.valueNode || <FieldValue field={field} />}
          </div>
        ))}
      </div>
      {section.children}
    </section>
  );
}

/**
 * LK ROBOTICS - SelectionInspector
 * Right-side property inspector for a selected map object, point-cloud region,
 * annotation, robot pose, waypoint, lane, or 3D crop volume.
 */
export function SelectionInspector({
  item,
  title = '선택 객체',
  emptyLabel = '선택된 객체가 없습니다',
  sections = [],
  actions,
  onClearSelection,
  clearSelectionLabel = '선택 해제',
  clearSelectionAriaLabel = '모든 선택 해제',
  children,
  style,
  ...rest
}) {
  const hasItem = item != null;
  const canClearSelection = hasItem && typeof onClearSelection === 'function';

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'grid', alignContent: 'start', gap: 12, padding: 16, boxSizing: 'border-box' }}>
        <header style={{ display: 'grid', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', minWidth: 0 }}>
            <span style={{ minWidth: 0, fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-extra)', letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--color-semantic-label-neutral)' }}>
              {title}
            </span>
            {canClearSelection && (
              <Button
                type="button"
                size="sm"
                variant="outlined"
                color="assistive"
                aria-label={clearSelectionAriaLabel}
                onClick={onClearSelection}
              >
                <Icon name="close" size={14} aria-hidden="true" />
                {clearSelectionLabel}
              </Button>
            )}
          </div>
          {hasItem ? (
            <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ minWidth: 0, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', letterSpacing: 0 }}>
                  {item.label}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flexWrap: 'wrap' }}>
                {item.kind != null && (
                  <span style={{ height: 20, display: 'inline-flex', alignItems: 'center', padding: '0 6px', borderRadius: 4, background: 'var(--color-semantic-fill-normal)', color: 'var(--color-semantic-label-neutral)', fontSize: 12, lineHeight: '20px', fontWeight: 'var(--fw-semibold)' }}>
                    {item.kind}
                  </span>
                )}
                {item.status != null && <StatusBadge tone={item.statusTone || 'signal'}>{item.status}</StatusBadge>}
              </div>
            </div>
          ) : (
            <div style={{ minHeight: 128, display: 'grid', placeItems: 'center', padding: 16, border: '1px dashed var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)', textAlign: 'center' }}>
              {emptyLabel}
            </div>
          )}
        </header>

        {hasItem && sections.map((section, index) => <InspectorSection key={`${section.title || 'section'}-${index}`} section={section} />)}
        {hasItem && children}
      </div>
      {hasItem && actions != null && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', boxSizing: 'border-box' }}>
          {actions}
        </div>
      )}
    </aside>
  );
}
