import * as React from 'react';

export interface ContentEditorToolbarItem {
  /** 툴 식별자. */
  value: string;
  /** accessible name과 title로 쓰는 라벨. */
  label: string;
  /** Icon registry 이름. */
  icon?: string;
  /** icon이 없을 때 렌더할 노드. */
  children?: React.ReactNode;
  /** 비활성 상태. */
  disabled?: boolean;
}

export interface ContentEditorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** 에디터 영역 accessible label. @default "글 작성 에디터" */
  'aria-label'?: string;
  /** 제목 필드 라벨. @default "제목" */
  titleLabel?: React.ReactNode;
  /** 제목 placeholder. */
  titlePlaceholder?: string;
  /** 제어 제목 값. */
  titleValue?: string;
  /** 비제어 제목 기본값. */
  defaultTitleValue?: string;
  /** 제목 변경 콜백. */
  onTitleChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 본문 필드 라벨. @default "본문" */
  bodyLabel?: React.ReactNode;
  /** 본문 placeholder. */
  placeholder?: string;
  /** 제어 본문 값. */
  value?: string;
  /** 비제어 본문 기본값. */
  defaultValue?: string;
  /** 본문 변경 콜백. */
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** 툴바 전체를 대체하는 슬롯. */
  toolbar?: React.ReactNode;
  /** 기본 툴바 버튼 목록. */
  toolbarItems?: ContentEditorToolbarItem[];
  /** 활성 툴 식별자. */
  activeToolbarItems?: string[];
  /** 툴 버튼 실행 콜백. */
  onToolbarAction?: (value: string, item: ContentEditorToolbarItem, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 좌측 하단 메타 정보. */
  meta?: React.ReactNode;
  /** 툴바 우측 저장/검수 상태. */
  status?: React.ReactNode;
  /** 좌측 하단 도움말. */
  helper?: React.ReactNode;
  /** 우측 하단 액션 슬롯. */
  actions?: React.ReactNode;
  /** 좌측 하단 확장 슬롯. */
  footer?: React.ReactNode;
  /** 필수 표시. @default false */
  required?: boolean;
  /** 검증 오류 상태. @default false */
  invalid?: boolean;
  /** 전체 비활성. @default false */
  disabled?: boolean;
  /** 읽기 전용. @default false */
  readOnly?: boolean;
  /** 저장 중 같은 busy 상태. @default false */
  busy?: boolean;
  /** 본문 행 수. @default 12 */
  rows?: number;
  /** 본문 최대 길이. */
  maxLength?: number;
  /** 제목 input id. */
  titleId?: string;
  /** 본문 textarea id. */
  bodyId?: string;
  /** 제목 input에 전달할 props. */
  titleInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** 본문 textarea에 전달할 props. */
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

/** 게시글, 공지, 운영 로그 작성 화면에 쓰는 제목/본문/툴바/상태/액션 에디터 셸. */
export function ContentEditor(props: ContentEditorProps): JSX.Element;
