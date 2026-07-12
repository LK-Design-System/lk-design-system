**Toast** - transient WDS feedback message on a dark surface.

```jsx
<Toast tone="positive">Saved.</Toast>
<Toast tone="cautionary" leadingIcon={false}>Check the required fields.</Toast>
```

- Use for short, temporary feedback. Use `Snackbar` when a heading, description, action, or close affordance is needed.
- WDS axes: `variant/tone` (`normal`, `positive`, `cautionary`, `negative`) and `leadingIcon`. 별칭 `info/success/warning/error`도 정규화되어 동작합니다. `closeLabel`은 닫기 접근성 레이블(기본 "닫기").
- 메시지는 `body2` 3짝(size·line·spacing) 토큰을 씁니다. 아이콘-메시지 gap 10px은 Toast 고유 메트릭으로, Snackbar(12px)와 표면별로 구분됩니다.
- severity 글리프는 공통 `Icon` registry(`statusToneStyle` 매핑)에서 옵니다. 다크 표면 위 아이콘 색만 vivid status 색을 유지합니다.
- 화면 배치는 `ToastStack`(bottom-right 등 5개 position)으로 감쌉니다.

## 지속시간과 해제 정책

- 추가 행동이 없는 성공·정보 Toast는 **7초** 뒤 자동으로 닫습니다. 포인터가 Toast 위에 있거나
  Toast 내부 동작에 키보드 초점이 있으면 타이머를 멈추고, 떠난 뒤 다시 시작합니다.
- action, 오류 복구, 진행 상태처럼 사용자가 읽거나 조작해야 하는 Toast는 자동으로 닫지 않습니다.
  action을 실행하거나 명시적 닫기 버튼, 또는 완료 조건으로 해제합니다.
- 중요한 정보와 유일한 복구 경로를 Toast에만 두지 않습니다. queue·타이머·재노출 기록은 제품이
  소유하고, `Toast`는 메시지·상태·동작 표면만 소유합니다.
- [Fluent 2 Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage)는 행동 없는
  확인 Toast의 7초 timeout과 hover pause, 행동이 필요한 메시지의 persistent/conditional dismiss를
  구분합니다. LDS도 이 지속시간 문법을 따릅니다.
