import * as React from "react";

export interface CardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** 기본 그림자 깊이. @default "md" */
  elevation?: "none" | "sm" | "md" | "lg";
  /**
   * 카드 전체가 하나의 행동일 때. 호버 리프트 + 그림자 심화에 더해
   * `role="button"`, `tabIndex=0`, Enter/Space 활성화, `:focus-visible` 링을
   * 부여합니다. 내부에 별도의 버튼·링크를 넣지 마세요.
   * @default false
   */
  interactive?: boolean;
  /** 다크 섹션용 네이비 서피스. @default false */
  dark?: boolean;
  /**
   * 구조화 모드 `title` 의 heading 레벨. `false` 면 heading 의미 없이 div 로
   * 렌더링합니다(제목이 이미 바깥에 있을 때).
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
  /** 기본 32px 패딩을 재정의. */
  padding?: number | string;
  /** platform axis. @default "desktop" */
  platform?: "desktop" | "mobile";
  /** skeleton axis. @default false */
  skeleton?: boolean;
  /** save action axis. @default false */
  save?: boolean;
  saved?: boolean;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Toggle-icon affordance rendered in the top-right (WDS Card/List Card parity); shows alongside `save`. */
  toggleIcon?: React.ReactNode;
  thumbnail?: React.ReactNode;
  topContent?: React.ReactNode;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  caption?: React.ReactNode;
  subCaption?: React.ReactNode;
  /** Third caption tier — smallest meta line under `subCaption` (WDS three-tier caption parity). */
  metaCaption?: React.ReactNode;
  bottomContent?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** 중립 화이트(또는 네이비) 서피스 — 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. */
export function Card(props: CardProps): React.JSX.Element;
