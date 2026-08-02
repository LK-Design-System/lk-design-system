import * as React from 'react';

export type LdsClassNames<Part extends string> = Partial<Record<Part, string>>;
export type LdsStyles<Part extends string> = Partial<Record<Part, React.CSSProperties>>;
export type LdsVars<Variable extends string> = Partial<Record<Variable, string | number>>;

export function cx(...values: Array<string | false | null | undefined>): string;
export function partClassName<Part extends string>(
  classNames: LdsClassNames<Part> | undefined,
  part: Part,
  ...values: Array<string | false | null | undefined>
): string;
export function partStyle<Part extends string>(
  styles: LdsStyles<Part> | undefined,
  part: Part,
): React.CSSProperties | undefined;
export function componentVars<Variable extends string>(
  vars: LdsVars<Variable> | undefined,
  prefix: string,
): React.CSSProperties | undefined;
export function assignRef<T>(ref: React.ForwardedRef<T> | undefined, value: T | null): void;
export function mergeRefs<T>(...refs: Array<React.ForwardedRef<T> | undefined>): React.RefCallback<T>;
export function useMergedRefs<T>(
  refA?: React.ForwardedRef<T>,
  refB?: React.ForwardedRef<T>,
  refC?: React.ForwardedRef<T>,
): React.RefCallback<T>;
