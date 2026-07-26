import * as React from 'react';

export interface RecordHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** 대상의 시각 식별자 슬롯. Avatar 또는 Thumbnail 등을 넣습니다. */
  visual?: React.ReactNode;
  /** 사람·로봇·주문 등 대상의 이름. */
  title: React.ReactNode;
  /** 제목에 붙는 인증·상태 배지 슬롯. */
  badge?: React.ReactNode;
  /** 대상의 역할·종류·짧은 설명. */
  description?: React.ReactNode;
  /** StatList 또는 간결한 속성처럼 대상을 보충하는 세부 정보. */
  details?: React.ReactNode;
  /** 대상에 적용되는 설정·공유 등의 액션 영역. */
  actions?: React.ReactNode;
  /** 제목의 문서 heading 단계. @default 1 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/** 대상의 시각 식별자, 이름, 배지, 세부 정보와 액션을 묶는 레코드 정체성 헤더. */
export function RecordHeader(props: RecordHeaderProps): React.JSX.Element;
