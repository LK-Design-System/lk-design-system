**ConfirmDialog** — 삭제, reset, 배포, 원격 제어처럼 되돌리기 어렵거나 안전 영향이 있는 액션을 확인하는 전용 다이얼로그.

```jsx
<ConfirmDialog
  open={open}
  tone="danger"
  title="경로를 초기화할까요?"
  confirmLabel="초기화"
  cancelLabel="취소"
  confirmDisabled={!ready}
  confirmLoading={submitting}
  onConfirm={resetRoute}
  onCancel={() => setOpen(false)}
>
  저장되지 않은 waypoint 변경 사항이 사라집니다.
</ConfirmDialog>
```

- generic content modal에는 `Modal`, 단순 알림에는 `Alert`, 명시적 확인에는 `ConfirmDialog`를 쓰세요.
- 파괴적 액션은 `tone="danger"`와 구체적인 `confirmLabel`을 사용합니다.
- `tone="danger"`는 확인 버튼에 파괴적 스타일을 적용합니다. 위험의 내용과 결과는 별도 상태 뱃지 대신 구체적인 제목·본문·동작 라벨로 설명합니다.
- 조건이 충족되기 전에는 `confirmDisabled`, 요청 중에는 `confirmLoading`을 사용해 중복 실행을 막습니다.
- 하단 CTA는 `ActionArea align="end"`와 기본 `Button` medium 높이(40px)를 따르며, 버튼 사이는 spacing token 8px을 유지합니다.
- 안전한 기본 경로인 취소는 WDS 보조 액션 문법 `variant="outlined" color="assistive"`, 확인은
  기본 primary(파괴적일 때 danger)로 표현합니다. Modal·Drawer footer도 같은 보조 액션 문법을 씁니다.
- `Modal`, `Drawer`, `Sheet`와 같은 공통 overlay focus controller를 사용합니다. 열리면 기본적으로 취소 액션으로 초점을 이동하고, 필요하면 `initialFocusRef`로 다른 내부 요소를 지정할 수 있습니다.
- `Tab`/`Shift+Tab`, 외부 focus containment, `Escape`는 현재 stack의 최상위 overlay만 소유합니다. ConfirmDialog가 다른 modal surface 위에서 닫히면 그 surface 내부의 호출 지점으로 돌아가며, base surface까지 닫힐 때 페이지 trigger로 복원합니다.
- 닫힌 뒤 별도 위치로 이동해야 하면 `returnFocusRef`, 의도적으로 복원하지 않을 때만 `restoreFocus={false}`를 사용합니다.
- 열려 있는 동안 배경 페이지 스크롤이 잠깁니다. 공용 `useDialogFocus` 엔진이 중첩 깊이를 세어 마지막
  overlay가 닫힐 때만 해제하며, 스크롤바 제거로 인한 layout shift는 body padding으로 보정합니다.

## 근거와 범위

- 가장 가까운 sibling은 `Modal`, `Drawer`, `Sheet`, `Alert`입니다. 중앙 배치, 최대 너비, 제목·설명, `ActionArea` 구조와 시각 token은 그대로 두고 focus/Escape 계층만 동일한 modal 계약으로 정렬했습니다.
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): 내부 초기 초점, Tab/Shift+Tab 순환, Escape dismiss, 호출 지점 복귀, `role="dialog"`/`aria-modal`/접근 가능한 이름을 계약으로 채택했습니다.
- [Fluent 2 Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage): 확인 surface의 분명한 제목·본문·동작 구조를 유지하고, 불가피한 중첩에서는 최상위 surface만 상호작용하도록 했습니다.

ConfirmDialog는 route 전환, 비동기 실패 정책, 파괴적 작업 권한을 소유하지 않습니다. 제품은 controlled `open` 상태와 실제 실행 정책을 연결합니다.
