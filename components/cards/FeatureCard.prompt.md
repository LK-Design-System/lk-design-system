**FeatureCard** — 틴트된 아이콘 타일 + 제목 + 설명(기능 셀). `boxed`는 Card 서피스로 감쌉니다.

```jsx
<FeatureCard tone="signal" icon={compassIcon} title="자율주행">사전 지정 경로와 실시간 장애물 회피로 이동합니다.</FeatureCard>

// 섹션 제목이 h2일 때 카드 제목을 h3로 내림
<FeatureCard headingLevel={3} tone="steel" icon={mapIcon} title="맵 편집">현장 지도를 직접 수정합니다.</FeatureCard>
```

## 계약

- **tone** — `signal`(틸 타일, 기본) · `steel` · `amber` · `navy`.
- `headingLevel` — `title`은 실제 heading으로 렌더되며 기본 레벨은 `h4`입니다(Core `Card`의 구조화 `title`은 `h3`). 카드가 놓인 문서의 제목 계층에 맞춰 `1`–`6`을 주고, 제목이 이미 카드 바깥에 있으면 `headingLevel={false}`로 heading 의미를 끄세요. 레벨은 건너뛰지 않습니다(WCAG 1.3.1).
- **카드 전체 클릭** — `onClick`을 주면 카드 루트가 `role="button"` · `tabIndex=0`이 되고 Enter/Space로 활성화됩니다(WCAG 2.1.1). 포커스 링은 토큰 레이어(`tokens/focus.css`)의 전역 `:focus-visible` 규칙이 담당하므로 카드가 따로 그리지 않습니다. 이때 **카드 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요** — 중첩 인터랙티브는 유효하지 않은 마크업이고 카드 이름이 본문 전체로 길어집니다. 행동이 여러 개면 `onClick` 없이 각 액션을 카드 안에 두세요.
- 타입 스케일 정합: 제목 19px → `--headline1-size`(18px, −1px 의도된 변경), 본문 15.5px → `--body2-size`(15px)로 스냅했습니다. NewsCard 제목(headline1)과 같은 카드 제목 단계로 정렬합니다.
