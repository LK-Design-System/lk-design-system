# DataExportAction

내보내기 형식과 범위, 제품이 판정한 권한, 비동기 job 상태를 표현하는 **LK Product Extension**입니다. 파일 생성·download·queue·RBAC 결정은 제품/서버가 소유합니다.

```jsx
<DataExportAction
  selectedCount={selectedCount}
  totalCount={totalCount}
  allowed={permissions.canExport}
  unavailableReason="분석가 권한이 필요합니다."
  state={exportJob.state}
  progress={exportJob.progress}
  onExport={({ format, scope }) => startExport({ format, scope })}
/>
```

- 기본 범위는 현재 페이지, 선택 항목, 전체 검색 결과를 구분합니다. 제품은 필요하면 `scopeOptions`를 완전히 제어합니다.
- 선택 수나 제품 제공 옵션이 바뀌어 현재 형식·범위가 사라지면 각각 첫 번째 유효 옵션으로 즉시 정규화합니다. 따라서 uncontrolled 사용에서도 제거된 format이나 `selected` 범위가 export 요청으로 전달되지 않습니다.
- `state="processing"`은 중복 실행을 막고 determinate/indeterminate `ProgressBar`를 표시합니다. success/error는 각각 status/alert로 알립니다.
- `allowed`는 제품 RBAC 판정 결과입니다. 기본은 disabled control과 보이는 이유이며, 보안상 action 자체를 노출하면 안 될 때만 `unavailableBehavior="hidden"`을 씁니다.
- 행 단위 export가 아니라 dataset global action이므로 `DataToolbar.actions`에 배치합니다. 선택 행 작업은 DataGrid bulk band가 계속 소유합니다.
- 별도 카드나 modal을 만들지 않으며 좁은 폭에서는 format, scope, action이 순서대로 줄바꿈됩니다.
- 내부 ghost export action은 active light/dark scope의 semantic foreground를 직접 사용하고, callback·유효 format·유효 scope가 없으면 no-op button 대신 비활성 상태가 됩니다.

## 비교와 결정 근거

내부 `DataToolbar`, `DataGrid` selection model, `Select`, `Button`, `ProgressBar`를 비교해 기존 높이·상태·아이콘을 재사용했습니다. [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)은 export를 global table toolbar action으로 분류하고, [Carbon export pattern](https://v10.carbondesignsystem.com/community/patterns/export-pattern/)은 export 시작과 processing 상태를 구분하며, [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)은 disabled action에 사용할 수 없는 이유와 접근 방법을 설명할 것을 권장합니다.

format별 옵션, 개인정보 마스킹, 대용량 비동기 전달 방식은 제품 정책이므로 컴포넌트가 추측하지 않습니다.
