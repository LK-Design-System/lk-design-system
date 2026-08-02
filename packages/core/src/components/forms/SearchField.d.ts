import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type SearchFieldPart = 'root' | 'label' | 'control' | 'startIcon' | 'input' | 'statusIcon' | 'clearButton' | 'message';
export type SearchFieldVariable =
  | '--lds-search-field-height'
  | '--lds-search-field-padding-inline'
  | '--lds-search-field-radius'
  | '--lds-search-field-gap';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'style' | 'className'> {
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
  /** @deprecated Use root `style`. */
  fieldStyle?: React.CSSProperties;
  /** Public root class. */
  className?: string;
  /** Public root style. */
  style?: React.CSSProperties;
  /** Input control-shell class. */
  controlClassName?: string;
  /** Input control-shell style. */
  controlStyle?: React.CSSProperties;
  /** Native input class. */
  inputClassName?: string;
  /** Native input style. */
  inputStyle?: React.CSSProperties;
  /** Public root ref; the default ref targets the native search input. */
  rootRef?: React.Ref<HTMLDivElement>;
  classNames?: LdsClassNames<SearchFieldPart>;
  styles?: LdsStyles<SearchFieldPart>;
  vars?: LdsVars<SearchFieldVariable>;
}

/** Search input with Enter-to-search and an accessible clear action. */
export const SearchField: React.ForwardRefExoticComponent<SearchFieldProps & React.RefAttributes<HTMLInputElement>>;
