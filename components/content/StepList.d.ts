import * as React from 'react';

export interface StepItem {
  /** 안정 키(없으면 인덱스). */
  id?: string | number;
  label: React.ReactNode;
  /** 보조 설명 줄. */
  detail?: React.ReactNode;
  [key: string]: any;
}

export interface StepListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  steps: StepItem[];
  /** 순서 변경 / 삭제 시 다음 배열로 호출(제어형). */
  onChange?: (steps: StepItem[]) => void;
  /** 재정렬·삭제·추가 UI 표시. @default true */
  editable?: boolean;
  /** 있으면 하단에 추가 버튼 노출. */
  onAdd?: () => void;
  /** 추가 버튼 라벨. @default "단계 추가" */
  addLabel?: React.ReactNode;
}

/** 편집형 순서 시퀀스 — 태스크 저작(웨이포인트·액션). 번호 · 재정렬(↑/↓) · 삭제 · 추가. */
export function StepList(props: StepListProps): JSX.Element;
