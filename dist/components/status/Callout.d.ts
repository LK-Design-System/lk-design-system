import * as React from 'react';

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative' | 'navy';
  /** soft는 tint 표면, bordered는 같은 표면에 1px 톤 테두리를 추가합니다. @default "soft" */
  variant?: 'soft' | 'bordered';
  title?: React.ReactNode;
  /** 문서 구조에 맞는 제목 레벨. 기본 `false`는 기존 비-heading title을 유지합니다. @default false */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | false;
  /** 내부 여백과 본문 행간. compact component scope를 상속하며 명시값이 우선합니다. */
  density?: 'comfortable' | 'compact';
  /** tone별 기본 아이콘을 교체합니다. 생략하거나 null을 전달해도 기본 아이콘은 유지됩니다. */
  icon?: React.ReactElement | null;
  /** 본문 박스는 body(8px), default는 기존 컴포넌트 모서리를 유지합니다. @default "default" */
  radius?: 'default' | 'body';
  children?: React.ReactNode;
  /** 안내와 직접 연결된 단일 저강조 다음 행동. */
  action?: React.ReactNode;
}

/** tone별 아이콘, tint 표면, 선택적 톤 테두리를 제공하는 강조 노트 블록 — 안내 / 팁. */
export function Callout(props: CalloutProps): React.JSX.Element;
