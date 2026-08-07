**SourceDisclosure**는 제품이 제공한 source provenance, availability, freshness metadata와 원본으로 돌아가는 경로를 하나의 중립 목록으로 보여주는 **LK Product Extension**입니다.

```jsx
<SourceDisclosure
  sources={[
    {
      id: 'ops-log',
      label: 'OPS / robot-07 inspection log',
      kind: 'log',
      observedAt: '2026-07-10 09:14',
      excerpt: 'thermal sensor response timeout',
      href: 'https://example.com/ops-log',
    },
  ]}
/>
```

- 한 source를 본문 옆에서 짧게 귀속할 때는 `SourceTag`, 여러 source의 상태와 provenance를 비교할 때는 `SourceDisclosure`를 사용합니다. FAQ/문서 섹션처럼 일반 콘텐츠를 접을 때는 `Accordion` 또는 `Collapsible`가 소유합니다.
- `variant`가 표면을 결정합니다. 하나의 prop이 셋 중 하나를 고르며 boolean 조합으로 표면을 만들지 않습니다.
  - `inline`(기본): source 목록을 `출처 N개` 아이콘+라벨 토글 하나 뒤로 접고, 활성화하면 앵커드 `Popover`로 띄웁니다. 닫힘 상태가 한 줄이고 패널이 떠서 열리므로 주변 레이아웃을 밀지 않으며, 바깥 pointer press나 Escape로 닫힙니다(비모달). 토글 텍스트가 disclosure의 접근 가능한 이름이라 반복되는 landmark heading을 투사하지 않습니다. 조사한 assistant 제품들이 공통으로 도달한 resting shape입니다. `defaultOpen`으로 팝오버가 열린 상태에서 시작할 수 있으며, 출처를 항상 노출해야 하는 고신뢰 맥락에서는 `defaultOpen` 대신 `chips`나 `list`를 씁니다.
  - `list`: 테두리 있는 provenance 목록으로 source마다 펼침 행을 둡니다. 여러 source의 상태·시점·근거를 나란히 비교해야 할 때만 사용합니다.
  - `chips`: 각 source를 attachment chip 무게의 한 줄 link chip으로 렌더합니다. 열거된 source가 모두 열람 가능하다고 전제되는 맥락에서 씁니다.
- **availability는 예외일 때만 배지를 만듭니다.** `available`과 값을 넘기지 않은 경우는 아무것도 그리지 않습니다. 정상 상태에 배지를 달면 비정상 상태가 눈에 띄지 않게 되고, 세 행이 세 가지 색을 달면 근거 목록이 아니라 상태 대시보드로 읽힙니다. 배지가 나가는 값은 `stale`·`missing`·`error`·`unknown` 넷입니다.
- **`restricted`는 행을 만들지 않습니다.** 열람 권한이 없는 source는 목록에서 빠지고 건수만 집계됩니다. 제목을 그리는 것 자체가 그 문서의 존재를 밝히는 일이고, 권한 검사는 바로 그 공개를 막으려고 있습니다. 제품이 상류에서 이미 걸러 낸 건수는 `hiddenCount`로 더합니다. 집계는 별도 한 줄로 나가며 눈에 보이는 source 개수(`inline` 토글의 `N개` 포함)에 절대 합산하지 않습니다 — 트리밍 전에 센 총계는 숨긴 사실을 그대로 흘립니다. 문구를 바꿀 때는 `hiddenMessage`로 필요한 권한과 요청 경로를 말하고, 숨긴 source의 이름은 말하지 않습니다.
- **`badge`는 availability와 다른 축입니다.** 검증 판정, 민감도 등급처럼 제품이 소유하고 항상 보여야 하는 라벨은 `badge`로 넘깁니다. 한 주장이 `확인됨`이면서 그 출처가 동시에 `오래됨`일 수 있으므로 두 배지는 각각 나갑니다. availability를 판정 라벨로 전용하지 않습니다.
- **native `details`/`summary` 대신 커스텀 disclosure를 씁니다.** 행이 링크와 배지를 함께 들고 있고, `summary` 안의 중첩 interactive 요소는 native 지원이 무너지는 바로 그 지점입니다. iOS Safari + VoiceOver는 role과 state를 아예 노출하지 못하고, 자체 chevron을 그리려고 기본 marker를 지우는 순간 VoiceOver·JAWS·NVDA의 펼침 상태 안내가 깨집니다(일부 조합에서는 marker 방향이 유일한 state 신호입니다). `aria-expanded`와 `aria-controls`를 가진 실제 button이 state를 지키고, 배지와 링크를 그 button 바깥에 둡니다.
- disclosure button은 행 앞머리에 서고 접힘 `chevron-right-small`이 펼치면 90° 회전합니다. glyph보다 button이 커서 24×24 target을 소유합니다(WCAG 2.2 SC 2.5.8). 펼칠 것이 없는 행은 동작 없는 컨트롤을 만들지 않고 같은 폭의 spacer로 정렬만 맞춥니다.
- **source label 자체가 목적지입니다.** `href`가 있으면 label이 새 탭 링크가 되고 external-link icon을 표시합니다. `onSourceActivate`만 있으면 label이 button이 됩니다. 행에서 가장 무거운 요소가 펼치기만 하고 실제 이동은 패널 안 작은 링크에 묻히는 구조를 만들지 않습니다.
- 펼친 패널은 **excerpt로 시작합니다.** 행을 열어 볼 이유가 인용된 문장이므로 label 무게로 먼저 서고, description과 metadata가 뒤따라 그것을 설명합니다. excerpt는 `blockquote`이며 `href`가 있으면 HTML `cite` 속성으로 원본 URL을 연결합니다.
- metadata는 key와 value를 붙여 두 열로 세웁니다. 넓은 표면에서 auto-fit track은 두 쌍을 양 끝으로 벌려 한 레코드로 읽히지 않게 만듭니다.
- 읽기 순서는 source label → kind/location → 예외 배지이며, 펼친 뒤 excerpt → description → 관측·갱신 metadata로 이어집니다.
- **자기 둘레를 그리지 않습니다.** 표면은 감싸는 컨테이너가 소유합니다(표면 감사의 A 전략 — `Tree`·`LogViewer`·`StepList`와 같은 분류). provenance는 언제나 무언가 안에서 읽힙니다 — 문서 카드, `Collapsible`, 상세 패널 — 그래서 여기서 테두리를 그리면 첫 테두리 몇 px 안쪽에 두 번째 테두리가 생깁니다. `list` 변형의 그룹 표시는 행 사이 구분선만으로 충분하고, 행에는 좌우 패딩을 두지 않아 위의 제목과 같은 축에 정렬됩니다. 카드가 필요하면 제품이 `Card`로 감쌉니다. 항상 최외곽인 `ChartFrame`·`MetricCard`(C 전략)의 「제목을 카드 안 헤더로」 배치는 이 컴포넌트의 모델이 아닙니다.
- 좁은 폭에서는 배지가 identity 아래로 이동하고 chevron은 첫 행 앞머리에 남습니다. 내부 가로 스크롤이나 source별 중첩 card를 만들지 않습니다.
- source 조회, permission, freshness 계산, excerpt 생성과 renderer 선택은 제품이 소유합니다. LDS는 URL이나 timestamp에서 availability를 추론하지 않습니다.
- 기본 visible `title`은 독립 provenance 목록의 시작점을 제공합니다. 이미 `근거 N개`처럼 동등한 visible label을 제공하는 embedding surface만 `titleVisuallyHidden`을 사용해 중복 heading을 제거할 수 있으며, section의 `aria-labelledby` 이름은 그대로 유지됩니다.

## Internal LDS comparison

- `SourceTag`: 단일 출처용 compact pill과 외부 이동 표시를 재사용 기준으로 확인했습니다.
- `StatusBadge`: soft semantic surface와 명시적 상태 text 계약을 그대로 사용합니다. 지속적으로 변하는 freshness 신호가 필요할 때만 제품이 `StatusIndicator`를 별도로 조합합니다.
- `Accordion` / `Collapsible`: 행 끝 chevron, 전체 header trigger, focus·expanded cue를 시각 기준으로 삼되 SourceDisclosure는 행이 링크와 배지를 들고 있어 전체 행 trigger를 쓰지 않습니다.

## External research basis

- [GOV.UK Details](https://design-system.service.gov.uk/components/details/)는 일부 사용자만 필요한 부가 정보에 disclosure를 사용하고, 대부분에게 필요한 정보는 숨기지 않으며 summary text를 짧고 설명적으로 쓰도록 합니다. 따라서 펼칠 provenance가 없는 source는 disclosure를 만들지 않습니다.
- [WAI-ARIA APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)는 `aria-expanded`를 가진 button을 요구합니다. 행은 문서의 한 레코드이지 탐색 대상 heading이 아니므로 Accordion이 요구하는 heading wrapper를 쓰지 않고 Disclosure를 각 행에 적용합니다.
- [Scott O'Hara, "Details and Summary"](https://www.scottohara.me/blog/2022/09/12/details-summary.html)는 기본 marker를 제거하면 VoiceOver·JAWS·NVDA가 펼침 상태를 일관되게 안내하지 못하고, 일부 조합에서는 marker 방향이 유일한 state 신호라고 정리합니다. 자체 chevron을 그려야 하는 이 컴포넌트가 native `details`를 쓰지 않는 근거입니다.
- [Atlassian Table tree](https://atlassian.design/components/table-tree/usage)는 행 전체 클릭 확장을 "행 안에 button이나 dropdown 같은 interactive 요소가 없을 때만" 허용합니다. 링크와 배지를 든 행이 전용 chevron button을 두는 근거입니다.
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)은 확장 icon을 행 앞머리에 두고 각 동작이 고유한 click target을 갖게 합니다.
- [WCAG 2.2 SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 24×24 CSS px를 요구합니다. chevron glyph가 아니라 button이 target을 소유합니다.
- [RFC 9110 §15.5.5](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.5)는 서버가 리소스의 존재 자체를 밝히기를 거부해도 된다고 정합니다. 권한 없는 source를 목록에서 빼는 근거입니다.
- [SharePoint search security trimming](https://learn.microsoft.com/en-us/sharepoint/dev/general-development/custom-security-trimming-for-search-in-sharepoint-server)은 사전 트리밍이 "refiner 데이터와 hit count를 통한 정보 유출을 막는다"고 명시합니다. 숨긴 건수를 보이는 총계에 합산하지 않는 근거입니다.
- [PatternFly Empty state](https://www.patternfly.org/components/empty-state/design-guidelines)는 접근 불가 상태에서 "You don't have access to X"를 쓰지 말고 필요한 권한과 요청 경로를 안내하도록 합니다.
- [GOV.UK Tag](https://design-system.service.gov.uk/components/tag/)는 tag를 interactive 요소로 만들지 말고, 색만으로 정보를 전하지 말며, 쓸 만하다고 보는 가장 적은 수의 상태로 시작하도록 합니다. availability 배지를 예외로 한정한 근거입니다.
- [USWDS Collection](https://designsystem.digital.gov/components/collection/)은 모호한 "read more" 대신 각 item의 고유한 heading을 원본에 연결하고 외부 이동을 표시하도록 합니다. source label 자체를 이동 경로로 쓰는 근거입니다.
- [W3C Design System Quote](https://design-system.w3.org/components/quote.html)는 인용 원본 URL을 `blockquote`의 `cite` 속성으로 제공하도록 안내합니다.
