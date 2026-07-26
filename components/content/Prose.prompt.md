**Prose** — 이미 렌더된 형식화 콘텐츠(마크다운 출력, 문서 본문, 어시스턴트 rich response)에 DS 문서 타이포그래피를 입히는 표면.

```jsx
// 제품이 파싱·정화한 React 노드를 children으로 넘깁니다(파서·sanitizer는 제품 소유).
<Prose>{renderMarkdown(answer)}</Prose>
<Prose measure="72ch">{articleNodes}</Prose>
```

## 계약

- **소유 경계** — Prose는 **결과의 시각·접근성 계약만** 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(`ContentEditor`가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 [`PROSE_SURFACE_PROPOSAL.md`](../../docs/PROSE_SURFACE_PROPOSAL.md).
- **children** — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(`.lk-prose`)로 자손 요소를 조판만 합니다(`SearchField`가 pseudo-element를 다루는 것과 같은 주입 스타일 선례). 자손이 임의 HTML이면 조판 계약이 새므로 GFM 표준 요소(heading·문단·리스트·표·코드·인용·링크·강조·수평선·이미지)로 제한하세요.
- **원자 정합** — 코드 블록은 `Code block`(네이비 `<pre>`), 인라인 코드는 `Code` 인라인 칩, 인용은 `Blockquote`의 시그널 좌측 룰과 **같은 토큰**으로 처리해 산문 안에서 시각 언어가 갈라지지 않습니다.
- **heading 레벨** — 콘텐츠가 정한 레벨(`h1`–`h6`)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 `headingLevel` 선례와 정합.
- **measure** — 읽기 폭 상한(기본 `68ch`)으로 긴 줄의 가독성 저하를 막습니다. 읽기 순서 = DOM 순서.
- **표·리스트 시맨틱** — `th`/`td`·`ul`/`ol`의 의미는 요소가 전달하고 Prose는 시각만 입힙니다. task list(`li.task-list-item`)는 마커를 제거합니다.
- 색·치수는 semantic 토큰만 사용합니다(하드코딩 색 없음). 스타일은 문서에 한 번만 주입됩니다.

## 비교와 결정 근거

외부 기준은 [GitHub Flavored Markdown 명세](https://github.github.com/gfm/)(조판할 요소 집합의 권위 출처)와 마크다운 렌더 산문의 관용 타이포그래피(GitHub `markdown-body`, Tailwind Typography `prose`의 요소 계약)입니다. 이들은 카테고리 기대치 확인용이며 스타일을 그대로 복제하지 않습니다.

- 파서·sanitizer를 번들하지 않는 것은 DS를 특정 파서에 묶지 않고 보안 경계를 제품에 두기 위함입니다.
- 코드·인용을 별도 규칙으로 다시 그리지 않고 `Code`·`Blockquote` 토큰을 재사용하는 것은 산문 내부와 원자 사용처의 시각 언어를 하나로 유지하기 위함입니다.
- 이미지·각주·수식은 v1 범위 밖입니다(제품이 필요 시 자체 노드로 조합).
