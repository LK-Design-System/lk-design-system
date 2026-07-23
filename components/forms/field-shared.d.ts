import * as React from 'react';

/** id 목록 문자열들을 공백 기준으로 병합하고 중복을 제거한다. 유효한 id가 없으면 undefined. */
export function mergeIds(...values: Array<string | number | null | undefined | false>): string | undefined;

export interface UseFieldMetadataOptions {
  /** 자동 생성 id의 접두어(예: "input", "number-field"). */
  prefix: string;
  /** 소비자가 지정한 컨트롤 id. 없으면 `${prefix}-${autoId}`로 생성된다. */
  id?: string;
  /** 필드 라벨. 존재 여부만 메타데이터에 반영된다. */
  label?: React.ReactNode;
  /** 보조 설명. error가 있으면 가려진다. */
  helper?: React.ReactNode;
  /** 오류 메시지. helper보다 우선한다. */
  error?: React.ReactNode;
  /** 외부에서 추가로 연결할 aria-describedby id 목록. */
  describedBy?: string;
}

export interface FieldMetadata {
  /** 컨트롤과 라벨 `htmlFor`가 공유하는 id. */
  fieldId: string;
  /** 표시할 메시지(error ?? helper). */
  message: React.ReactNode;
  /** 메시지 요소 id. 메시지가 없으면 undefined. */
  messageId: string | undefined;
  /** 외부 describedBy와 messageId를 병합한 aria-describedby 값. */
  describedBy: string | undefined;
  /** 라벨 또는 메시지가 하나라도 있는지 여부. */
  hasMetadata: boolean;
}

/** 폼 필드 공용 id·메시지·aria-describedby 메타데이터 계약. */
export function useFieldMetadata(options: UseFieldMetadataOptions): FieldMetadata;

export type FieldStatus = 'normal' | 'positive' | 'negative';

export interface FieldLabelProps {
  /** 연결할 컨트롤 id. */
  htmlFor?: string;
  id?: string;
  /** 라벨 콘텐츠. null이면 아무것도 렌더하지 않는다. */
  label?: React.ReactNode;
  /** 필수 표시(*) 여부. @default false */
  required?: boolean;
  /** 비활성 라벨 색 적용 여부. @default false */
  disabled?: boolean;
}

/** 필드 라벨. 토큰 기반 타이포그래피와 필수 표시를 소유한다. */
export function FieldLabel(props: FieldLabelProps): React.JSX.Element | null;

export interface FieldMessageProps {
  /** aria-describedby가 참조하는 메시지 id. */
  id?: string;
  /** 표시할 메시지(error ?? helper). null이면 렌더하지 않는다. */
  message?: React.ReactNode;
  /** 오류 값. 존재하면 `role="alert"`와 negative 색을 적용한다. */
  error?: React.ReactNode;
  /** 상태 색. @default "normal" */
  status?: FieldStatus;
}

/** 필드 하단 메시지. 오류일 때만 assertive live 영역(role="alert")이 된다. */
export function FieldMessage(props: FieldMessageProps): React.JSX.Element | null;

export interface FieldStackProps {
  /** 컨트롤 id. 라벨 `htmlFor`로 연결된다. */
  fieldId?: string;
  /** 라벨 요소 id. */
  labelId?: string;
  label?: React.ReactNode;
  required?: boolean;
  messageId?: string;
  message?: React.ReactNode;
  error?: React.ReactNode;
  status?: FieldStatus;
  /** 스택 루트에 병합할 스타일. */
  fieldStyle?: React.CSSProperties;
  /** 컨트롤 렌더 결과. */
  children?: React.ReactNode;
}

/** 라벨 → 컨트롤 → 메시지 순서의 필드 수직 스택. 절대 위치 live 영역의 앵커도 소유한다. */
export function FieldStack(props: FieldStackProps): React.JSX.Element;

export interface FieldStatusIconProps {
  /** 오류 여부. status보다 우선한다. @default false */
  invalid?: boolean;
  /** 상태 아이콘 종류. @default "normal" */
  status?: FieldStatus;
  /** 아이콘 크기(px). @default 16 */
  size?: number;
}

/** invalid/positive 상태 아이콘. 장식이며 aria-hidden으로 렌더된다. */
export function FieldStatusIcon(props: FieldStatusIconProps): React.JSX.Element | null;

export interface FieldVisualState {
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  status?: FieldStatus;
  focused?: boolean;
  hovered?: boolean;
}

/** 상태 우선순위(disabled > invalid/negative > positive > focused > hovered)에 따른 테두리 색 토큰. */
export function fieldBorderColor(state: FieldVisualState): string;

/** disabled/readOnly 상태에 따른 필드 배경 토큰. */
export function fieldBackground(state: Pick<FieldVisualState, 'disabled' | 'readOnly'>): string;
