import * as React from 'react';

export interface ChoiceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** 선택(강조) 상태. @default false */
  selected?: boolean;
  /** 비활성(흐림, 상호작용 불가). @default false */
  disabled?: boolean;
  /** 라디오 대신 체크박스 인디케이터(다중 선택). @default false */
  multiple?: boolean;
  /** 토글 시 다음 선택 값과 함께 호출. */
  onSelect?: (next: boolean) => void;
  /** 표준 레이아웃 제목. */
  title?: React.ReactNode;
  /** 제목 아래의 표준 레이아웃 설명. */
  description?: React.ReactNode;
  /** 리딩 아이콘. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/** 선택형 프레임 옵션 — 라디오/체크박스 선택 타일. */
export function ChoiceCard(props: ChoiceCardProps): JSX.Element;
