import * as React from 'react';

export type ValidationIssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
  id: string;
  label: React.ReactNode;
  message: React.ReactNode;
  severity: ValidationIssueSeverity;
  /** @deprecated Severity is presented once by the error or warning group heading. */
  severityLabel?: React.ReactNode;
  /** 실제 오류 또는 주의 필드의 fragment/route. 모든 요약 항목은 복귀 경로를 가져야 합니다. */
  href: string;
  /** 복합 ReactNode처럼 기본 `label: message` 이름을 만들 수 없을 때 사용하는 명시적 action 이름. */
  actionAriaLabel?: string;
}

export interface ValidationSummaryProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  description?: React.ReactNode;
  /**
   * 하나 이상의 blocking error와 선택적인 field-linked warning.
   * error가 없으면 컴포넌트는 렌더되지 않습니다.
   */
  issues: ValidationIssue[];
  /**
   * SPA가 anchor 이동을 가로채 실제 field/step에 focus와 scroll을 적용할 때 사용합니다.
   * `event.preventDefault()`는 대체 focus 이동을 실제로 수행하는 경우에만 호출하세요.
   */
  onIssueActivate?: (
    issue: ValidationIssue,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
  /**
   * 짧은 오류 개수만 assertive하게 공지합니다.
   * submit 후 summary로 focus를 이동하는 흐름과 동시에 사용하지 않는 것을 권장합니다.
   */
  announce?: boolean;
  /** 기본값은 -1이며 submit 실패 뒤 ref를 통해 summary로 focus를 이동할 수 있습니다. */
  tabIndex?: number;
}

/** Form-level validation issues with a return path to their owning field or step. */
export const ValidationSummary: React.ForwardRefExoticComponent<ValidationSummaryProps & React.RefAttributes<HTMLElement>>;
