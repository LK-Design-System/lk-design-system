import * as React from "react";

export interface ListCellProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** 리딩 노드(아이콘 / 아바타 / 썸네일). */
  leading?: React.ReactNode;
  /** slot alias for `leading`. */
  leadingContent?: React.ReactNode;
  /** 기본 텍스트. */
  title?: React.ReactNode;
  /** 보조 줄. */
  description?: React.ReactNode;
  /** 트레일링 노드(값 / 스위치 / 액션). */
  trailing?: React.ReactNode;
  /** slot alias for `trailing`. */
  trailingContent?: React.ReactNode;
  /** 행을 인터랙티브하게 만듦. */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** 헤어라인 밑줄 추가. @default false */
  divider?: boolean;
  /** 오른쪽 chevron을 추가. @default false */
  chevron?: boolean;
  /** 선택 상태. @default false */
  selected?: boolean;
  /** selected의 표시 방식. "accent-check"는 WDS 선택 패턴(액센트 제목 + 체크)으로 "여럿 중 하나 고름"을 말하고, "tint"는 체크·액센트 없이 중립 fill만 유지해 대화·내비게이션 목록의 "지금 열려 있는 항목"을 말한다. @default "accent-check" */
  selectedPresentation?: "accent-check" | "tint";
  /** 비활성 상태. @default false */
  disabled?: boolean;
  /** disabled alias. */
  disable?: boolean;
  /** 가능한 폭을 채움. @default true */
  fillWidth?: boolean;
  /** 제목/설명 말줄임. @default true */
  textEllipsis?: boolean;
  /** verticalPadding axis. @default "medium" */
  verticalPadding?:
    "none" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "custom";
  /** `verticalPadding="custom"`일 때 직접 패딩 지정. */
  paddingY?: number;
  /** 좌우 패딩. @default 20 */
  paddingX?: number | string;
  /** 세로 정렬. @default "center" */
  verticalAlign?: "top" | "center";
  /** Storybook/state rendering aid for interaction states. */
  interaction?:
    boolean | "normal" | "hovered" | "focused" | "pressed" | "active";
  leadingStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  trailingStyle?: React.CSSProperties;
}

/** List Cell row: leading, text, trailing, divider, chevron, selected/disabled, and interaction states. */
export function ListCell(props: ListCellProps): React.JSX.Element;
