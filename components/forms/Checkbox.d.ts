import * as React from 'react';

export interface CheckboxProps {
  /** 박스 옆 라벨. */
  label?: React.ReactNode;
  /** 제어되는 체크 상태. */
  checked?: boolean;
  /** 비제어 초기 상태. */
  defaultChecked?: boolean;
  /** 토글 시 다음 불리언과 함께 호출. */
  onChange?: (checked: boolean) => void;
  /** 흐림 + 상호작용 차단. @default false */
  disabled?: boolean;
  id?: string;
}

/** 라운드 사각 체크박스 — 켜지면 LK 시그널 잉크 + 화이트 체크로 채움. */
export function Checkbox(props: CheckboxProps): JSX.Element;
