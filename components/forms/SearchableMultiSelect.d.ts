import * as React from 'react';

export interface SearchableMultiSelectOption<Value extends React.Key = React.Key> {
  value: Value;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface SearchableMultiSelectProps<Value extends React.Key = React.Key> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: SearchableMultiSelectOption<Value>[];
  value?: Value[];
  defaultValue?: Value[];
  onChange?: (value: Value[]) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  filterOption?: (option: SearchableMultiSelectOption<Value>, search: string) => boolean;
  /** Visible accessible name for the combobox. */
  label: React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  error?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  loadingLabel?: React.ReactNode;
  maxSelections?: number;
  maxSelectionLabel?: React.ReactNode;
  disabled?: boolean;
}

/** Searchable multi-select with controlled values and removable selected chips. */
export function SearchableMultiSelect<Value extends React.Key = React.Key>(props: SearchableMultiSelectProps<Value>): JSX.Element;
