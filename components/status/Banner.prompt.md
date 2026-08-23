**Banner** — 현재 화면에서 동적으로 변하는 시스템 상태를 알리는 인라인 공지 바(외곽선 없는 틴트 서피스, 톤 아이콘, 메시지, 선택적 액션/닫기).

```jsx
<Banner tone="signal" title="문서 업데이트" onClose={dismiss}>디자인 시스템 문서가 업데이트되었습니다.</Banner>
<Banner tone="cautionary">일부 항목에 검토가 필요합니다.</Banner>
<Banner variant="embedded" tone="cautionary" title="제어 대기">상위 패널의 상태를 설명합니다.</Banner>
```

- **선택 기준** — 비동기 작업, 연결, 권한, 검증 결과처럼 **상태가 바뀌며 사용자가 알아야 하는 정보**에는 `Banner`를 사용합니다. 상태와 함께 다음 행동이 필요하면 `action`, 사용자가 숨겨도 되는 비차단 알림이면 `onClose`를 제공합니다. `Banner`는 기본적으로 live `status`이며 `negative` tone은 `alert`이므로, 처음부터 본문에 남아 있는 설명을 단지 색으로 강조하려는 용도로 사용하지 않습니다.
- **tone** — canonical `signal · positive · cautionary · negative`를 받으며 기본값은 `signal`입니다. 기존 `info · success · warning · error`도 별칭으로 계속 동작하지만 **동결된 어휘**라 새 코드에서는 쓰지 않습니다(`check:api-grammar`가 ledger에 없는 별칭 신규 도입을 차단합니다). 기본값이 한동안 `"info"`로 표기돼 있었는데, 별칭 정규화를 거쳐 `signal`과 같은 표면으로 렌더되던 같은 값이라 canonical 표기로 통일했습니다 — 렌더 결과는 바뀌지 않습니다. **variant** — `standalone`(기본) 또는 `embedded`. `standalone`은 상태 배경·아이콘·텍스트로 경계를 만들고 전체 외곽선을 두지 않습니다. 별도 `outlined` appearance 축도 제공하지 않습니다. **title / children** — 헤드라인 + 선택적 보충 설명. **action** — 끝의 노드. **onClose** — 닫기 버튼 표시. 떠 있는 일시 메시지에는 `Toast`를 쓰세요.
- `variant="embedded"`는 WDS 원본 variant axis가 아니라 LDS composition extension입니다. 부모 패널의 header 바로 다음에 edge-to-edge로 배치하며, 부모가 외곽 border·radius·shadow를 소유합니다. Banner는 좌우 테두리와 자체 radius를 제거하고 상·하단 구분선을 남깁니다. 이 지오메트리는 `status-presentation.js`의 공유 `embeddedBandStyle`이 정의하며(Primer Banner `flush`와 동형), ValidationSummary의 severity heading band도 같은 헬퍼를 소비합니다.
- 패널 전체의 현재 gate/state를 짧게 알릴 때는 header 바로 아래에 `variant="embedded"`를 사용합니다. 정상·잠금처럼 설명이 없어도 이해되는 상태는 제목 한 줄로 유지하고, 오류 원인이나 복구 방법이 필요한 경우에만 본문을 추가합니다. 부모 표면 안에서 `style`로 border와 radius를 임의 덮어쓰지 않습니다.
- 독립된 동적 알림에는 `standalone`, 떠 있는 일시 메시지에는 `Toast`, 본문에 계속 남는 절차·주의·맥락 설명에는 `Callout`을 사용합니다. 액션이나 닫기가 필요하다는 이유만으로 정적 설명을 Banner로 바꾸지 말고, 실제로 상태가 변하는지 먼저 판단합니다.
- tone 아이콘은 공통 `Icon` registry의 `statusToneStyle` 글리프(`circle-info-fill`, `circle-check-fill`, `triangle-exclamation-fill`, `circle-close-fill`)를 사용합니다. severity 글리프를 인라인 SVG로 새로 그리지 않습니다 — 같은 상태는 Callout·ValidationSummary와 같은 모양으로 표시되어야 합니다.
- 닫기 액션도 공통 `Icon name="close"`를 사용하며 `closeLabel`이 버튼의 접근 가능한 이름을 제공합니다.
- 타입 스케일 정합: 제목 14.5px → `--body2-size`(15px), 본문 13.5px → `--label1-size`(14px)로 스냅했습니다. Toast 메시지(body2)·Snackbar 메시지(label1)와 같은 단계로 정렬됩니다.
- 상태색은 `statusToneStyle`을 통해 `--color-semantic-status-*` 계층을 직접 소비합니다. 과거의 `--component-banner-*` 별칭 토큰은 값 없는 순수 참조여서 제거되었습니다(디자인 시스템이 상류이므로 소비자는 시맨틱 status 토큰을 채택합니다). 재도입 참조는 `check:colors` 가드가 차단합니다.

## 외부 레퍼런스와 LDS 결론

- [Atlassian Banner와 Section Message](https://atlassian.design/foundations/content/designing-messages/) 및 [MUI Alert의 기본 `standard` 변형](https://mui.com/material-ui/react-alert/#variants)처럼, 독립형 상태 알림은 톤 배경·아이콘·텍스트만으로 식별하고 전체 외곽선을 기본 시각 문법으로 사용하지 않습니다. LDS는 이 낮은 chrome 방향을 기본 계약으로 정하고 별도 `outlined` 축을 추가하지 않습니다.
- [Primer Banner](https://primer.style/product/components/banner/)의 card 안 `flush` 배치처럼, 컨테이너 상태는 별도의 둥근 카드로 중첩하지 않고 부모 표면의 폭에 결합합니다. LDS에서는 이를 `variant="embedded"`로 명시합니다. Primer의 독립형 전체 외곽선은 채택하지 않고, 결합형의 상·하단 구조 구분선만 적용합니다.
- [Fluent 2 MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)의 card-level 배치 원칙을 따라 패널 상태 Banner는 header 바로 아래, 제어 본문보다 먼저 읽히게 합니다. 상태·설명·액션의 순서도 DOM 순서와 일치시킵니다.
- [GNOME HIG Banners](https://developer.gnome.org/hig/patterns/feedback/banners.html)의 현재 view에 지속되는 중요 상태 패턴을 반영해, dialog를 열 정도는 아니지만 사용자가 다음 행동 전에 알아야 하는 상태에 Banner를 씁니다.
- [Carbon Notification usage](https://carbondesignsystem.com/components/notification/usage/)가 notification과 callout을 목적·지속성·상호작용으로 구분하는 것처럼, LDS도 시각적 강조 정도가 아니라 **동적 상태와 액션 여부**로 Banner를 선택합니다. 외부 스타일을 복제하지 않고 LDS의 status tone, spacing, radius를 유지합니다.
