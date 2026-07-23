import * as React from 'react';

export interface StepItem {
  /** 안정 키(없으면 인덱스). */
  id?: string | number;
  /** 단계 제목(정식 키). */
  label?: React.ReactNode;
  /** 보조 설명 줄(정식 키). */
  detail?: React.ReactNode;
  /** `label` 의 호환 별칭. */
  title?: React.ReactNode;
  /** `detail` 의 호환 별칭. */
  description?: React.ReactNode;
  [key: string]: unknown;
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
  /** 내부 `ol` 의 접근 가능한 이름(한 화면에 절차가 여럿일 때 구분용). */
  label?: string;
}

/** 편집형 순서 시퀀스 — 태스크 저작(웨이포인트·액션). 번호 · 재정렬(↑/↓) · 삭제 · 추가. */
export function StepList(props: StepListProps): React.JSX.Element;
