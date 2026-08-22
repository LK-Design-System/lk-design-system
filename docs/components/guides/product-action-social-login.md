# Social Login

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `SocialButton` |
| Storybook | `LDS Product/Action/Social Login` |
| Source | `../component-content.json#product-action-social-login` |

외부 계정으로 가입·로그인하는 인증 진입점을 제공할 때 적합합니다. 일반적인 제품 작업이나 자체 계정 입력에는 브랜드 버튼 대신 Button 또는 전용 로그인 폼을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| iconOnly | 원형 아이콘 버튼(48px 서클, 라벨은 aria-label로) — 아이콘 행 패턴용. @default false |
| children | 라벨 재정의(기본 "Google로 계속하기" 등 KR 카피). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `provider` | `'google' \| 'apple' \| 'facebook'` | No | 플랫폼. @default "google" |
| `tone` | `'outline' \| 'brand'` | No | 'outline' = DS 네이티브(서피스 + 헤어라인 + 풀컬러 마크, 다크 테마 대응) · 'brand' = 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2). @default "outline" |
| `iconOnly` | `boolean` | No | 원형 아이콘 버튼(48px 서클, 라벨은 aria-label로) — 아이콘 행 패턴용. @default false |
| `align` | `'center' \| 'left'` | No | 아이콘·라벨 정렬 — 킷의 Centre / Left Aligned 두 변형. @default "center" |
| `full` | `boolean` | No | 컨테이너 전체 폭. @default false |
| `children` | `React.ReactNode` | No | 라벨 재정의(기본 "Google로 계속하기" 등 KR 카피). |
| `disabled` | `boolean` | No | 비활성(흐림, 상호작용 불가). @default false |
| `as` | `React.ElementType` | No | 렌더 요소(링크는 "a"). @default "button" |

## States

| State | Contract |
| --- | --- |
| tone | 'outline' = DS 네이티브(서피스 + 헤어라인 + 풀컬러 마크, 다크 테마 대응) · 'brand' = 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2). @default "outline" |
| disabled | 비활성(흐림, 상호작용 불가). @default false |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | iconOnly는 원형 48px 마크 버튼이며 이 경우에만 aria-label(+title)로 같은 문구를 실어 이름 없는 버튼이 되지 않게 합니다. |
| 명시 규칙 2 | 페이스북 브랜드 필은 흰 텍스트 AA(4.5:1)를 위해 공식 #1877F2를 #1465D8로 어둡게 조정한 의도적 이탈입니다. tone="brand"의 원색 필과 킷 섀도는 다크 테마 자동 대응 대상이 아니며, 테마 대응이 필요하면 기본 tone="outline"을 쓰세요. |
| 명시 규칙 3 | "…로 계속하기" 소셜 로그인 버튼. 소셜 로그인 킷의 6개 심볼(Continue with Google/Apple/Facebook × Centre/Left Aligned)을 provider × align prop으로 통합. 지오메트리·타이포는 킷이 아니라 LK 컨트롤 문법(52px 높이 · radius-md · 16px 볼드 · 토큰 모션)을 따르고, 기본 tone="outline"은 DS 네이티브(서피스+헤어라인+풀컬러 마크, 다크 테마 자동 대응), tone="brand"는 킷의 플랫폼 원색 필(구글 화이트+섀도 · 애플 블랙 · 페이스북 #1877F2)을… |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Content and writing

- 이름은 가시 텍스트 하나가 담당합니다. 마크는 BrandLogo를 장식(decorative)으로 렌더하므로 "Google로 계속하기"가 한 번만 낭독됩니다. BrandLogo도 기본이 장식이라 이 지점에서 이름이 중복될 여지가 없습니다.

## Accessibility

- as로 a 등 비버튼 요소를 렌더할 때 disabled는 native disabled가 없으므로 aria-disabled="true" + 활성화 차단(preventDefault)으로 전달됩니다. 흐리기만 하고 조작 가능한 "비활성"을 만들지 않습니다. as="button"일 때는 그대로 native disabled입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ButtonGroup` | 대표 시나리오에서 조합 |
| `CopyButton` | 대표 시나리오에서 조합 |
| `SpeedDial` | 대표 시나리오에서 조합 |
| `SplitButton` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SocialButton provider="google" full />
<SocialButton provider="apple" full />
<SocialButton provider="facebook" tone="brand" full />
<SocialButton provider="google" align="left">Continue with Google</SocialButton>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--component-button-transition`
- `--font-sans`
- `--fw-bold`
- `--radius-md`

### Source contracts

- `components/buttons/SocialButton.jsx`
- `components/buttons/SocialButton.d.ts`
- `components/buttons/SocialButton.prompt.md`
- `stories/SocialButtons.stories.jsx`

## Sources

- SocialButton prompt contract: `components/buttons/SocialButton.prompt.md`
- Storybook implementation evidence: `stories/SocialButtons.stories.jsx`
