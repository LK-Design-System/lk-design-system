**SourceDisclosure**는 제품이 제공한 source provenance, availability, freshness metadata와 원본으로 돌아가는 경로를 하나의 중립 목록으로 보여주는 **LK Product Extension**입니다.

```jsx
<SourceDisclosure
  sources={[
    {
      id: 'ops-log',
      label: 'OPS / robot-07 inspection log',
      kind: 'log',
      availability: 'available',
      observedAt: '2026-07-10 09:14',
      excerpt: 'thermal sensor response timeout',
      href: 'https://example.com/ops-log',
    },
  ]}
/>
```

- 한 source를 본문 옆에서 짧게 귀속할 때는 `SourceTag`, 여러 source의 상태와 provenance를 비교할 때는 `SourceDisclosure`를 사용합니다. FAQ/문서 섹션처럼 일반 콘텐츠를 접을 때는 `Accordion` 또는 `Collapsible`가 소유합니다.
- 읽기 순서는 source label → kind/location → availability → disclosure cue이며, 펼친 뒤 description/excerpt → 관측·갱신 metadata → 원본 action으로 이어집니다.
- description, excerpt, timestamp 또는 metadata처럼 선택적인 상세 정보가 있을 때만 native `details/summary`를 사용합니다. action만 있는 source는 불필요한 disclosure를 만들지 않고 source label 자체를 link/button으로 제공합니다.
- disclosure chevron은 상태를 보조하는 장식 icon이고 `summary` 전체가 trigger입니다. native keyboard/expanded semantics를 유지하며 별도 `aria-expanded`를 중복 구현하지 않습니다.
- `compact`는 각 source를 attachment chip 무게의 한 줄 link chip으로 렌더합니다(카드 surface·inline disclosure·availability badge 없이, 활성화 시 원본을 엽니다). 열거된 source가 모두 열람 가능하다고 전제되는 맥락 — 예: 챗 답변 아래 citation — 에서 availability가 steady-state 노이즈가 되지 않도록 사용합니다. 펼쳐야 할 provenance(description·excerpt·metadata)가 실제로 있을 때는 기본 card를 유지합니다.
- `collapsible`은 source 목록을 `출처` 아이콘+라벨 토글 하나 뒤로 접어 resting footprint를 한 줄로 줄이고, 활성화하면 앵커드 `Popover`(드롭다운)로 목록(source당 테두리 없는 한 줄 행)을 띄웁니다. 토글은 pill·개수·chevron 없이 아이콘과 `출처` 문구만 두어 footer의 다른 action 컨트롤과 같은 무게·높이로 읽힙니다. 토글은 메시지 action bar 옆 제자리에 고정되고 패널은 떠서 열리므로 주변 레이아웃을 밀지 않으며, 바깥 pointer press나 Escape로 닫힙니다(비모달). 패널(카드)은 콘텐츠 폭에 맞춰 적응하고 너무 긴 라벨은 말줄임 처리합니다. 토글 텍스트가 disclosure의 접근 가능한 이름이라 반복되는 landmark heading을 투사하지 않습니다(inline citation과 같은 non-region 태도). `ConversationMessage`의 `inlineSources`와 조합해 ChatGPT식 footer 출처 토글을 구성합니다. `defaultOpen`으로 팝오버가 열린 상태로 시작할 수 있습니다. 출처를 항상 노출해야 하는 고신뢰 맥락에서는 `collapsible` 없이 `compact`(항상 보이는 chip) 또는 기본 card를 유지하세요.
- availability는 `StatusBadge`의 soft semantic surface + 명시적 텍스트 한 번으로만 표현합니다. disclosure chevron과 external-link icon은 각각 펼침 상태와 새 창 이동만 설명합니다.
- `href` action은 새 탭으로 열리고 external-link icon을 표시합니다. 복합 label/action에는 `actionAriaLabel`을 제공합니다.
- excerpt는 `blockquote`이며 `href`가 있으면 HTML `cite` 속성으로 원본 URL을 연결합니다.
- 좁은 폭에서는 availability가 identity 아래로 이동하고 chevron은 첫 행 끝에 남습니다. 내부 가로 스크롤이나 source별 중첩 card를 만들지 않습니다.
- source 조회, permission, freshness 계산, excerpt 생성과 renderer 선택은 제품이 소유합니다. LDS는 URL이나 timestamp에서 availability를 추론하지 않습니다.
- 기본 visible `title`은 독립 provenance 목록의 시작점을 제공합니다. 이미 `근거 N개`처럼 동등한 visible label을 제공하는 embedding surface만 `titleVisuallyHidden`을 사용해 중복 heading을 제거할 수 있으며, section의 `aria-labelledby` 이름은 그대로 유지됩니다.

## Internal LDS comparison

- `SourceTag`: 단일 출처용 compact pill과 외부 이동 표시를 재사용 기준으로 확인했습니다.
- `StatusBadge`: soft semantic surface와 명시적 상태 text 계약을 그대로 사용합니다. 지속적으로 변하는 freshness 신호가 필요할 때만 제품이 `StatusIndicator`를 별도로 조합합니다.
- `Accordion` / `Collapsible`: 행 끝 chevron, 전체 header trigger, focus·expanded cue를 시각 기준으로 삼되 SourceDisclosure는 native `details/summary`를 유지합니다.

## External research basis

- [GOV.UK Details](https://design-system.service.gov.uk/components/details/)는 일부 사용자만 필요한 부가 정보에 disclosure를 사용하고, 대부분에게 필요한 정보는 숨기지 않으며 summary text를 짧고 설명적으로 쓰도록 합니다. 따라서 action만 있는 source는 직접 link로 노출합니다.
- [WAI-ARIA APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)은 header 전체의 Enter/Space 조작, expanded state, header와 panel의 명확한 연결을 요구합니다. 이 컴포넌트는 동일한 interaction 기대를 native `details/summary` semantics로 충족합니다.
- [Carbon Accordion](https://carbondesignsystem.com/components/accordion/usage/)은 header·end icon·panel anatomy, 간결한 title, 수평 overflow 금지와 좁은 공간의 정렬을 제시합니다. LDS chevron을 행 끝에 두고 panel을 identity와 정렬한 근거입니다.
- [USWDS Collection](https://designsystem.digital.gov/components/collection/)은 source/attribution metadata를 list item으로 묶고, 모호한 “read more” 대신 각 item의 고유한 heading을 원본에 연결하며 외부 이동을 표시하도록 합니다. SourceDisclosure도 action-only item의 label을 직접 이동 경로로 사용합니다.
- [W3C Design System Quote](https://design-system.w3.org/components/quote.html)는 인용 원본 URL을 `blockquote`의 `cite` 속성으로 제공하도록 안내합니다.
