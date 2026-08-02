import React from 'react';

export function cx(...values) {
  return values.filter(Boolean).join(' ');
}

export function partClassName(classNames, part, ...values) {
  return cx(...values, classNames?.[part]);
}

export function partStyle(styles, part) {
  return styles?.[part] ?? undefined;
}

export function componentVars(vars, prefix) {
  if (!vars) return undefined;
  return Object.fromEntries(
    Object.entries(vars).filter(([name, value]) => name.startsWith(prefix) && value != null),
  );
}

export function assignRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && typeof ref === 'object') {
    ref.current = value;
  }
}

export function mergeRefs(...refs) {
  return (value) => refs.forEach((ref) => assignRef(ref, value));
}

export function useMergedRefs(refA, refB, refC) {
  return React.useMemo(() => mergeRefs(refA, refB, refC), [refA, refB, refC]);
}
