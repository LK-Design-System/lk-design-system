**Callout** — 본문 흐름에 계속 남는 절차, 주의, 맥락 설명을 톤 아이콘과 낮은 톤 배경으로 묶는 정적 노트 블록입니다. 같은 tone의 `Banner`보다 한 단계 무거운 표면이며, 그 위계는 문장이 아니라 기하로 정의됩니다.

```jsx
<Callout tone="signal" title="설치 전 확인">현장 통신 환경(LTE/5G)을 먼저 점검하세요.</Callout>
<Callout tone="cautionary" title="프로필 병합 안내" action={<TextButton as="a" href="/profiles/merged" tone="inherit" size="sm">병합된 프로필 보기</TextButton>}>이 프로필은 다른 프로필로 병합되었습니다.</Callout>
```

- **tone** 은 `signal · positive · cautionary · negative · navy`.
- **title / children** 으로 콘텐츠를 구성하며, tone에 맞는 아이콘이 항상 표시됩니다.
- **icon** 은 tone별 기본 아이콘을 다른 아이콘으로 교체할 때만 사용합니다. 생략하거나 `null`을 전달해도 기본 아이콘은 제거되지 않습니다.
- **action** 은 안내와 직접 연결된 단일 저강조 다음 행동입니다. 기본 조합은 `TextButton tone="inherit" size="sm"` 또는 `Link tone="inherit"`이며, action이 없으면 정적 Callout으로 렌더됩니다.
- `density`는 내부 여백·gap·본문 행간만 바꿉니다. 생략하면 bounded compact component scope를 상속하고, 그 밖에서는 기존 `comfortable`을 유지하며 명시값이 우선합니다. 제목과 24px 아이콘은 축소하지 않습니다.
- 기본 `role`, live region, 닫기 기능이 없습니다. 선택적 action도 이 정적 의미를 바꾸거나 자동으로 초점을 이동시키지 않습니다. 페이지와 함께 처음부터 렌더링되는 standing guidance에 적합하며, 비동기 상태 변화가 발표되어야 하거나 사용자가 숨길 수 있어야 하면 `Banner`를 사용합니다.
- action은 title과 children 뒤 content column에 놓고 별도 separator나 action 전용 container를 만들지 않습니다.
- 좁은 폭에서도 action은 본문 아래에서 자연스럽게 줄바꿈하며 가로 overflow를 만들지 않습니다.
- 접근성상 DOM과 키보드 순서는 제목 → 본문 → action을 유지합니다.
- **`Banner`와의 시각 위계는 값으로 정의됩니다.** Callout은 `--space-5 --space-6` 블록 패딩, `--radius-xl` 패널 라운드, 24px 톤 아이콘, `--body1-size` 제목, `--label1-reading-line` 본문을 씁니다. Banner는 바 패딩(`14px 16px`), `--radius-lg`, 20px 아이콘, `--body2-size` 제목을 씁니다. Banner는 한 번 읽고 지나가는 메시지 바, Callout은 읽기 열의 일부를 차지하는 제목 붙은 블록입니다. 한동안 두 표면의 실제 차이가 패딩 2px뿐이어서 서로 교체 가능해 보였고, 지금은 `stories/StatusFeedback.stories.jsx`의 play 단언이 Callout의 패딩과 라운드가 Banner를 넘는지 검사합니다. 이 기본값은 유지합니다. 본문 안에서 다른 상자와 모서리를 맞출 때는 아래의 명시적 body 옵션을 사용합니다.
- **variant**는 `soft | bordered`이며 기본은 기존 외곽선 없는 `soft`입니다. `bordered`는 같은 tint 표면에 tone의 semantic border 토큰을 35% 강도로 혼합한 1px 전체 테두리를 더합니다. 배경·아이콘이 이미 의미를 전달하므로 선은 요청문·문서 프레임처럼 경계만 조용히 표시합니다. 밝은 문서 배경에서 안내 영역의 경계가 필요한 경우 사용합니다. 두 변형의 바깥 크기와 콘텐츠 시작 위치는 같도록 테두리 두께만큼 패딩을 보정합니다. 제목·아이콘·라운드·density·정적 의미는 같습니다. 그림자와 왼쪽 강조선은 추가하지 않습니다.
- 제목과 한두 문장의 구체적인 안내를 함께 제공하고 본문 콘텐츠 사이에 독립된 블록으로 배치합니다. 패널 header 바로 아래에 edge-to-edge로 붙이거나 `Banner variant="embedded"`처럼 사용하지 않습니다. 아이콘과 색은 보조 단서이며 중요한 의미는 텍스트에도 씁니다.
- 상태색은 `statusToneStyle`을 통해 `--color-semantic-status-*` 계층을 직접 소비하며 `--bw-amber` 같은 primitive를 직접 사용하지 않습니다. 과거의 `--component-callout-*` 별칭 토큰은 값 없는 순수 참조여서 제거되었습니다(디자인 시스템이 상류이므로 소비자는 시맨틱 status 토큰을 채택합니다). 재도입 참조는 `check:colors` 가드가 차단합니다.
- 페이지 안에서 계속 참고해야 하는 안내와 그 안내에 직접 연결된 선택적 다음 행동에는 `Callout`을, 변하는 시스템 상태와 복구·dismiss가 중요한 알림에는 `Banner`를 사용하세요. 단순히 더 강하게 보이게 하려는 목적으로 두 컴포넌트를 바꾸지 않습니다.

## 외부 레퍼런스와 LDS 결론

- [Atlassian Section Message](https://atlassian.design/components/section-message/)처럼 standing guidance도 읽은 뒤의 맥락적 행동을 제공할 수 있습니다. LDS는 최소 기능 원칙에 따라 복수 action 대신 단일 저강조 action만 공식 지원합니다.
- [Radix Themes Callout](https://www.radix-ui.com/themes/docs/components/callout)은 본문 안 contextual link를 허용하고, [Carbon Notification usage](https://carbondesignsystem.com/components/notification/usage/)는 일반 상태 메시지와 actionable notification을 분리합니다. LDS는 링크뿐 아니라 같은 위치의 button action도 허용하되 Callout 자체에 live·dismiss semantics를 추가하지 않습니다.
- [Primer Banner](https://primer.style/product/components/banner/)와 [Fluent 2 MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)는 상태 메시지와 컨테이너 결합 방식을 보여 줍니다. 그 역할이 필요한 경우 Callout 표면을 억지로 flush 처리하지 않고 `Banner`를 선택합니다.
- [GNOME HIG Banners](https://developer.gnome.org/hig/patterns/feedback/banners.html)가 view-level 상태를 banner로 다루는 것과 구분해, Callout은 현재 상태를 발표하는 영역이 아니라 본문 이해를 돕는 standing note로 남깁니다. 외부 스타일을 복제하지 않고 LDS의 semantic tone과 표면 규칙을 유지합니다.

Use `headingLevel={2|3|4|5|6}` when the Callout title starts a real subsection in the document outline. The default is `false`, which preserves a visually emphasized `div` without inventing a heading level. Choose the level from the surrounding page hierarchy rather than from the Callout's visual size.

## 테두리 변형 (2026-09-29)

```jsx
<Callout variant="bordered" density="compact" title="편집용 PPTX도 필요한 경우">
  요청문에 편집용 PPTX도 함께 만들어 달라고 적습니다.
</Callout>
```

- 매뉴얼에서 배경만으로 경계를 구분하기 어려운 안내를 위해 추가한 opt-in LDS 변형입니다. 기존 소비자는 바뀌지 않습니다.
- 내부 비교: Banner의 동적 메시지/액션 계약, statusToneStyle의 border 전용 토큰, 기존 Callout의 아이콘·제목·밀도를 유지합니다. 문서 이미지 프레임이나 복사할 요청문은 각 컴포넌트로 표현하며 Callout으로 바꾸지 않습니다.
- [Radix Callout](https://www.radix-ui.com/themes/docs/components/callout)은 색과 표면 variant를 별도 축으로 제공합니다. LDS도 tone과 variant를 분리합니다.
- [MUI Alert variants](https://mui.com/material-ui/react-alert/#variants)는 기본형과 테두리형을 선택하도록 합니다. LDS는 배경을 제거하지 않고 기존 tint에 경계만 추가하므로 이름을 `bordered`로 정합니다. Alert의 live semantics는 도입하지 않습니다.
- 제품 workflow 적용: LK Web Viz, LK Control Full Daedeok, LK Portal 모두 이번 변경의 소비자 이관은 not applicable입니다. 정적 노트의 선택적 테두리만 추가하며 제품 화면·동작·데이터 계약은 변경하지 않습니다. 해당 제품의 채택이나 지원 검증을 주장하지 않습니다.

## 본문 박스 모서리

`radius="body"`는 Callout과 Blockquote에 공통으로 적용하는 8px(`--radius-8`) 모서리 옵션입니다. 같은 본문 열에서 비슷한 폭의 인용·안내 상자를 함께 배치할 때 두 컴포넌트 모두에 지정합니다. 역할은 제목·아이콘·배경으로 구분합니다. density와 독립적이며 패딩·글자 크기·ARIA 의미는 바꾸지 않습니다.

생략 또는 `radius="default"`는 기존 모서리(Callout 16px, Blockquote 6px)를 유지합니다. 넓은 패널형 Callout에는 기본값을 사용합니다. 전역 radius 토큰은 변경하지 않습니다.

- 내부 근거: ChoiceCard의 명시적 radius prop, LDS의 기존 `--radius-8` 토큰, 문서 프레임과 제목 바의 8px 조합. 기존 Prose·SourceDisclosure의 인용 표면은 이번 변경에 포함하지 않습니다.
- [Radix radius](https://www.radix-ui.com/themes/docs/theme/radius)는 문맥에 따른 모서리와 일부 컴포넌트의 명시적 선택을 구분합니다. LDS는 두 본문 상자에만 제한된 선택을 제공합니다.
- [Atlassian radius](https://atlassian.design/foundations/radius)는 포함 영역의 크기·용도별 모서리 체계를 사용합니다. 8px는 외부 값을 복제한 신규 토큰이 아니라 LDS 기존 토큰을 재사용한 본문 조합 결정입니다.
- LK Web Viz, LK Control Full Daedeok, LK Portal의 소비자 이관은 not applicable: 기본 렌더링·제품 동작을 변경하지 않는 opt-in 옵션입니다. 해당 제품의 채택 검증은 주장하지 않습니다.
