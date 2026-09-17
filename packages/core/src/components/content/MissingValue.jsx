import React from 'react';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';

/**
 * LK ROBOTICS — MissingValue
 * 값이 없는 자리. 보이는 자리에는 em dash를 그리고 보조기술에는 "값 없음"을
 * 읽어 준다. 글리프는 `aria-hidden`이므로 화면 낭독기가 대시를 문장부호로
 * 읽거나(또는 건너뛰거나) 하는 차이와 무관하게 같은 문구가 announce된다.
 *
 * 결측은 빈 문자열, 숫자 `0`, loading, error와 다른 데이터다. 목록 전체가
 * 비었거나 불러오지 못한 상황은 셀이 아니라 `EmptyState`/`ResourceState`가
 * 소유한다.
 */
export function MissingValue({ label = '값 없음', style, ...rest }) {
  return (
    <span
      style={{ color: 'var(--color-semantic-label-alternative)', ...style }}
      {...rest}
    >
      <span aria-hidden="true">—</span>
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
