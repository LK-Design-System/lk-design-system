import * as React from "react";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. @default 1 */
  page?: number;
  /** Total pages. @default 1 */
  count?: number;
  onChange?: (page: number) => void;
  /** Number of sibling pages around the current page. @default 1 */
  siblingCount?: number;
  /** navigation variant. @default "extended" */
  variant?: "extended" | "compact" | "minimize";
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  showPageJump?: boolean;
  pageJumpLabel?: React.ReactNode;
  showCounter?: boolean;
  /** nav landmark accessible name. @default "pagination" */
  navigationLabel?: string;
  /** Previous-page command accessible name. @default "previous page" */
  previousPageLabel?: string;
  /** Next-page command accessible name. @default "next page" */
  nextPageLabel?: string;
  /** Page-size select accessible name. @default "items per page" */
  pageSizeLabel?: string;
}

/** numbered pagination with extended, compact, and minimize variants plus leading/trailing slots. */
export function Pagination(props: PaginationProps): React.JSX.Element;
