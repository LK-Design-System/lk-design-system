**SavedViewControl** — 필터, 표 레이아웃, 차트 또는 대시보드 구성을 이름 있는 보기로 선택하는 LK Product 패턴입니다.

Classification: **LK Product Extension**. WDS Core variant parity를 주장하지 않습니다. 저장된 보기의 데이터 모델, 권한, 저장소, URL, 확인 다이얼로그는 제품 계층이 소유합니다.

```jsx
<SavedViewControl
  views={views}
  value={viewId}
  onChange={setViewId}
  dirty={hasUnsavedChanges}
  saveAction={<Button onClick={save}>변경 저장</Button>}
  saveAsAction={<Button onClick={openSaveAs}>다른 이름으로 저장</Button>}
/>
```

## 계약과 읽기 순서

1. 보이는 라벨과 네이티브 단일 선택
2. `dirty` 또는 `saving` 상태(색만으로 전달하지 않음)
3. `saveAction`, `saveAsAction`, `renameAction`, `deleteAction` 순서의 제품 액션 슬롯

- `value`와 `onChange`는 완전 제어형입니다. 컴포넌트는 선택한 ID만 전달하며 보기 적용, 서버 저장, 로컬 저장, URL 동기화, 충돌 해결을 수행하지 않습니다.
- `onChange`가 없으면 조작 가능한 no-op select를 노출하지 않고 disabled read-only 표현으로 전환합니다. 빈 `views`도 같은 비활성 계약과 `emptyLabel`을 사용합니다.
- 액션은 슬롯입니다. 수정/삭제 권한, 삭제 확인, 이름 입력, 실패 메시지, 저장 중 비활성화 정책은 제품이 결정합니다.
- 작은 화면에서는 선택, 상태, 액션이 DOM 순서를 유지한 채 줄바꿈됩니다. 별도 카드 표면이나 중첩 메뉴 chrome을 만들지 않습니다.

## 내부 LDS 비교와 시각 차이

- `Select`: 높이, 입력 border, `--radius-input`, label typography와 focus ring을 맞췄습니다. 저장된 보기는 단일 문자열 선택이므로 옵션 패널을 새로 만들지 않고 네이티브 `<select>`를 사용합니다. 이 차이는 모바일 선택 UX와 기본 키보드 semantics를 보존하기 위한 것입니다.
- `Button` / `DropdownMenu`: 액션의 크기·강조·오버플로 방식은 호출자가 기존 컴포넌트로 조합합니다. SavedViewControl 내부에는 별도 버튼 스타일이나 메뉴 상태를 복제하지 않습니다.
- `FilterBar`: `viewControl`/`actions` 슬롯 안에 놓일 수 있으며, 필터 자체의 적용·초기화 계약을 가져오지 않습니다.
- `DataGrid`의 `visibleColumnKeys`/`columnOrder`와 `DashboardGrid`의 자식 순서는 제품 상태입니다. 저장 보기는 그 상태의 이름과 선택 진입점만 제공하며 내부 값을 해석하지 않습니다.

## 외부 기준과 적용 결론

- [SAP Fiori Views (Variant Management)](https://experience.sap.com/fiori-design-web/variant-management/) — view가 필터와 표/차트 레이아웃을 저장하고 선택·덮어쓰기·Save As·rename·delete를 제공하며, 변경된 view에 dirty 표시가 필요하다는 근거입니다. LDS는 이 해부학을 선택/상태/액션 슬롯으로 나누되 권한과 저장 동작은 제품에 남깁니다.
- [Fluent 2 Select](https://fluent2.microsoft.design/components/web/react/core/select/usage) — 하나의 값을 고르는 native select가 모바일에서 사용하기 쉽고 브라우저 옵션 semantics를 유지한다는 근거입니다. 그래서 rich option chrome이나 검색이 필요하지 않은 saved view 선택에 native select를 사용합니다.
- [Primer Filter pattern](https://primer.style/product/scenario-patterns/filter/) — 페이지 수준 필터는 공유 가능한 URL 상태가 기본이고 교차 세션 개인 설정은 서버 저장 대상이라는 구분을 따릅니다. SavedViewControl은 어느 저장 전략도 내장하지 않고 이벤트만 전달합니다.

의도적으로 제외: 보기 검색/즐겨찾기/공개 범위/default 지정, Save As·rename 입력 폼, delete 확인, 네트워크 오류, URL 직렬화, 제품 toast. 보기 수가 많아 검색이 필요하면 제품 overlay에서 별도 관리 흐름을 조합합니다.

대표 검증 story는 `LDS Product/Data/Operations/Saved View`의 `SavedViewActions`(최대 780px)와 `Narrow320LongLabels`(320px)입니다. 일반 폭에서 dirty → 선택 → 제품 save/save-as callback → saving 상태를, 320px에서 긴 보기 이름과 네 액션의 줄바꿈·native selection·가로 overflow 부재를 확인했습니다.
