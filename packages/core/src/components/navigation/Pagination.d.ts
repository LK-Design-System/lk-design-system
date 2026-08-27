import * as React from "react";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. @default 1 */
  page?: number;
  /** Total pages. @default 1 */
  count?: number;
  onChange?: (page: number) => void;
  /**
   * Number of sibling pages around the current page. Only applies to
   * `variant="extended"`, which renders a constant-length window
   * (`2 * siblingCount + 5` items including first/last pages and ellipsis
   * slots) so page numbers never shift position between clicks; every page
   * is listed without ellipses while `count` is within one page of the
   * window, so an ellipsis never hides fewer than two pages. The `compact`
   * variant ignores it and pins a 7-item window; `block` and `minimize`
   * ignore it entirely.
   * @default 3
   */
  siblingCount?: number;
  /**
   * navigation variant. `compact` ignores `siblingCount` and pins a 7-item
   * constant window with first/last pages always reachable; `block` lists
   * every page of the current fixed block (`blockSize` pages) with
   * double-chevron block jumps; `minimize` shows only the current page.
   * @default "extended"
   */
  variant?: "extended" | "compact" | "block" | "minimize";
  /**
   * Pages per fixed block. Only applies to `variant="block"`.
   * @default 10
   */
  blockSize?: number;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Opt-in quick-jump number input. Only worth its footprint on large page
   * counts where walking the number list is slow. @default false
   */
  showPageJump?: boolean;
  pageJumpLabel?: React.ReactNode;
  /**
   * Opt-in `n / total` counter. Use where the total page count is not
   * already on screen (`block`, `minimize`); `extended`/`compact` always
   * render the last page number, so a counter there duplicates it.
   * @default false
   */
  showCounter?: boolean;
  /**
   * Opt-in `«` / `»` first/last-page jump commands framing the single
   * chevrons (`« ‹ 1 2 3 › »`). Applies to every variant except `block`,
   * whose double chevrons already jump by block. @default false
   */
  showFirstLast?: boolean;
  /** First-page command accessible name (`showFirstLast`). @default "first page" */
  firstPageLabel?: string;
  /** Last-page command accessible name (`showFirstLast`). @default "last page" */
  lastPageLabel?: string;
  /** nav landmark accessible name. @default "pagination" */
  navigationLabel?: string;
  /** Previous-page command accessible name. @default "previous page" */
  previousPageLabel?: string;
  /** Next-page command accessible name. @default "next page" */
  nextPageLabel?: string;
  /** Previous-block command accessible name (`variant="block"`). @default "previous pages" */
  previousBlockLabel?: string;
  /** Next-block command accessible name (`variant="block"`). @default "next pages" */
  nextBlockLabel?: string;
  /** Page-size select accessible name. @default "items per page" */
  pageSizeLabel?: string;
}

/** numbered pagination with extended, compact, block, and minimize variants plus leading/trailing slots. */
export function Pagination(props: PaginationProps): React.JSX.Element;
