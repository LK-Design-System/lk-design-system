# PrimaryDetail

목록·표·트리 같은 primary 콘텐츠와 선택 항목 상세를 연결하는 **LK Product Extension**입니다. 선택 state와 route는 제품이 소유하고, 컴포넌트는 데스크톱 inline region과 좁은 폭 focus-managed Drawer의 일관된 표현만 소유합니다.

```jsx
<PrimaryDetail
  primary={<DataGrid onRowActivate={selectRow} />}
  detailOpen={selectedId != null}
  detailTitle="로봇 상세"
  detail={<RobotDetails id={selectedId} />}
  mode={isNarrow ? 'overlay' : 'inline'}
  returnFocusRef={selectedRowRef}
  onDetailClose={clearSelection}
/>
```

- `mode="inline"`: 이름 있는 primary section 옆에 상세 `region`을 둡니다. 별도 카드 테두리를 중첩하지 않고 한 개의 세로 divider로 관계를 표현합니다.
- `mode="overlay"`: 기존 `Drawer`를 사용해 modal focus trap, Escape, scrim dismiss, trigger focus 복원을 보장합니다.
- `closeLabel`은 inline close와 overlay Drawer close에 동일하게 전달되어 presentation 전환 뒤에도 명령 이름이 바뀌지 않습니다.
- `detailOpen`, 선택된 항목, URL/history, breakpoint 판정은 controlled 제품 state입니다. 레이아웃이 임의로 선택이나 route를 바꾸지 않습니다.
- inline 닫기 역시 `returnFocusRef`가 가리키는 선택 trigger로 초점을 돌립니다.
- `detailFooter`는 inline과 overlay(Drawer) 모두에서 우측 정렬 action 행입니다. 패널의 핵심 action은 여기에 강조 variant로 두고, "전체 보기" 같은 이동은 본문에서 `TextButton`/link로 낮춥니다.
- 제품은 normal/narrow breakpoint에서 같은 상세 콘텐츠를 두 presentation에 전달해야 합니다.

## 비교와 결정 근거

내부 `Split`, `Drawer`, `DockPanel`, `DescriptionList`를 비교했습니다. `DockPanel`은 캔버스 위 도구 패널이므로 데이터 목록 상세에는 재사용하지 않고, 일반 상세는 `Drawer`와 divider만 사용합니다. [PatternFly Primary-detail](https://www.patternfly.org/patterns/primary-detail/design-guidelines/)은 선택 후 같은 맥락에서 상세를 유지하고 작은 화면에서 overlay로 전환하는 흐름을, [Fluent Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)는 현재 맥락의 보조 상세와 focus 관리를, [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)은 modal keyboard 계약을 제공합니다.

자동 media query와 route persistence는 의도적으로 넣지 않았습니다. shell의 breakpoint와 제품 router가 이미 가진 source of truth를 중복하지 않기 위해 `mode`를 controlled로 둡니다.
