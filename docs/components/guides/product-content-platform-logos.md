# Platform Logos

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `BrandLogo` |
| Storybook | `LDS Product/Content/Platform Logos` |
| Source | `../component-content.json#product-content-platform-logos` |

인증 제공자나 외부 플랫폼의 출처를 공식 마크로 구분해야 할 때 적합합니다. 일반 기능 아이콘이나 제품 고유 액션에는 플랫폼 마크 대신 LDS Icon과 명시적인 텍스트 라벨을 사용하세요.

## 사용 판단

### 사용

- 인증 제공자나 외부 플랫폼의 출처를 공식 마크로 구분해야 할 때 적합합니다. 일반 기능 아이콘이나 제품 고유 액션에는 플랫폼 마크 대신 LDS Icon과 명시적인 텍스트 라벨을 사용하세요.
- name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.
- - name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.
- Platform Logos가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Platform Logos가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | BrandLogo의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | 접근성 이름. 지정하면 마크가 role="img"로 승격됩니다(기본은 장식). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `name` | `BrandLogoName` | Yes | 브랜드 마크. |
| `size` | `number` | No | 렌더되는 정사각 크기(px). @default 24 |
| `mono` | `boolean` | No | 단색 currentColor 실루엣으로 렌더(라이트/다크에 맞게 반전 — 푸터·다크 바에 적합). @default false |
| `decorative` | `boolean` | No | 이름이 있어도 장식용으로 강제합니다. 마크는 기본이 이미 장식(aria-hidden)이므로, 이름을 함께 넘기는 합성 표면에서만 필요합니다. @default false |
| `title` | `string` | No | 접근성 이름. 지정하면 마크가 role="img"로 승격됩니다(기본은 장식). |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- decorative는 이름을 함께 넘기면서도 장식으로 강제해야 하는 합성 표면용입니다. 이름을 주지 않는 한 기본 동작이 이미 장식이므로 대부분의 호출에는 필요 없습니다.
- - 마크는 기본이 장식입니다(aria-hidden="true", role 없음). Icon과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 SocialButton이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다. - 이름이 필요하면 title(또는 aria-label)을 명시하세요. 그때만 role="img" + 그 이름으로 승격됩니다. 레지스트리 키("google")를 이름으로 흘려보내지 않습니다 — "google logo"는 사람이 읽을 이름이 아닙니다. - decorative는 이….
- BrandLogo의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 BrandLogo는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 제품 임계값 | 0개 내장. source/API에 없는 수치 정책은 제품 계층이 소유하고 컴포넌트에는 추가하지 않습니다. |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용.
- 마크는 기본이 장식입니다(aria-hidden="true", role 없음). Icon과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 SocialButton이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다.
- 이름이 필요하면 title(또는 aria-label)을 명시하세요. 그때만 role="img" + 그 이름으로 승격됩니다. 레지스트리 키("google")를 이름으로 흘려보내지 않습니다 — "google logo"는 사람이 읽을 이름이 아닙니다.
- decorative는 이름을 함께 넘기면서도 장식으로 강제해야 하는 합성 표면용입니다. 이름을 주지 않는 한 기본 동작이 이미 장식이므로 대부분의 호출에는 필요 없습니다.

## Accessibility

- 마크는 기본이 장식입니다(aria-hidden="true", role 없음). Icon과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 SocialButton이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다.
- 이름이 필요하면 title(또는 aria-label)을 명시하세요. 그때만 role="img" + 그 이름으로 승격됩니다. 레지스트리 키("google")를 이름으로 흘려보내지 않습니다 — "google logo"는 사람이 읽을 이름이 아닙니다.
- 마크만으로 링크·버튼을 만들 때는 이름을 마크가 아니라 컨트롤에 주세요(IconButton / SocialButton의 aria-label).
- - 마크는 기본이 장식입니다(aria-hidden="true", role 없음). Icon과 같은 기본값이며, 로고 옆에는 거의 항상 플랫폼 이름이 이미 있기 때문입니다. 기본이 정보성이면 SocialButton이 "google logo Google로 계속하기"처럼 이름을 두 번 낭독합니다. - 이름이 필요하면 title(또는 aria-label)을 명시하세요. 그때만 role="img" + 그 이름으로 승격됩니다. 레지스트리 키("google")를 이름으로 흘려보내지 않습니다 — "google logo"는 사람이 읽을 이름이 아닙니다. - decorative는 이….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용. |
| Don't | Platform Logos가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - name / size — 마크와 정사각 크기(px). mono로 어떤 마크든 currentColor 단색 실루엣으로 반전(다크바·푸터에 적합). BRANDLOGONAMES 상수로 전체 이름 목록 참조 가능. UI 모노크롬 글리프는 Icon을 쓰세요 — 이 컴포넌트는 플랫폼 브랜드 마크 전용. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 BrandLogo의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BrandLogo` | 독립적인 공개 컴포넌트이며 새로운 sibling을 만들기 전에 이 API 확장 가능성을 검토합니다. |

## Examples

### 기본 조합

```jsx
<BrandLogo name="google" size={20} />
<BrandLogo name="github" size={20} mono />
<BrandLogo name="youtube" size={20} title="YouTube" />
```

## Tokens and API

### Tokens

- `No component-specific CSS custom property; Foundation semantic tokens apply.`

### Source contracts

- `components/brand/BrandLogo.jsx`
- `components/brand/BrandLogo.d.ts`
- `components/brand/BrandLogo.prompt.md`
- `stories/BrandPlatform.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- BrandLogo prompt contract: `components/brand/BrandLogo.prompt.md`
- Storybook implementation evidence: `stories/BrandPlatform.stories.jsx`
