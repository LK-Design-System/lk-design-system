# Platform Logos

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `BrandLogo` |
| Storybook | `LDS Product/Content/Platform Logos` |
| Source | `../component-content.json#product-content-platform-logos` |

인증 제공자나 외부 플랫폼의 출처를 공식 마크로 구분해야 할 때 적합합니다. 일반 기능 아이콘이나 제품 고유 액션에는 플랫폼 마크 대신 LDS Icon과 명시적인 텍스트 라벨을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 접근성 이름. 지정하면 마크가 role="img"로 승격됩니다(기본은 장식). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `name` | `BrandLogoName` | Yes | 브랜드 마크. |
| `size` | `number` | No | 렌더되는 정사각 크기(px). @default 24 |
| `mono` | `boolean` | No | 단색 currentColor 실루엣으로 렌더(라이트/다크에 맞게 반전 — 푸터·다크 바에 적합). @default false |
| `decorative` | `boolean` | No | 이름이 있어도 장식용으로 강제합니다. 마크는 기본이 이미 장식(aria-hidden)이므로, 이름을 함께 넘기는 합성 표면에서만 필요합니다. @default false |
| `title` | `string` | No | 접근성 이름. 지정하면 마크가 role="img"로 승격됩니다(기본은 장식). |

## Content and writing

- name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.
- decorative는 이름을 함께 넘기면서도 장식으로 강제해야 하는 합성 표면용입니다. 이름을 주지 않는 한 기본 동작이 이미 장식이므로 대부분의 호출에는 필요 없습니다.

## Accessibility

- 마크는 기본이 장식입니다(aria-hidden="true", role 없음). Icon과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 SocialButton이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다.
- 이름이 필요하면 title(또는 aria-label)을 명시하세요. 그때만 role="img" + 그 이름으로 승격됩니다. 레지스트리 키("google")를 이름으로 흘려보내지 않습니다 — "google logo"는 사람이 읽을 이름이 아닙니다.
- 마크만으로 링크·버튼을 만들 때는 이름을 마크가 아니라 컨트롤에 주세요(IconButton / SocialButton의 aria-label).

## Examples

### 기본 조합

```jsx
<BrandLogo name="google" size={20} />
<BrandLogo name="github" size={20} mono />
<BrandLogo name="youtube" size={20} title="YouTube" />
```

## Tokens and API

### Source contracts

- `components/brand/BrandLogo.jsx`
- `components/brand/BrandLogo.d.ts`
- `components/brand/BrandLogo.prompt.md`
- `stories/BrandPlatform.stories.jsx`

## Sources

- BrandLogo prompt contract: `components/brand/BrandLogo.prompt.md`
- Storybook implementation evidence: `stories/BrandPlatform.stories.jsx`
