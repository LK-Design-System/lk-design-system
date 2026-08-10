import * as React from 'react';

export interface ChoiceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'title' | 'defaultValue'> {
  selected?: boolean;
  disabled?: boolean;
  /** Uses native checkbox semantics instead of radio semantics. */
  multiple?: boolean;
  /** Called with true for a radio choice, or the next checked state for a checkbox choice. */
  onSelect?: (next: boolean) => void;
  /** Shared native radio-group name. Required for related single-select cards. */
  name?: string;
  /** Native form value associated with this option. */
  inputValue?: string;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'disabled' | 'name' | 'value'>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  presentation?: 'choice' | 'frame';
  status?: 'normal' | 'negative';
  interaction?: 'normal' | 'hovered' | 'focused';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Tokenized inner padding for both presentations. compact component scope에서는 기본 `sm`(12px), 그 밖에서는 `md`(16px)이며 명시값이 우선합니다. */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  showIndicator?: boolean;
  children?: React.ReactNode;
}

/** Selectable option card backed by native radio or checkbox behavior when `onSelect` is provided. */
export function ChoiceCard(props: ChoiceCardProps): React.JSX.Element;
