import * as React from 'react';

export type ValidationIssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
  id: string;
  label: React.ReactNode;
  message: React.ReactNode;
  severity: ValidationIssueSeverity;
  /** @deprecated Severity is presented once by the error or warning group heading. */
  severityLabel?: React.ReactNode;
  href?: string;
  /** @deprecated Kept only as a fallback when both message and label are absent. */
  actionLabel?: React.ReactNode;
  /** Explicit accessible action name for non-text issue content. */
  actionAriaLabel?: string;
}

export interface ValidationSummaryProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  description?: React.ReactNode;
  issues?: ValidationIssue[];
  emptyMessage?: React.ReactNode;
  onIssueActivate?: (issue: ValidationIssue) => void;
  /** @deprecated Kept only as a fallback when issue message and label are absent. */
  actionLabel?: React.ReactNode;
  /** Announces only the short aggregate result, not the interactive summary body. */
  announce?: boolean;
  /** Defaults to -1 when at least one error exists so submit handlers can focus the summary. */
  tabIndex?: number;
}

/** Form-level validation issues with a return path to their owning field or step. */
export const ValidationSummary: React.ForwardRefExoticComponent<ValidationSummaryProps & React.RefAttributes<HTMLElement>>;
