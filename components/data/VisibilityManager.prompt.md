**VisibilityManager** — 표의 열 또는 대시보드 위젯의 표시 여부와 같은 레벨 순서를 제어하는 LK Product 패턴입니다.

Classification: **LK Product Extension**. WDS Core component set에 없는 제품 개인화 패턴이며 WDS variant parity를 주장하지 않습니다.

```jsx
<VisibilityManager
  items={columns}
  onVisibilityChange={(id, visible) => updateColumn(id, visible)}
  onOrderChange={(ids) => setColumnOrder(ids)}
  resetAction={<Button onClick={reset}>기본값으로</Button>}
/>
```

## 계약과 읽기/조작 순서

1. 제목과 범위 설명
2. 제품 소유 `resetAction`
3. 항목별 handle → 이름/설명 → `고정` 상태 → 표시 checkbox → 위/아래 이동 버튼

- `items[].visible`과 배열 순서는 완전 제어형입니다. `onVisibilityChange`와 `onOrderChange`는 의도만 전달하며 저장, 적용/취소, 사용자별 기본값, 권한을 소유하지 않습니다.
- 두 callback은 독립적입니다. visibility callback이 없으면 checkbox만, order callback이 없으면 drag·Alt+Arrow·이동 버튼만 비활성화되어 no-op 조작을 남기지 않습니다.
- `locked`는 표시 여부만 잠급니다. 고정 checkbox는 비활성화되고 텍스트 `고정`과 행의 접근성 이름으로도 전달됩니다. 순서 변경까지 막는 의미로 재사용하지 않습니다.
- 순서 변경은 drag만 제공하지 않습니다. 기존 `ReorderList`의 명명된 위/아래 버튼과 `Alt+↑/↓` keyboard 조작, live announcement를 항상 유지합니다.
- 별도 outer card를 추가하지 않습니다. 목록의 한 겹 border/radius만 사용해 DataGrid나 설정 dialog 안에서 card-in-card가 생기지 않게 합니다.

## 내부 LDS 비교와 시각 차이

- `ReorderList`: handle 24px, compact/comfortable 행 높이, divider 정렬, 한 겹 border/radius, focus/hover, 이동 버튼을 그대로 사용합니다. 유지하는 유일한 차이는 trailing 영역의 visibility checkbox와 `고정` 텍스트이며 이는 표시 상태와 변경 불가 상태를 전달하는 기능적 근거가 있습니다.
- `Checkbox`: 기존 controlled checked/disabled/focus 처리를 그대로 사용합니다. 복합 label을 checkbox 안에 반복하지 않고 각 행의 제목을 접근성 이름에 결합합니다.
- `DataGrid`: `visibleColumnKeys`와 `columnOrder`를 이미 controlled projection으로 받습니다. VisibilityManager 결과를 이 두 prop으로 연결할 수 있지만 열 정의나 표 자체를 직접 변경하지 않습니다.
- `DashboardGrid`: 카드 표면과 순서를 소유하지 않는 layout primitive입니다. 제품은 동일한 manager 결과로 자식 위젯 순서를 구성할 수 있습니다.
- `DropdownMenu`: 2–3개 즉시 액션에는 적합하지만 표시/잠금/순서를 동시에 편집하는 구조에는 정보 밀도와 keyboard order가 부족하므로 목록 패턴을 사용합니다.

## 외부 기준과 적용 결론

- [PatternFly Column management modal](https://www.patternfly.org/component-groups/helpers/column-management-modal/) — customizable columns가 show/hide, 변경 불가 checkbox, drag reorder, 적용 시 controlled column state를 제공한다는 근거입니다. LDS는 이를 열뿐 아니라 위젯에도 쓸 수 있는 headless product contract로 일반화합니다.
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/) — table settings는 global table toolbar 영역에 놓고, dense table을 작은 중첩 container에 넣지 말아야 한다는 근거입니다. Manager는 toolbar/dialog slot에 들어가며 자체 card chrome을 추가하지 않습니다.
- [SAP Fiori Views (Variant Management)](https://experience.sap.com/fiori-design-web/variant-management/) — column visibility, sort, grouping, layout 같은 control parameter가 저장 view의 일부가 될 수 있다는 근거입니다. Manager는 편집 의도만 내보내고 SavedViewControl 또는 제품 저장 계층이 snapshot을 소유합니다.

의도적으로 제외: 적용/취소 footer, modal/drawer, 검색, 권한 편집, 사용자별 persistence, drag handle만 있는 interaction, 열 width/pinning/grouping editor, 위젯 resize. DataGrid 열과 DashboardGrid 위젯의 구체 스키마는 제품 adapter가 매핑합니다.

대표 검증 story는 `LDS Product/Data/Operations/Visibility Manager`의 `VisibilityAndOrder`(최대 780px)와 `Narrow320LongLabels`(320px)입니다. 일반 폭에서 unlocked 표시 callback, locked 표시 불변, 명명된 이동 버튼의 order callback을 확인했고, 320px에서 긴 label truncation, 고정 상태, reset slot, 위/아래 버튼 유지와 가로 overflow 부재를 확인했습니다.
