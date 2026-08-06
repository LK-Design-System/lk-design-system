import * as React from 'react';

export type AutoCompleteOption = string | {
  value: string;
  label: React.ReactNode;
  inputValue?: string;
  disabled?: boolean;
};

export interface AutoCompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'onChange' | 'onSelect' | 'size' | 'style' | 'value'
> {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 선택된 옵션의 값과 함께 호출. */
  onSelect?: (value: string) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  emptyLabel?: React.ReactNode;
  /**
   * 입력할 때 첫 후보를 자동으로 활성 옵션으로 지정할지 여부. 기본값 `false`는
   * APG list-autocomplete의 수동 선택(manual selection)으로, 사용자가 방향키로
   * 이동하기 전에는 `aria-activedescendant`가 비어 있고 Enter가 제안을 확정하지
   * 않습니다. `true`면 이전(적극적) 동작으로 되돌립니다.
   * @default false
   */
  autoHighlight?: boolean;
  /**
   * 일치 항목 수의 polite 안내 문구.
   * @default (count) => `${count}개 결과`
   */
  resultCountLabel?: (count: number) => string;
  /** @default "md" */
  size?: 'sm' | 'md' | 'small' | 'medium';
  /**
   * 컨트롤 앞에 놓는 아이콘.
   *
   * `AutoComplete`는 겉모습이 `Input`과 같아, 값이 채워져 있으면 그 칸에서 목록을
   * 뒤질 수 있다는 사실이 화면에 남지 않는다(`placeholder`는 빈 칸에만 보인다).
   * 여러 입력이 나란히 선 화면에서 찾는 칸과 적는 칸을 가르려면 표시가 필요하다.
   *
   * `SearchField`의 `startIcon` 파트와 같은 자리이며, 기본값은 없다 — 켜는 쪽을
   * 소비자가 정한다.
   */
  startIcon?: React.ReactNode;
  /** 제어와 팝업을 감싸는 기존 컨테이너 스타일. */
  style?: React.CSSProperties;
  /** label/helper/error를 포함한 전체 필드 스타일. */
  fieldStyle?: React.CSSProperties;
}

/** 필터링된 제안 목록이 있는 editable single-value combobox. */
export function AutoComplete(props: AutoCompleteProps): React.JSX.Element;
