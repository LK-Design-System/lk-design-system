export type DisplayScalar = string | number | boolean | bigint | null | undefined;

export function normalizeValueText(value: DisplayScalar): string;
export function normalizeUnit(unit: unknown): string;
export function isAttachedUnit(unit: unknown): boolean;
export function getUnitSeparator(unit: unknown): '' | ' ';
export function formatValueWithUnit(value: DisplayScalar, unit: unknown): string;
