**ExpandableText** — 지정 줄 수로 클램프하고 "더 보기 / 접기"로 나머지를 펼치는 인라인 텍스트. 피드 본문·긴 설명·댓글에. 피드 전용이 아닌 일반 텍스트 유틸입니다.

```jsx
<ExpandableText lines={3}>
  {longBodyText}
</ExpandableText>

<ExpandableText lines={2} moreLabel="펼치기" lessLabel="접기" onToggle={setOpen}>
  {description}
</ExpandableText>
```

## 계약

- **clamp는 시각적 컷** — 전체 텍스트는 항상 DOM에 있습니다. `lines`로 접힘 높이를 정하고 `-webkit-line-clamp`로 자를 뿐, 스크린리더는 펼침 여부와 무관하게 전문을 읽습니다. 정보를 감추지 않습니다.
- **toggle 접근성** — 펼치기/접기는 실제 `button`이며 `aria-expanded`와 `aria-controls`(텍스트 영역 id)를 소유합니다. 보조기기가 접힘/펼침 상태와 대상 영역을 낭독합니다. 포커스 링은 전역 `:focus-visible` 규칙을 따릅니다.
- **넘칠 때만 컨트롤** — 오버플로는 `scrollHeight`를 `line-height × lines`와 비교해 판정하며, 이는 접힘·펼침 두 상태에서 모두 성립합니다(그래서 `defaultExpanded`인 글도 접을 수 있음). 짧아서 안 넘치는 텍스트에는 토글이 렌더되지 않습니다.
- **lines** — 접힘 상태의 줄 수. @default 3.
- **moreLabel / lessLabel** — 펼치기/접기 라벨. @default "더 보기" / "접기".
- **expanded / defaultExpanded / onToggle** — 제어형(`expanded`)이면 상태를 부모가 소유하고, 비제어형이면 `defaultExpanded`로 시작해 내부 상태를 씁니다. 두 경우 모두 전환 시 `onToggle(expanded)`가 호출됩니다.
- **as** — 텍스트를 렌더할 요소(`p`·`div` 등). @default "div". **textStyle**로 색·크기를 덮어씁니다.
- 리사이즈에 반응해 오버플로를 다시 측정합니다(`ResizeObserver`, 미지원 환경은 `resize` 이벤트).

## 비교와 결정 근거

인라인 truncation + reveal은 보편 UI이므로 외부 category reference에서 도출했습니다 — Material 텍스트 truncation, ARIA Disclosure 패턴(`aria-expanded`/`aria-controls`), 소셜/뉴스 피드의 "…더 보기" 관용. 사내 근거는 카드 계열의 2줄 clamp(`NewsCard`·`ListingCard`)를 토글 가능한 형태로 일반화한 것입니다.

- **`Collapsible`과 다르다** — `Collapsible`은 제목이 있는 **섹션**을 접습니다. `ExpandableText`는 제목 없는 **인라인 본문 텍스트**를 줄 단위로 자르고 펼칩니다. 의미와 조판이 다른 별개 컴포넌트입니다.
- clamp 높이를 `max-height`가 아니라 `-webkit-line-clamp`로 잡아 줄 수 기준으로 정확히 자르고, 애니메이션 없이 즉시 전환해 모션 과민 사용자에게 안전합니다.
