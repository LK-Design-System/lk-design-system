import * as React from "react";
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type CardPart = 'root' | 'content' | 'header' | 'actions' | 'media' | 'body' | 'title' | 'description' | 'footer';
export type CardVariable =
  | '--lds-card-padding'
  | '--lds-card-radius'
  | '--lds-card-gap'
  | '--lds-card-max-width';

export interface CardOwnProps {
  /** Root element used for non-interactive document semantics. @default "div" */
  as?: React.ElementType;
  /** Surface role. `subtle` is an inset grouping surface and defaults to no shadow. @default "default" */
  surface?: "default" | "subtle";
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
  /** 기본 패딩을 재정의합니다. 지정하면 platform·density 기본값과 `--lds-card-padding`보다 우선합니다. */
  padding?: number | string;
  /** platform axis. @default "desktop" */
  platform?: "desktop" | "mobile";
  /** 데스크톱 Card의 opt-in 공간 밀도. typography 크기는 바꾸지 않습니다. @default "comfortable" */
  density?: "comfortable" | "compact";
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
  /** Structured title overflow policy. @default "truncate" */
  titleWrap?: "truncate" | "wrap";
  description?: React.ReactNode;
  caption?: React.ReactNode;
  subCaption?: React.ReactNode;
  /** Third caption tier — smallest meta line under `subCaption` (WDS three-tier caption parity). */
  metaCaption?: React.ReactNode;
  bottomContent?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: LdsClassNames<CardPart>;
  styles?: LdsStyles<CardPart>;
  vars?: LdsVars<CardVariable>;
}

export type CardProps<Element extends React.ElementType = 'div'> = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof CardOwnProps | 'as' | 'title'> & {
    as?: Element;
    ref?: React.ComponentPropsWithRef<Element>['ref'];
  };

/** 중립 화이트(또는 네이비) 서피스 — 헤어라인 보더, 부드러운 네이비 그림자, 16px 반경. */
export function Card<Element extends React.ElementType = 'div'>(props: CardProps<Element>): React.JSX.Element;
