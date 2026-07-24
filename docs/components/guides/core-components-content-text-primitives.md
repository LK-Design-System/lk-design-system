# Text Primitives

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Blockquote` |
| Storybook | `LDS Core/Components/Content/Text Primitives` |
| Source | `../component-content.json#core-components-content-text-primitives` |

문서에서 일반 문장과 다른 의미를 가진 인용문, 출처, 코드, 키보드 입력을 정확히 표기할 때 적합합니다. 제목과 본문 위계는 Typography를 사용하고, 긴 코드 편집이나 실행 환경을 이 콘텐츠 요소로 대신하지 마세요.

## 사용 판단

### 사용

- 문서에서 일반 문장과 다른 의미를 가진 인용문, 출처, 코드, 키보드 입력을 정확히 표기할 때 적합합니다. 제목과 본문 위계는 Typography를 사용하고, 긴 코드 편집이나 실행 환경을 이 콘텐츠 요소로 대신하지 마세요.
- 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
- - 출처는 인용문의 일부가 아닙니다. HTML 명세는 출처 표기를 blockquote 바깥에 두라고 안내하므로, attribution 이 있으면 figure (blockquote + figcaption) 으로 렌더링합니다. blockquote 안에 넣으면 "누가 말했는가"까지 인용문으로 낭독됩니다. 좌측 룰과 패딩은 figure 로 옮겨 시각은 동일합니다. - 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드….
- Text Primitives가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Text Primitives가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Blockquote의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | 출처 이름(링크되는 텍스트). |
| Label | 구분자 앞의 모노 키커. @default "SOURCE" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `attribution` | `React.ReactNode` | No | 사람이 읽는 출처 표기 줄. figcaption 으로 blockquote 바깥에 렌더링됩니다. |
| `cite` | `React.ReactNode` | No | attribution 의 레거시 별칭. HTML cite 속성(URL)과 이름이 겹치므로 새 코드에서는 attribution 을 쓰세요. |
| `citeUrl` | `string` | No | HTML cite 속성에 들어가는 출처 문서 URL. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `block` | `boolean` | No | 여러 줄 네이비 블록으로 렌더. @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `as` | `React.ElementType` | No | 렌더할 요소. @default "div" |
| `tone` | `'signal' \| 'ink' \| 'muted'` | No | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" |
| `onDark` | `boolean` | No | 다크 서피스용 색상 사용(라이트 테마 안에서). @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 출처 이름(링크되는 텍스트). |
| `label` | `string` | No | 구분자 앞의 모노 키커. @default "SOURCE" |
| `href` | `string` | No | 설정하면 외부 링크로 렌더(새 탭으로 열리고 ↗ 표시). |
| `tone` | `'default' \| 'onDark'` | No | 'default'(라이트 서피스) 또는 'onDark'(네이비 서피스). @default "default" |

## States

| State | Contract |
| --- | --- |
| tone | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" 타입 계약: 'signal' \| 'ink' \| 'muted' |
| tone | 'default'(라이트 서피스) 또는 'onDark'(네이비 서피스). @default "default" 타입 계약: 'default' \| 'onDark' |

## Behavior and interaction

- 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
- - 출처는 인용문의 일부가 아닙니다. HTML 명세는 출처 표기를 blockquote 바깥에 두라고 안내하므로, attribution 이 있으면 figure (blockquote + figcaption) 으로 렌더링합니다. blockquote 안에 넣으면 "누가 말했는가"까지 인용문으로 낭독됩니다. 좌측 룰과 패딩은 figure 로 옮겨 시각은 동일합니다. - 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드….
- Blockquote의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Blockquote는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 출처 13.5px → --label2-size(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| 명시 규칙 2 | - children — 인용문. attribution — 뮤트 톤의 출처 표기. citeUrl — HTML cite 속성(출처 문서 URL). - 타입 스케일 정합: 출처 13.5px → --label2-size(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption2-size | 11px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 타입 스케일 정합: 출처 13.5px → --label2-size(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다.
- 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
- - children — 인용문. attribution — 뮤트 톤의 출처 표기. citeUrl — HTML cite 속성(출처 문서 URL). - 타입 스케일 정합: 출처 13.5px → --label2-size(13px)로 스냅했습니다(−0.5px, 인용문 대비 뮤트 위계 유지). 인용문(headline2)과 함께 전 사이트가 토큰 스케일 위에 있습니다.
- 마크업 구조와 prop 이름.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요. |
| Don't | Text Primitives가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - 출처는 인용문의 일부가 아닙니다. HTML 명세는 출처 표기를 blockquote 바깥에 두라고 안내하므로, attribution 이 있으면 figure (blockquote + figcaption) 으로 렌더링합니다. blockquote 안에 넣으면 "누가 말했는가"까지 인용문으로 낭독됩니다. 좌측 룰과 패딩은 figure 로 옮겨 시각은 동일합니다. - 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Blockquote의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Code` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Kbd` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Overline` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `SourceTag` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ContentBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Blockquote attribution="문서 가이드">문서 화면에서는 상태, 조치, 결과가 같은 위계 안에서 읽혀야 합니다.</Blockquote>
<Blockquote attribution="LDS 접근성 가이드" citeUrl="https://example.com/a11y">…</Blockquote>
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-fill-normal`
- `--color-semantic-inverse-fill-strong`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-inverse-label-strong-soft`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-tag-height`
- `--dur-fast`
- `--ease-out`
- `--font-mono`
- `--font-sans`
- `--fs-caption`
- `--fw-bold`
- `--fw-semibold`
- `--headline2-size`
- `--label2-size`
- `--ls-overline`
- `--radius-lg`
- `--radius-pill`
- `--radius-sm`

### Source contracts

- `components/content/Blockquote.jsx`
- `components/content/Blockquote.d.ts`
- `components/content/Blockquote.prompt.md`
- `components/content/Code.jsx`
- `components/content/Code.d.ts`
- `components/content/Code.prompt.md`
- `components/content/Kbd.jsx`
- `components/content/Kbd.d.ts`
- `components/content/Kbd.prompt.md`
- `components/content/Overline.jsx`
- `components/content/Overline.d.ts`
- `components/content/Overline.prompt.md`
- `components/content/SourceTag.jsx`
- `components/content/SourceTag.d.ts`
- `components/content/SourceTag.prompt.md`
- `stories/Content.stories.jsx`

## Migration

- 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드 호환을 위해 cite prop 은 attribution 의 별칭으로 계속 동작하지만, 새 코드에서는 쓰지 마세요.
- - 출처는 인용문의 일부가 아닙니다. HTML 명세는 출처 표기를 blockquote 바깥에 두라고 안내하므로, attribution 이 있으면 figure (blockquote + figcaption) 으로 렌더링합니다. blockquote 안에 넣으면 "누가 말했는가"까지 인용문으로 낭독됩니다. 좌측 룰과 패딩은 figure 로 옮겨 시각은 동일합니다. - 이름 충돌 주의 — HTML 의 cite 속성은 사람이 읽는 이름이 아니라 출처 문서의 URL 입니다. 이 컴포넌트의 텍스트 출처는 attribution, URL 은 citeUrl 로 분리했습니다. 기존 코드….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Blockquote prompt contract: `components/content/Blockquote.prompt.md`
- Storybook implementation evidence: `stories/Content.stories.jsx`
