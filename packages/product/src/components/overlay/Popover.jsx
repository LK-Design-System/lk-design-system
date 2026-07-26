import React from 'react';
import { anchoredPanelStyle } from './anchored-panel-style.js';
import {
  appendAriaReference,
  findOverlayTrigger,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss,
} from './anchored-overlay.js';

/**
 * LK ROBOTICS — Popover
 * An anchored floating panel with arbitrary content (info, mini-forms, pickers).
 * Like DropdownMenu but you own the body. Closes on outside-click.
 */
export function Popover({
  trigger,
  children,
  align = 'left',
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = '팝오버',
  style,
  ...rest
}) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const rootRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const panelId = React.useId();
  const getTrigger = React.useCallback(() => findOverlayTrigger(rootRef.current), []);
  const position = useFloatingPosition({
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: 'bottom',
  });
  useLightDismiss({
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
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

  const verticalStyle = position.placement === 'top'
    ? { top: 'auto', bottom: 'calc(100% + 8px)' }
    : { top: 'calc(100% + 8px)', bottom: 'auto' };
  const horizontalStyle = align === 'right'
    ? { left: 'auto', right: 0 }
    : { left: 0, right: 'auto' };

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block', ...style }} {...rest}>
      <span style={{ display: 'inline-flex' }}>{renderedTrigger}</span>
      {visible && (
        <div
          ref={panelRef}
          className="lk-scroll-surface"
          data-scrollbar="compact"
          data-scroll-gutter="stable"
          id={panelId}
          role="dialog"
          aria-label={ariaLabel}
          data-placement={position.placement}
          style={{
            ...anchoredPanelStyle(width),
            ...verticalStyle,
            ...horizontalStyle,
            maxHeight: position.maxHeight ?? undefined,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
            translate: `${position.shiftX}px ${position.shiftY}px`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
