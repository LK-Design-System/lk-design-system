import * as React from 'react';

export interface OverlayStatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 상태 톤. `neutral`은 휴지 상태용(상태색 없음 — hold-to-run 컨트롤의 대기처럼
   * 정상인 기다림에 경보를 쓰지 않습니다). `cautionary`/`negative`는 실제로
   * 격상되는 경우에만 쓰며, 글리프·색은 Status 가족의 공용 톤 어휘를 따릅니다.
   * @default "neutral"
   */
  tone?: 'neutral' | 'cautionary' | 'negative';
  /** 톤 기본 글리프를 교체하는 Icon 이름. */
  icon?: string;
  /** 칩 라벨. 한 줄로 말줄임되며, 색만으로 상태를 전달하지 않는 필수 텍스트 채널입니다. */
  children?: React.ReactNode;
}

/**
 * 표면 위에 앵커되는 비차단 상태 알약 — 레이아웃·포인터 불참, `role="status"`.
 * 기본 배치는 상대 컨테이너의 상단 중앙이며 `style`로 재배치합니다. 설명 대상
 * 컨트롤이 `inert`여도 읽히도록 그 서브트리 **밖**에 두세요.
 */
export function OverlayStatusChip(props: OverlayStatusChipProps): React.JSX.Element;
