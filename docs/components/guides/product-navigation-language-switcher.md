# Language Switcher

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `LanguageSwitcher` |
| Storybook | `LDS Product/Navigation/Language Switcher` |
| Source | `../component-content.json#product-navigation-language-switcher` |

제품 전체 UI를 두 개 이상 언어로 제공할 때 적합합니다. 조밀한 TopBar에서는 지구본 아이콘으로 진입하고 menu에서 native name과 현재 선택 상태를 확인합니다. 일부 콘텐츠만 번역하거나 실제 번역 리소스가 없는 제품에는 사용하지 않으며, 번역·URL·저장과 문서 lang 갱신은 제품이 처리합니다.

## 사용 판단

### 사용

- align="right"가 TopBar 기본이고, 왼쪽 기준 배치가 필요한 독립 설정 표면에서만 left를 사용합니다.
- DWP Language toggle — 두 언어 전환의 실제 routing mechanism은 서비스 구현에 남긴다는 경계를 따릅니다. LDS는 TopBar 공간과 다언어 확장성을 위해 두 언어에서도 동일 menu 형태를 유지하는 의도적 차이가 있습니다.

### 사용하지 않음

- value는 locales[].value 중 하나여야 합니다. 일치하지 않거나 선택 가능한 대안이 없으면 잘못된 locale을 추측하지 않고 trigger를 비활성화합니다.
- W3C WCAG Technique H57 — 페이지의 실제 언어가 바뀔 때 앱이 을 갱신해야 합니다. LDS 컴포넌트는 문서 전역을 직접 변경하지 않습니다.
- icon/asset inventory: 기존 registry의 outline globe와 check만 재사용합니다. 새 SVG, flag, 국가 코드, token, border, radius, shadow, motion은 추가하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | Accessible name for the menu button. Localize this with the surrounding UI. @default "언어 선택" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `locales` | `readonly LanguageSwitcherLocale[]` | Yes | Available locales, preferably labeled in each language's native form. |
| `value` | `string` | Yes | Controlled current locale. Must match one locales[].value. |
| `onChange` | `( nextValue: string, metadata: LanguageSwitcherChangeMetadata, ) = void` | Yes | Reports the requested locale. Translation, routing, persistence, and document language remain app-owned. |
| `ariaLabel` | `string` | No | Accessible name for the menu button. Localize this with the surrounding UI. @default "언어 선택" |
| `align` | `'left' \| 'right'` | No | Menu alignment relative to the trigger. @default "right" |
| `onDark` | `boolean` | No | Use the inverse trigger treatment on a dark TopBar surface. @default false |
| `disabled` | `boolean` | No | Disable the trigger and every locale option. @default false |

## States

| State | Contract |
| --- | --- |
| locales | Available locales, preferably labeled in each language's native form. |
| disabled | Disable the trigger and every locale option. @default false |

## Behavior and interaction

- controlled API만 제공합니다: locales, value, onChange(nextValue, { locale }).
- disabled는 trigger와 모든 option을 비활성화합니다. locale별 disabled는 번역이 준비되지 않은 선택지만 유지 노출할 때 사용합니다.
- WAI-ARIA Menu Button Pattern — menu trigger 상태, Enter/Space/Arrow 열기, menu focus 이동과 Escape 복원을 기존 DropdownMenu 엔진으로 충족합니다.
- LanguageSwitcher — TopBar와 제품 셸에서 지구본 utility로 언어 menu를 열고 UI 언어를 고르는 controlled component.
- 2026-07-26 기준 source pin 검토 결과, 세 필수 제품의 고정 frontend에는 locale 상태나 언어 전환 진입점이 없어 현재 adoption은 모두 not applicable입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Apple Toolbars와 Icons — 조밀한 toolbar에서 의미가 명확한 기존 symbol을 재사용하고 접근 가능한 설명을 제공합니다. LDS는 새 glyph를 그리지 않고 icon registry의 24px globe geometry를 20px로 사용합니다. |
| 명시 규칙 2 | DropdownMenu: panel, hover/focus/disabled, viewport flip/shift와 keyboard engine뿐 아니라 공통 default density(panel padding 8px·gap 4px·radius 12px, item 14/20px·최소 높이 40px·padding 10px 16px·radius 10px)도 그대로 재사용합니다. LanguageSwitcher만의 padding override는 두지 않습니다. |
| 명시 규칙 3 | menu 폭을 별도로 재정의하지 않고 DropdownMenu의 공통 적응형 기본값을 상속합니다. 짧은 locale 집합은 176px 최소 폭을 유지하고, 긴 native name은 콘텐츠에 따라 늘어나되 320px 및 viewport 상한을 넘지 않습니다. |
| 명시 규칙 4 | IconButton: 제품 TopBar sibling이 사용하는 borderless plain treatment와 focus/hover/disabled 문법을 유지하고, final target은 36px·glyph는 20px로 맞춥니다. dark TopBar에서는 같은 plain surface에 inverse foreground만 적용합니다. |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Responsive

- mobile 위치를 내부 breakpoint로 이동시키지 않습니다. 좁은 제품 셸은 동일 컴포넌트를 설정 Drawer/사용자 메뉴 인접 영역으로 옮기는 composition을 소유합니다.
- Federal Website Standards: Language selector — text와 icon 중 하나를 모든 표면의 절대 표준으로 확정하지 않고 맥락과 언어 수를 연구 대상으로 둡니다. LDS는 공개 콘텐츠 사이트가 아니라 아이콘 utility가 이미 모인 제품 TopBar이므로 compact globe trigger를 선택합니다.
- 공개·콘텐츠 사이트에서 더 높은 discoverability가 필요하면 제품이 별도 text-labeled composition을 선택합니다. 이 compact component에 showLabel, 국기, locale code axis를 추가하지 않습니다.
- 따라서 제품 route, 번역 readiness, persistence와 mobile relocation은 검증되지 않은 product-owned integration seam으로 남깁니다. 이 컴포넌트는 그 정책을 추측하지 않는 bounded UI contract입니다.

## Content and writing

- 언어 이름은 각 언어의 자칭 표기(한국어, English, 日本語)를 사용하고 lang을 부여합니다. 국기와 국가 코드는 언어의 대체 표현으로 사용하지 않습니다.
- ariaLabel은 아이콘 전용 trigger의 접근 가능한 이름과 브라우저 hover title이며 주변 UI 언어에 맞게 제품이 번역합니다.
- USWDS Language selector와 Three or more languages — 언어 선택을 헤더 상단의 독립 utility로 일관되게 배치하고, 각 언어의 native name과 lang을 사용하며, 국기·국가 코드를 피합니다. LDS는 제품 TopBar 우측 action slot에 이 원칙을 적용합니다.
- 일반 DropdownMenu의 text+chevron trigger와 달리 visible current label과 chevron을 의도적으로 생략합니다. 조밀한 제품 TopBar의 utility cluster에서는 globe가 category를 식별하고, 현재 locale은 열린 menu의 native-name check와 접근 가능한 이름으로 확인합니다.

## Accessibility

- 컴포넌트는 지구본 menu button, 현재 locale의 checked 상태와 keyboard/focus 복원만 소유합니다.
- 기존 DropdownMenu variant="radio"를 사용하므로 trigger는 aria-haspopup="menu", aria-expanded, 열렸을 때 aria-controls를 갖습니다.
- Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열고, menu 안에서는 Up/Down, Home/End, typeahead와 Escape focus 복원을 그대로 사용합니다.
- 현재 locale은 menuitemradio의 aria-checked="true"와 기존 check icon으로 표시합니다. 선택 행의 색만으로 상태를 전달하지 않습니다.
- 각 label은 lang과 dir="auto"를 가져 screen reader 발음과 RTL/LTR 텍스트 방향을 보조합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ThemeToggle` | 대표 시나리오에서 조합 |
| `TopBar` | 대표 시나리오에서 조합 |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `Footer` | 대표 시나리오에서 조합 |
| `NavRail` | 대표 시나리오에서 조합 |
| `SideNav` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<LanguageSwitcher
  locales={[
    { value: 'ko', label: '한국어', lang: 'ko' },
    { value: 'en', label: 'English', lang: 'en' },
  ]}
  value={locale}
  onChange={(nextLocale) => changeLocale(nextLocale)}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-disable-soft`
- `--color-semantic-label-disable`
- `--color-semantic-primary-normal`

### Source contracts

- `components/navigation/LanguageSwitcher.jsx`
- `components/navigation/LanguageSwitcher.d.ts`
- `components/navigation/LanguageSwitcher.prompt.md`
- `stories/NavigationLanguageSwitcher.stories.jsx`

## Sources

- LanguageSwitcher prompt contract: `components/navigation/LanguageSwitcher.prompt.md`
- Storybook implementation evidence: `stories/NavigationLanguageSwitcher.stories.jsx`
- [USWDS Language selector](https://designsystem.digital.gov/components/language-selector/)
- [Three or more languages](https://designsystem.digital.gov/patterns/select-a-language/three-or-more-languages/)
- [Federal Website Standards: Language selector](https://standards.digital.gov/standards/language-selector/)
- [Carbon Global Header](https://carbondesignsystem.com/patterns/global-header/)
- [Apple Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Icons](https://developer.apple.com/design/human-interface-guidelines/icons)
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [W3C WCAG Technique H57](https://www.w3.org/WAI/WCAG21/Techniques/html/H57)
