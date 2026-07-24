# Prose

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Prose` |
| Storybook | `LDS Core/Components/Content/Prose` |
| Source | `../component-content.json#core-components-content-prose` |

마크다운 출력·문서 본문·어시스턴트 rich response처럼 이미 파싱된 형식화 콘텐츠에 DS 문서 타이포그래피를 입힐 때 적합합니다. 마크다운 문자열을 파싱·정화하거나 편집이 필요할 때는 Prose를 사용하지 않고 제품의 파서·전용 편집기를 쓰며, 결과 노드만 넘기세요.

## 사용 판단

### 사용

- 마크다운 출력·문서 본문·어시스턴트 rich response처럼 이미 파싱된 형식화 콘텐츠에 DS 문서 타이포그래피를 입힐 때 적합합니다. 마크다운 문자열을 파싱·정화하거나 편집이 필요할 때는 Prose를 사용하지 않고 제품의 파서·전용 편집기를 쓰며, 결과 노드만 넘기세요.
- 색·치수는 semantic 토큰만 사용합니다(하드코딩 색 없음). 스타일은 문서에 한 번만 주입됩니다.
- 코드·인용을 별도 규칙으로 다시 그리지 않고 Code·Blockquote 토큰을 재사용하는 것은 산문 내부와 원자 사용처의 시각 언어를 하나로 유지하기 위함입니다.
- - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를….

### 사용하지 않음

- heading 레벨 — 콘텐츠가 정한 레벨(h1–h6)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 headingLevel 선례와 정합.
- 파서·sanitizer를 번들하지 않는 것은 DS를 특정 파서에 묶지 않고 보안 경계를 제품에 두기 위함입니다.
- - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를….
- 외부 기준은 GitHub Flavored Markdown 명세(조판할 요소 집합의 권위 출처)와 마크다운 렌더 산문의 관용 타이포그래피(GitHub markdown-body, Tailwind Typography prose의 요소 계약)입니다. 벤치마크한 seed-design에도 Article이 같은 역할로 있습니다. 이들은 카테고리 기대치 확인용이며 스타일을 그대로 복제하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Prose의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | 이미 렌더된 형식화 콘텐츠(마크다운을 파싱·정화한 React 노드, 문서 본문, 어시스턴트 rich response). Prose는 이 자식의 요소별 타이포그래피만 소유하며 파싱·정화·하이라이팅·편집은 제품 책임입니다. heading 레벨은 콘텐츠가 정하고 재번호하지 않으므로, 주변 문서 계층에 맞는 레벨을 넘기세요(WCAG 1.3.1). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | 이미 렌더된 형식화 콘텐츠(마크다운을 파싱·정화한 React 노드, 문서 본문, 어시스턴트 rich response). Prose는 이 자식의 요소별 타이포그래피만 소유하며 파싱·정화·하이라이팅·편집은 제품 책임입니다. heading 레벨은 콘텐츠가 정하고 재번호하지 않으므로, 주변 문서 계층에 맞는 레벨을 넘기세요(WCAG 1.3.1). |
| `measure` | `string` | No | 읽기 폭 상한(measure). 긴 줄이 가독성을 해치지 않도록 제한합니다. |

## States

| State | Contract |
| --- | --- |
| 반응형 · 320px 좁은 폭 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md.
- - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를….
- Prose의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Prose는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | heading 레벨 — 콘텐츠가 정한 레벨(h1–h6)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 headingLevel 선례와 정합. |
| 명시 규칙 2 | - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를… |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md.
- - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를….
- 사용자에게 보이는 Prose 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md.
- heading 레벨 — 콘텐츠가 정한 레벨(h1–h6)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 headingLevel 선례와 정합.
- - 소유 경계 — Prose는 결과의 시각·접근성 계약만 소유합니다. 마크다운 문자열 파싱, 신뢰할 수 없는 입력의 sanitize(보안), 구문 하이라이팅 토크나이저, 편집은 제품/transport 책임입니다(ContentEditor가 리치 텍스트 엔진을 제품에 위임한 것과 같은 선). 근거와 전체 스코프는 PROSESURFACEPROPOSAL.md. - children — 제품이 마크다운을 파싱·정화해 만든 React 노드를 넘깁니다. Prose는 스코프 클래스(.lk-prose)로 자손 요소를 조판만 합니다(SearchField가 pseudo-element를….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 색·치수는 semantic 토큰만 사용합니다(하드코딩 색 없음). 스타일은 문서에 한 번만 주입됩니다. |
| Don't | heading 레벨 — 콘텐츠가 정한 레벨(h1–h6)을 그대로 조판하고 재번호하지 않습니다. 문서 계층에 맞는 레벨을 제품이 emit해야 합니다(WCAG 1.3.1). 카드 heading의 headingLevel 선례와 정합. |
| Do | 코드·인용을 별도 규칙으로 다시 그리지 않고 Code·Blockquote 토큰을 재사용하는 것은 산문 내부와 원자 사용처의 시각 언어를 하나로 유지하기 위함입니다. |
| Don't | 파서·sanitizer를 번들하지 않는 것은 DS를 특정 파서에 묶지 않고 보안 경계를 제품에 두기 위함입니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Prose의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Overline` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
// 제품이 파싱·정화한 React 노드를 children으로 넘깁니다(파서·sanitizer는 제품 소유).
<Prose>{renderMarkdown(answer)}</Prose>
<Prose measure="72ch">{articleNodes}</Prose>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--heading1-size`
- `--heading2-size`
- `--headline1-size`
- `--headline2-size`
- `--label1-reading-line`
- `--label1-size`
- `--label1-spacing`
- `--label2-size`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-8`

### Source contracts

- `components/content/Prose.jsx`
- `components/content/Prose.d.ts`
- `components/content/Prose.prompt.md`
- `stories/ContentProse.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Prose prompt contract: `components/content/Prose.prompt.md`
- Storybook implementation evidence: `stories/ContentProse.stories.jsx`
- [GitHub Flavored Markdown 명세](https://github.github.com/gfm/)
