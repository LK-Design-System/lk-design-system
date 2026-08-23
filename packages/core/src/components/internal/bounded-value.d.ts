export interface NormalizeBoundedValueOptions {
  value?: number;
  min?: number;
  max?: number;
}

export interface NormalizedBoundedValue {
  min: number;
  max: number;
  value: number;
  ratio: number;
  percent: number;
}

export function normalizeBoundedValue(
  options?: NormalizeBoundedValueOptions,
): NormalizedBoundedValue;
