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

## 좁은 화면과 긴 메시지

- 기본 폭은 335px 이상·520px 이하로 유지하되, 부모의 가용 폭이 더 작으면 그 폭까지 줄어듭니다.
  padding을 포함하는 border-box와 `min(335px, 100%)` / `min(520px, 100%)`로 적용하며
  소비자가 별도의 responsive prop이나 style 우회를 넣지 않아도 됩니다.
- 메시지는 기존 한국어 `keep-all`을 유지하고, 공백 없는 URL·식별자는 `overflow-wrap: anywhere`로
  필요할 때 줄바꿈합니다. 텍스트를 자르거나 숨기지 않고 높이를 늘립니다. 아이콘과 짧은 action·닫기
  버튼의 크기·DOM 순서·초점·타이머·라이브 영역 계약은 유지합니다.
- 비교한 sibling은 `Snackbar`입니다. 가용 폭 제한과 콘텐츠의 `minWidth: 0`, 축소하지 않는
  아이콘·action·닫기 구조를 계승하고 Toast의 gap 10px, padding, 타이포·색·그림자는 유지합니다.
- 근거: [WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)의
  320 CSS px에서 정보·기능 손실 없는 reflow와
  [Material Snackbar](https://m2.material.io/components/snackbars)의 좁은 화면에서 가장자리 여백을
  유지하고 메시지 높이를 늘리는 배치 원칙입니다. Material의 치수·행 수·아이콘·해제 정책은
  복제하지 않습니다. LDS Core의 국소 반응형 bugfix로, shared token·brand·public API 변경은 없습니다.

## 지속시간과 해제 정책 (`duration`)

- 자동 닫힘은 **컴포넌트가 소유**합니다. `duration`(ms)과 `onClose`를 함께 주면 Toast가 직접 타이머를
  돌립니다. 제품이 `setTimeout`과 hover/focus 핸들러를 손으로 배선하지 않습니다.

  ```jsx
  {/* duration 축약형: 정책값 7초 */}
  <Toast variant="positive" duration onClose={dismiss}>저장되었습니다.</Toast>
  {/* 명시적 ms */}
  <Toast variant="normal" duration={4000} onClose={dismiss}>임시 저장되었습니다.</Toast>
  ```

- 추가 행동이 없는 성공·정보 Toast의 **정책값은 7초**이며 `duration`(축약형 `true`)이 이 값을 씁니다.
  포인터가 Toast 위에 있거나 Toast 내부에 키보드 초점이 있는 동안에는 타이머가 **남은 시간을 보존한 채
  일시정지**하고, 떠나면 남은 시간부터 재개합니다(hover가 읽는 시간을 되감지 않습니다).
- `duration` 기본값은 `null`(자동 닫힘 없음)입니다. 자동으로 사라지는 것은 콘텐츠 소실이므로 **명시적
  opt-in**으로 두고, 정책을 적용할 화면이 값을 밝히도록 합니다.
- **action이 있는 Toast는 `duration`을 줘도 자동으로 닫히지 않습니다.** WCAG 2.2.1(Timing Adjustable)에
  따라 사용자가 조작해야 하는 표면에는 시간 제한을 두지 않습니다. 컴포넌트가 이 규칙을 강제하므로
  제품이 실수로 시간 제한을 걸 수 없습니다. 오류 복구·진행 상태도 같은 이유로 유지합니다.
- 중요한 정보와 유일한 복구 경로를 Toast에만 두지 않습니다. queue·재노출 기록은 제품이 소유하고,
  `Toast`는 메시지·상태·동작 표면과 자신의 타이머만 소유합니다.

## 라이브 영역

- `ToastStack` 안에서 렌더링되면 Toast는 **스스로 라이브 영역이 되지 않습니다.** 내용과 함께 삽입된
  `role="status"`는 스크린 리더가 announce하지 않는 경우가 많기 때문에, ToastStack이 열려 있는 동안
  계속 존재하는 polite/assertive 라이브 영역 한 쌍을 두고 Toast는 자기 메시지 텍스트를 그쪽으로
  밀어 넣습니다(Material·Polaris 관례).
- `negative` Toast는 assertive 영역, 나머지는 polite 영역으로 갑니다.
- ToastStack 없이 단독으로 쓰면 기존처럼 Toast 자신이 `role="status"`/`alert`를 갖습니다(하위 호환).
- [Fluent 2 Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage)는 행동 없는
  확인 Toast의 7초 timeout과 hover pause, 행동이 필요한 메시지의 persistent/conditional dismiss를
  구분합니다. LDS도 이 지속시간 문법을 따릅니다.
