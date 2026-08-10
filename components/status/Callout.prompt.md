**Callout** — 본문 흐름에 계속 남는 절차, 주의, 맥락 설명을 톤 아이콘·낮은 톤 배경·얇은 전체 테두리로 묶는 정적 노트 블록입니다. 같은 tone의 `Banner`보다 한 단계 무거운 표면이며, 그 위계는 문장이 아니라 기하로 정의됩니다.

```jsx
<Callout tone="signal" title="설치 전 확인">현장 통신 환경(LTE/5G)을 먼저 점검하세요.</Callout>
```

- **tone** 은 `signal · positive · cautionary · negative · navy`.
- **title / children** 으로 콘텐츠를 구성하며, tone에 맞는 아이콘이 항상 표시됩니다.
- **icon** 은 tone별 기본 아이콘을 다른 아이콘으로 교체할 때만 사용합니다. 생략하거나 `null`을 전달해도 기본 아이콘은 제거되지 않습니다.
- `density`는 내부 여백·gap·본문 행간만 바꿉니다. 생략하면 bounded compact component scope를 상속하고, 그 밖에서는 기존 `comfortable`을 유지하며 명시값이 우선합니다. 제목과 20px 아이콘은 축소하지 않습니다.
- 기본 `role`, live region, 액션, 닫기 기능이 없습니다. 페이지와 함께 처음부터 렌더링되는 standing guidance에 적합합니다. 비동기 상태 변화가 발표되어야 하거나 즉시 실행할 액션·닫기가 필요하면 `Banner`를 사용합니다.
- 표면은 tone의 semantic color를 섞은 충분히 구분되는 tint와 같은 계열의 1px hairline을 사용합니다. 그림자나 별도의 왼쪽 강조선은 추가하지 않습니다.
- **`Banner`와의 시각 위계는 값으로 정의됩니다.** Callout은 `--space-5 --space-6` 블록 패딩, `--radius-xl` 패널 라운드, 24px 톤 아이콘, `--body1-size` 제목, `--label1-reading-line` 본문을 씁니다. Banner는 바 패딩(`14px 16px`), `--radius-lg`, 20px 아이콘, `--body2-size` 제목을 씁니다. Banner는 한 번 읽고 지나가는 메시지 바, Callout은 읽기 열의 일부를 차지하는 제목 붙은 블록입니다. 한동안 두 표면의 실제 차이가 패딩 2px뿐이어서 서로 교체 가능해 보였고, 지금은 `stories/StatusFeedback.stories.jsx`의 play 단언이 Callout의 패딩과 라운드가 Banner를 넘는지 검사합니다. 이 값을 Banner 수준으로 낮추지 마세요.
- 제목과 한두 문장의 구체적인 안내를 함께 제공하고 본문 콘텐츠 사이에 독립된 블록으로 배치합니다. 패널 header 바로 아래에 edge-to-edge로 붙이거나 `Banner variant="embedded"`처럼 사용하지 않습니다. 아이콘과 색은 보조 단서이며 중요한 의미는 텍스트에도 씁니다.
- 상태색은 `statusToneStyle`을 통해 `--color-semantic-status-*` 계층을 직접 소비하며 `--bw-amber` 같은 primitive를 직접 사용하지 않습니다. 과거의 `--component-callout-*` 별칭 토큰은 값 없는 순수 참조여서 제거되었습니다(디자인 시스템이 상류이므로 소비자는 시맨틱 status 토큰을 채택합니다). 재도입 참조는 `check:colors` 가드가 차단합니다.
- 페이지 안에서 계속 참고해야 하는 안내에는 `Callout`을, 변하는 시스템 상태와 액션이 중요한 알림에는 `Banner`를 사용하세요. 단순히 더 강하게 보이게 하려는 목적으로 두 컴포넌트를 바꾸지 않습니다.

## 외부 레퍼런스와 LDS 결론

- [Carbon Notification usage](https://carbondesignsystem.com/components/notification/usage/)의 callout 분류처럼, 정적이고 맥락적인 정보를 일시적 notification과 분리합니다. LDS Callout도 기본 dismiss/action/live semantics를 두지 않습니다.
- [Primer Banner](https://primer.style/product/components/banner/)와 [Fluent 2 MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)는 상태 메시지와 컨테이너 결합 방식을 보여 줍니다. 그 역할이 필요한 경우 Callout 표면을 억지로 flush 처리하지 않고 `Banner`를 선택합니다.
- [GNOME HIG Banners](https://developer.gnome.org/hig/patterns/feedback/banners.html)가 view-level 상태를 banner로 다루는 것과 구분해, Callout은 현재 상태를 발표하는 영역이 아니라 본문 이해를 돕는 standing note로 남깁니다. 외부 스타일을 복제하지 않고 LDS의 semantic tone과 표면 규칙을 유지합니다.

Use `headingLevel={2|3|4|5|6}` when the Callout title starts a real subsection in the document outline. The default is `false`, which preserves a visually emphasized `div` without inventing a heading level. Choose the level from the surrounding page hierarchy rather than from the Callout's visual size.
