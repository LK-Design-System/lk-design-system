import * as React from 'react';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'style'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called with the current query when Enter is pressed. */
  onSearch?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  size?: 'sm' | 'md' | 'small' | 'medium';
  /** Accessible clear-action name. Defaults to a contextual `<field> 지우기`. */
  clearLabel?: string;
  /** Styles for the label/control/message stack. */
  fieldStyle?: React.CSSProperties;
  /** Styles for the input control shell. */
  style?: React.CSSProperties;
}

/** Search input with Enter-to-search and an accessible clear action. */
export function SearchField(props: SearchFieldProps): React.JSX.Element;
