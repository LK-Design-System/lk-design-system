import React from 'react';
import { componentVars, partClassName, partStyle, useMergedRefs } from '../internal/surface.js';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const SEGMENTED_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-segmented-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;

function hasSegmentPaintOverride(style) {
  return Object.keys(style ?? {}).some((property) => /^(background|border|mask|--)/.test(property)
    || ['boxShadow', 'opacity', 'filter', 'backdropFilter', 'mixBlendMode', 'clipPath', 'visibility'].includes(property));
}

function normalizeSegmentOption(option) {
  return typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : {
        ...option,
        disabled: Boolean(option.disabled || option.disable || option.interaction === 'inactive'),
      };
}

/** Compact, mutually exclusive view or mode selection. */
export const SegmentedControl = React.forwardRef(function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  variant = 'solid',
  size = 'md',
  interaction,
  full = false,
  resize,
  disabled = false,
  disable = false,
  className,
  style,
  classNames,
  styles,
  vars,
  'aria-label': ariaLabel = '보기 선택',
  ...groupProps
}, forwardedRef) {
  const normalizedOptions = options.map(normalizeSegmentOption);
  const enabledIndices = normalizedOptions
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);
  const fallbackValue = defaultValue ?? normalizedOptions[enabledIndices[0]]?.value;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(fallbackValue);
  const currentValue = isControlled ? value : internalValue;
  const disabledState = disabled || disable || interaction === 'inactive';
  const rootRef = React.useRef(null);
  const mergedRootRef = useMergedRefs(rootRef, forwardedRef);
  const buttonRefs = React.useRef([]);
  const [surface, setSurface] = React.useState(null);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const height = normalizedSize === 'sm' ? 32 : normalizedSize === 'lg' ? 48 : 40;
  const fontSize = normalizedSize === 'sm' ? 'var(--label1-size)' : normalizedSize === 'lg' ? 'var(--headline2-size)' : 'var(--body1-size)';
  const trackRadius = normalizedSize === 'sm' ? 'var(--radius-8)' : normalizedSize === 'lg' ? 'var(--radius-md)' : 'var(--radius-10)';
  const segmentRadius = normalizedSize === 'sm' ? 'var(--radius-sm)' : normalizedSize === 'lg' ? 'var(--radius-10)' : 'var(--radius-8)';
  const trackPadding = normalizedSize === 'lg' ? 3 : 2;
  const outlined = variant === 'outlined';
  const fill = full || resize === 'fill';
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === currentValue && !option.disabled);
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1);
  const surfaceIndex = normalizedOptions.findIndex((option) => option.value === currentValue);
  const selectedOption = normalizedOptions[surfaceIndex];
  const surfaceDisabled = disabledState || selectedOption?.disabled;
  // Preserve the existing button paint and CSS cascade for targeted consumer
  // overrides. Text/layout hooks and root classes keep the shared surface.
  const sharedSelection = !outlined && !hasSegmentPaintOverride(partStyle(styles, 'segment'))
    && !classNames?.segment && !hasSegmentPaintOverride(selectedOption?.style) && !selectedOption?.className;

  const measureSurface = React.useCallback(() => {
    const selected = buttonRefs.current[surfaceIndex];
    const next = sharedSelection && selected ? {
      x: selected.offsetLeft,
      y: selected.offsetTop,
      width: selected.offsetWidth,
      height: selected.offsetHeight,
    } : null;
    setSurface((previous) => {
      if (previous === null && next === null) return previous;
      if (previous && next && Object.keys(next).every((key) => previous[key] === next[key])) return previous;
      return next;
    });
  }, [sharedSelection, surfaceIndex]);

  // Measure after every React layout: selection, labels, counts and inherited
  // direction can change independently. offset geometry also works in RTL and
  // under a transformed ancestor without assuming equal segment widths.
  useSafeLayoutEffect(measureSurface);
  useSafeLayoutEffect(() => {
    if (!sharedSelection) return undefined;
    const root = rootRef.current;
    const view = root?.ownerDocument?.defaultView;
    const Observer = view?.ResizeObserver;
    const observer = Observer ? new Observer(measureSurface) : null;
    if (root) observer?.observe(root);
    buttonRefs.current.forEach((button) => { if (button) observer?.observe(button); });
    // Direction can change through a provider or DOM/CSS scope without a
    // component render or a size change. Watch only this inheritance chain,
    // then use the same geometry measurement as selection and resize.
    const DirectionObserver = view?.MutationObserver;
    const directionObserver = DirectionObserver ? new DirectionObserver(measureSurface) : null;
    for (let ancestor = root; ancestor; ancestor = ancestor.parentElement) {
      directionObserver?.observe(ancestor, { attributes: true, attributeFilter: ['dir', 'class', 'style'] });
    }
    view?.addEventListener('resize', measureSurface);
    return () => {
      observer?.disconnect();
      directionObserver?.disconnect();
      view?.removeEventListener('resize', measureSurface);
    };
  }, [measureSurface, sharedSelection, options]);

  const pick = (index, { focus = false } = {}) => {
    const option = normalizedOptions[index];
    if (!option || disabledState || option.disabled) return;
    if (option.value !== currentValue) {
      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value);
    }
    if (focus) buttonRefs.current[index]?.focus();
  };

  const move = (currentIndex, direction) => {
    if (!enabledIndices.length) return;
    const currentEnabledIndex = enabledIndices.indexOf(currentIndex);
    const base = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    const next = (base + direction + enabledIndices.length) % enabledIndices.length;
    pick(enabledIndices[next], { focus: true });
  };

  return (
    <div
      {...groupProps}
      ref={mergedRootRef}
      data-slot="root"
      data-size={normalizedSize}
      data-variant={outlined ? 'outlined' : 'solid'}
      data-disabled={disabledState ? 'true' : undefined}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabledState || undefined}
      className={partClassName(classNames, 'root', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-segmented-control-'),
        position: 'relative',
        isolation: 'isolate',
        display: 'inline-flex',
        width: fill ? '100%' : undefined,
        maxWidth: '100%',
        height: `var(--lds-segmented-control-height, ${height}px)`,
        boxSizing: 'border-box',
        justifySelf: fill ? undefined : 'start',
        padding: outlined ? 0 : `var(--lds-segmented-control-padding, ${trackPadding}px)`,
        gap: outlined ? 0 : 'var(--lds-segmented-control-gap, 2px)',
        background: outlined ? 'var(--color-semantic-background-elevated-normal)' : 'var(--color-semantic-fill-normal)',
        border: outlined ? '1px solid var(--color-semantic-line-solid-normal)' : 'none',
        borderRadius: `var(--lds-segmented-control-radius, ${trackRadius})`,
        overflow: 'hidden',
        ...partStyle(styles, 'root'),
        ...style,
      }}
    >
      <style>{SEGMENTED_MOTION_STYLES}</style>
      {sharedSelection && surface && (
        <span
          aria-hidden="true"
          data-lds-segmented-surface=""
          data-lds-segmented-motion=""
          style={{
            position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 0,
            width: surface.width, height: surface.height,
            transform: `translate(${surface.x}px, ${surface.y}px)`,
            borderRadius: `var(--lds-segmented-control-segment-radius, ${segmentRadius})`,
            background: surfaceDisabled ? 'var(--color-semantic-fill-strong)' : 'var(--color-semantic-background-elevated-normal)',
            boxShadow: surfaceDisabled ? 'none' : 'var(--shadow-xs)',
            transition: 'transform var(--dur-base) var(--ease-out), width var(--dur-base) var(--ease-out), height var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          }}
        />
      )}
      {normalizedOptions.map((option, index) => {
        const optionInteraction = option.interaction || interaction;
        const selected = option.value === currentValue;
        const optionDisabled = disabledState || option.disabled;
        const active = selected || optionInteraction === 'active' || optionInteraction === 'active-focused';
        const activeHover = !optionDisabled && optionInteraction === 'hovered';
        const activeFocus = !optionDisabled && (optionInteraction === 'focused' || optionInteraction === 'active-focused');
        const sharedSurface = sharedSelection && selected && surface !== null;
        return (
          <button
            key={option.value}
            ref={(node) => { buttonRefs.current[index] = node; }}
            data-slot="segment"
            data-lds-segmented-motion=""
            data-state={selected ? 'checked' : 'unchecked'}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={optionDisabled || undefined}
            data-selected={selected ? 'true' : 'false'}
            data-disabled={optionDisabled ? 'true' : 'false'}
            className={partClassName(classNames, 'segment', option.className) || undefined}
            tabIndex={!optionDisabled && index === rovingIndex ? 0 : -1}
            disabled={optionDisabled}
            onClick={() => pick(index)}
            onKeyDown={(event) => {
              if (event.defaultPrevented || optionDisabled) return;
              const rtl = rootRef.current?.ownerDocument?.defaultView?.getComputedStyle(rootRef.current).direction === 'rtl';
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                move(index, event.key === 'ArrowRight' && rtl ? -1 : 1);
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                move(index, event.key === 'ArrowLeft' && rtl ? 1 : -1);
              } else if (event.key === 'Home') {
                event.preventDefault();
                pick(enabledIndices[0], { focus: true });
              } else if (event.key === 'End') {
                event.preventDefault();
                pick(enabledIndices[enabledIndices.length - 1], { focus: true });
              }
            }}
            style={{
              flex: fill ? 1 : undefined,
              position: 'relative',
              zIndex: 1,
              minWidth: 0,
              height: '100%',
              minHeight: 0,
              boxSizing: 'border-box',
              padding: '0 9px',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: optionDisabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize,
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              letterSpacing: 0,
              color: optionDisabled
                ? 'var(--color-semantic-label-disable)'
                : active
                  ? 'var(--color-semantic-label-normal)'
                  : activeFocus
                    ? 'var(--color-semantic-label-normal)'
                    : 'var(--color-semantic-label-neutral)',
              background: sharedSurface ? 'transparent' : optionDisabled
                ? active
                  ? 'var(--color-semantic-fill-strong)'
                  : 'transparent'
                : active
                  ? (outlined ? 'var(--color-semantic-primary-surface-strong)' : 'var(--color-semantic-background-elevated-normal)')
                  : activeHover || activeFocus
                    ? 'var(--color-semantic-fill-normal)'
                    : 'transparent',
              borderRadius: outlined ? 0 : `var(--lds-segmented-control-segment-radius, ${segmentRadius})`,
              borderLeft: outlined && index > 0 ? '1px solid var(--color-semantic-line-solid-normal)' : 'none',
              boxShadow: [
                active && !outlined && !optionDisabled && !sharedSurface ? 'var(--shadow-xs)' : null,
                activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : null,
              ].filter(Boolean).join(', ') || 'none',
              transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
              ...partStyle(styles, 'segment'),
              ...option.style,
            }}
          >
            {option.icon && <span data-slot="icon" className={partClassName(classNames, 'icon') || undefined} aria-hidden="true" style={{ display: 'inline-flex', flex: '0 0 auto', ...partStyle(styles, 'icon') }}>{option.icon}</span>}
            <span data-slot="label" className={partClassName(classNames, 'label') || undefined} style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', ...partStyle(styles, 'label') }}>{option.label}</span>
            {option.count != null && (
              <span
                data-slot="count"
                data-segment-count="true"
                className={partClassName(classNames, 'count') || undefined}
                style={{
                  minWidth: '1.25em',
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 'var(--fw-bold)',
                  color: active ? 'currentColor' : 'var(--color-semantic-label-alternative)',
                  ...partStyle(styles, 'count'),
                }}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});
