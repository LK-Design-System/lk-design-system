import React from 'react';
import { anchoredPanelStyle } from './anchored-panel-style.js';
import { OverlayPortal } from '@lk-design-system/lds-core/components/overlay/overlay-platform';
import { componentVars, partClassName, partStyle, useMergedRefs } from '@lk-design-system/lds-core/components/internal/surface';
import {
  appendAriaReference,
  findOverlayTrigger,
  inlineFloatingStyle,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss,
} from '@lk-design-system/lds-core/components/overlay/anchored-overlay';

/**
 * LK ROBOTICS — Popover
 * An anchored floating panel with arbitrary content (info, mini-forms, pickers).
 * Like DropdownMenu but you own the body. Closes on outside-click.
 */
export const Popover = React.forwardRef(function Popover({
  trigger,
  children,
  align = 'left',
  position: requestedPosition = 'bottom',
  offset = 8,
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = '팝오버',
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const rootRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const panelId = React.useId();
  const mergedRootRef = useMergedRefs(rootRef, forwardedRef);
  const getTrigger = React.useCallback(() => findOverlayTrigger(rootRef.current), []);
  const position = useFloatingPosition({
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: requestedPosition,
    offset,
    strategy: withinPortal ? 'fixed' : 'absolute',
    align,
  });
  const layer = useLightDismiss({
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    insideRefs: [panelRef],
    zIndex,
  });

  const toggle = (event) => {
    trigger?.props?.onClick?.(event);
    if (!event?.defaultPrevented) setVisible((current) => !current);
  };
  const triggerProps = {
    'data-anchored-overlay-trigger': '',
    'aria-haspopup': 'dialog',
    'aria-expanded': visible,
    'aria-controls': visible
      ? appendAriaReference(trigger?.props?.['aria-controls'], panelId)
      : trigger?.props?.['aria-controls'],
    onClick: toggle,
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment
    ? React.cloneElement(trigger, triggerProps)
    : (
      <span
        {...triggerProps}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle(event);
          }
        }}
      >
        {trigger}
      </span>
    );

  return (
    <div
      ref={mergedRootRef}
      data-slot="root"
      data-open={visible ? 'true' : undefined}
      className={partClassName(classNames, 'root', className) || undefined}
      style={{ ...componentVars(vars, '--lds-popover-'), position: 'relative', display: 'inline-block', ...partStyle(styles, 'root'), ...style }}
      {...rest}
    >
      <span data-slot="trigger" className={partClassName(classNames, 'trigger') || undefined} style={{ display: 'inline-flex', ...partStyle(styles, 'trigger') }}>{renderedTrigger}</span>
      <OverlayPortal open={visible} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={rootRef} layer="anchored">
        <div
          ref={panelRef}
          data-slot="panel"
          data-popover-portal={withinPortal ? 'true' : undefined}
          className={partClassName(classNames, 'panel', 'lk-scroll-surface') || undefined}
          data-scrollbar="compact"
          data-scroll-gutter="stable"
          id={panelId}
          role="dialog"
          aria-label={ariaLabel}
          data-placement={position.placement}
          style={{
            ...componentVars(vars, '--lds-popover-'),
            ...anchoredPanelStyle(width),
            width: `var(--lds-popover-width, ${typeof width === 'number' ? `${width}px` : width})`,
            ...(withinPortal
              ? { position: 'fixed', top: position.y ?? -9999, left: position.x ?? -9999, right: 'auto', bottom: 'auto', translate: 'none' }
              : inlineFloatingStyle({ placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY })),
            zIndex: layer.zIndex,
            maxHeight: `var(--lds-popover-max-height, ${position.maxHeight == null ? 'none' : `${position.maxHeight}px`})`,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
            ...partStyle(styles, 'panel'),
          }}
        >
          {children}
        </div>
      </OverlayPortal>
    </div>
  );
});
