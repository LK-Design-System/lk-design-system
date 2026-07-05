import * as React from 'react';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps {
  /** 컨트롤 위의 필드 라벨. */
  label?: React.ReactNode;
  /** 옵션은 문자열 또는 `{ value, label }`. 생략하면 `<option>` 자식을 읽음. */
  options?: Array<string | SelectOption>;
  /** 제어되는 선택 값. */
  value?: string;
  /** 비제어 시 초기 값. */
  defaultValue?: string;
  /** 아무것도 선택되지 않았을 때 표시되는 플레이스홀더. @default "선택" */
  placeholder?: string;
  /** 선택된 옵션의 값과 함께 호출. */
  onChange?: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  id?: string;
  /** `<option>` 자식(하위 호환) — `options`가 없을 때 사용. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** 커스텀 단일 선택 드롭다운(스타일된 트리거 + 플로팅 패널, 시그널 포커스). 네이티브 `<select>`가 아님. */
export function Select(props: SelectProps): JSX.Element;
