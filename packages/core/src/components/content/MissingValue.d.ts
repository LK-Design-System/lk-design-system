import * as React from 'react';

export interface MissingValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 보조기술에 읽히는 문구. 결측은 `"값 없음"`(기본), 해당 없음은 `"해당 없음"`만 사용합니다. */
  label?: string;
}

/** 값이 없는 자리 — 보이는 em dash와 보조기술용 문구를 함께 제공합니다. */
export function MissingValue(props: MissingValueProps): React.JSX.Element;
