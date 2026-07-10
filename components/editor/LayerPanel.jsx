import React from 'react';
import { Icon } from '../icon/Icon.jsx';

function collectLayerIds(layers, predicate, ids = []) {
  for (const layer of layers) {
    if (predicate(layer)) ids.push(layer.id);
    if (layer.children) collectLayerIds(layer.children, predicate, ids);
  }
  return ids;
}

function getLayerText(layer) {
  if (typeof layer.label === 'string' || typeof layer.label === 'number') return String(layer.label);
  if (typeof layer.description === 'string') return layer.description;
  return layer.id;
}

function LayerRow({
  layer,
  depth,
  visibleSet,
  lockedSet,
  activeId,
  disabled,
  onSelect,
  onToggleVisible,
  onToggleLocked,
}) {
  const layerDisabled = disabled || !!layer.disabled;
  const visible = visibleSet.has(layer.id);
  const locked = lockedSet.has(layer.id);
  const active = activeId === layer.id;
  const labelText = getLayerText(layer);
  const color = layer.color || 'var(--color-semantic-primary-normal)';

  return (
    <li style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '26px 26px minmax(0, 1fr) auto',
          alignItems: 'center',
          gap: 4,
          minHeight: 38,
          padding: '3px 8px',
          paddingLeft: 8 + depth * 16,
          borderRadius: 'var(--radius-sm)',
          background: active ? 'var(--lk-accent-tint)' : 'transparent',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          aria-label={`${labelText} ${visible ? '숨기기' : '보이기'}`}
          aria-pressed={visible}
          disabled={layerDisabled}
          onClick={() => onToggleVisible(layer.id, !visible)}
          style={{
            width: 26,
            height: 26,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            border: 0,
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            color: layerDisabled
              ? 'var(--color-semantic-label-disable)'
              : visible
                ? 'var(--color-semantic-label-neutral)'
                : 'var(--color-semantic-label-assistive)',
            cursor: layerDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon name={visible ? 'eye' : 'eye-slash'} size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={`${labelText} ${locked ? '잠금 해제' : '잠금'}`}
          aria-pressed={locked}
          disabled={layerDisabled}
          onClick={() => onToggleLocked(layer.id, !locked)}
          style={{
            width: 26,
            height: 26,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            border: 0,
            borderRadius: 'var(--radius-sm)',
            background: locked ? 'var(--color-semantic-fill-strong)' : 'transparent',
            color: layerDisabled
              ? 'var(--color-semantic-label-disable)'
              : locked
                ? 'var(--color-semantic-label-neutral)'
                : 'var(--color-semantic-label-assistive)',
            cursor: layerDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon name={locked ? 'lock' : 'lock-open'} size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-pressed={active}
          disabled={layerDisabled}
          onClick={() => onSelect(layer.id)}
          style={{
            minWidth: 0,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '10px minmax(0, 1fr)',
            alignItems: 'center',
            gap: 7,
            padding: '2px 4px',
            border: 0,
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            color: layerDisabled
              ? 'var(--color-semantic-label-disable)'
              : active
                ? 'var(--color-semantic-label-strong)'
                : 'var(--color-semantic-label-normal)',
            textAlign: 'left',
            cursor: layerDisabled ? 'default' : 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: color, opacity: visible ? 1 : 0.35 }} />
          <span style={{ display: 'grid', gap: 1, minWidth: 0, opacity: visible ? 1 : 0.55 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-semibold)', letterSpacing: 0 }}>
              {layer.label}
            </span>
            {layer.description != null && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: layerDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-medium)', letterSpacing: 0 }}>
                {layer.description}
              </span>
            )}
          </span>
        </button>

        {(layer.count != null || layer.meta != null || layer.status != null) && (
          <span style={{ maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', color: layerDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
            {layer.meta ?? layer.status ?? layer.count}
          </span>
        )}
      </div>

      {layer.children && layer.children.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {layer.children.map((child) => (
            <LayerRow
              key={child.id}
              layer={child}
              depth={depth + 1}
              visibleSet={visibleSet}
              lockedSet={lockedSet}
              activeId={activeId}
              disabled={layerDisabled}
              onSelect={onSelect}
              onToggleVisible={onToggleVisible}
              onToggleLocked={onToggleLocked}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * LK ROBOTICS — LayerPanel
 * Shared layer list for map and point-cloud editors: visibility, lock, active
 * layer, nested groups, counts, and per-layer metadata.
 */
export function LayerPanel({
  layers = [],
  activeLayerId,
  defaultActiveLayerId,
  onActiveLayerChange,
  visibleLayerIds,
  defaultVisibleLayerIds,
  onVisibleLayerIdsChange,
  lockedLayerIds,
  defaultLockedLayerIds,
  onLockedLayerIdsChange,
  title = '레이어',
  label = '레이어 목록',
  emptyLabel = '레이어가 없습니다',
  disabled = false,
  style,
  ...rest
}) {
  const initialVisible = React.useMemo(
    () => defaultVisibleLayerIds || collectLayerIds(layers, (layer) => layer.visible !== false),
    [defaultVisibleLayerIds, layers]
  );
  const initialLocked = React.useMemo(
    () => defaultLockedLayerIds || collectLayerIds(layers, (layer) => !!layer.locked),
    [defaultLockedLayerIds, layers]
  );
  const [internalActive, setInternalActive] = React.useState(defaultActiveLayerId || layers[0]?.id);
  const [internalVisible, setInternalVisible] = React.useState(() => new Set(initialVisible));
  const [internalLocked, setInternalLocked] = React.useState(() => new Set(initialLocked));

  const currentActive = activeLayerId !== undefined ? activeLayerId : internalActive;
  const visibleSet = visibleLayerIds !== undefined ? new Set(visibleLayerIds) : internalVisible;
  const lockedSet = lockedLayerIds !== undefined ? new Set(lockedLayerIds) : internalLocked;

  const selectLayer = (id) => {
    if (disabled) return;
    if (activeLayerId === undefined) setInternalActive(id);
    onActiveLayerChange && onActiveLayerChange(id);
  };

  const setVisible = (id, visible) => {
    if (disabled) return;
    const next = new Set(visibleSet);
    if (visible) next.add(id);
    else next.delete(id);
    if (visibleLayerIds === undefined) setInternalVisible(next);
    onVisibleLayerIdsChange && onVisibleLayerIdsChange([...next], id, visible);
  };

  const setLocked = (id, locked) => {
    if (disabled) return;
    const next = new Set(lockedSet);
    if (locked) next.add(id);
    else next.delete(id);
    if (lockedLayerIds === undefined) setInternalLocked(next);
    onLockedLayerIdsChange && onLockedLayerIdsChange([...next], id, locked);
  };

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: 8,
        width: '100%',
        minWidth: 0,
        height: '100%',
        padding: 12,
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <Icon name="layers" size={16} aria-hidden="true" />
        <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', letterSpacing: 0 }}>
          {title}
        </strong>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
          {collectLayerIds(layers, () => true).length}
        </span>
      </div>

      <ul
        aria-label={label}
        aria-disabled={disabled ? 'true' : undefined}
        style={{
          minHeight: 0,
          overflow: 'auto',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {layers.length === 0 ? (
          <li style={{ listStyle: 'none', display: 'grid', placeItems: 'center', minHeight: 120, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)', textAlign: 'center' }}>
            {emptyLabel}
          </li>
        ) : (
          layers.map((layer) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              depth={0}
              visibleSet={visibleSet}
              lockedSet={lockedSet}
              activeId={currentActive}
              disabled={disabled}
              onSelect={selectLayer}
              onToggleVisible={setVisible}
              onToggleLocked={setLocked}
            />
          ))
        )}
      </ul>
    </section>
  );
}
