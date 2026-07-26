import * as React from 'react';

export interface FileUploadQueueItem {
  id: React.Key;
  /** 파일명이며 progress/action accessible name에도 사용됩니다. */
  name: string;
  status: 'queued' | 'uploading' | 'processing' | 'succeeded' | 'failed';
  progress?: number;
  label?: React.ReactNode;
  sizeLabel?: React.ReactNode;
  message?: React.ReactNode;
  /**
   * `layout="grid"`에서 타일에 깔 미리보기 이미지. 생략하면 문서 아이콘으로
   * 대체됩니다. 이름이 항목을 설명하므로 이미지는 장식(`alt=""`)입니다.
   */
  thumbnailSrc?: string;
  /** 대표 항목 표시(첫 사진 등). 타일 좌상단에 배지가 붙습니다. */
  primary?: boolean;
  /** `primary` 배지 라벨. @default "대표" */
  primaryLabel?: React.ReactNode;
}

export interface FileUploadQueueProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  items?: FileUploadQueueItem[];
  title?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  /**
   * 항목 표현 방식. `list`는 문서·리포트용 행 목록(아이콘·이름·상태·크기),
   * `grid`는 사진·영상 첨부용 썸네일 타일(이미지 위에 진행률 오버레이).
   * 상태 어휘·진행률·재시도/취소/제거 의미와 접근 이름은 둘이 동일합니다.
   * @default "list"
   */
  layout?: 'list' | 'grid';
  /**
   * `layout="grid"`에서 스트립 맨 앞에 놓을 선택 트리거(카메라 타일 등).
   * 첨부가 아니라 컨트롤이므로 목록 항목으로 세지 않습니다. 선택 동작 자체는
   * `FileUpload`가 소유하며, 이 슬롯은 배치만 제공합니다.
   */
  trigger?: React.ReactNode;
  onRetry?: (item: FileUploadQueueItem) => void;
  /** 업로드·처리 중인 행의 명시적 취소 요청. */
  onCancel?: (item: FileUploadQueueItem) => void;
  onRemove?: (item: FileUploadQueueItem) => void;
  onOpen?: (item: FileUploadQueueItem) => void;
}

/**
 * 업로드·변환 항목의 파일별 표시. `layout="list"`는 문서용 상태 패널,
 * `layout="grid"`는 폼 안에 인라인으로 놓이는 미디어 첨부 스트립입니다.
 * 파일 선택은 언제나 `FileUpload`이 소유하며 이 컴포넌트는 picker를 열지 않습니다.
 */
export function FileUploadQueue(props: FileUploadQueueProps): React.JSX.Element;
