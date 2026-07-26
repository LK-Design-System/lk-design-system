**LanguageSwitcher** — TopBar와 제품 셸에서 지구본 utility로 언어 menu를 열고 UI 언어를 고르는 controlled component.

Classification: **LK Product Extension** (`product-extension`). WDS 원본 component-set에 대응하는 직접 parity 대상은 없으며, WDS Core `IconButton`, 기존 `globe` icon과 `DropdownMenu`를 조합합니다.

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

## 문제와 책임

- 제품 전체 UI 언어를 바꾸는 진입점을 TopBar 우측 utility 영역에서 일관되게 찾게 합니다.
- 컴포넌트는 지구본 menu button, 현재 locale의 checked 상태와 keyboard/focus 복원만 소유합니다.
- 번역 리소스 로딩, router/URL, 서버 렌더링, 날짜·숫자 형식, `localStorage`/cookie, `document.documentElement.lang` 갱신은 제품이 소유합니다.
- `value`는 `locales[].value` 중 하나여야 합니다. 일치하지 않거나 선택 가능한 대안이 없으면 잘못된 locale을 추측하지 않고 trigger를 비활성화합니다.
- 언어 이름은 각 언어의 자칭 표기(`한국어`, `English`, `日本語`)를 사용하고 `lang`을 부여합니다. 국기와 국가 코드는 언어의 대체 표현으로 사용하지 않습니다.

## 공개 계약

- controlled API만 제공합니다: `locales`, `value`, `onChange(nextValue, { locale })`.
- `ariaLabel`은 아이콘 전용 trigger의 접근 가능한 이름과 브라우저 hover title이며 주변 UI 언어에 맞게 제품이 번역합니다.
- `align="right"`가 TopBar 기본이고, 왼쪽 기준 배치가 필요한 독립 설정 표면에서만 `left`를 사용합니다.
- `onDark`는 dark TopBar 위의 동일한 borderless trigger에 inverse foreground를 적용합니다. menu panel은 기존 elevated menu surface를 유지합니다.
- `disabled`는 trigger와 모든 option을 비활성화합니다. locale별 `disabled`는 번역이 준비되지 않은 선택지만 유지 노출할 때 사용합니다.
- mobile 위치를 내부 breakpoint로 이동시키지 않습니다. 좁은 제품 셸은 동일 컴포넌트를 설정 Drawer/사용자 메뉴 인접 영역으로 옮기는 composition을 소유합니다.

## 접근성과 interaction

- 기존 `DropdownMenu variant="radio"`를 사용하므로 trigger는 `aria-haspopup="menu"`, `aria-expanded`, 열렸을 때 `aria-controls`를 갖습니다.
- Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열고, menu 안에서는 Up/Down, Home/End, typeahead와 Escape focus 복원을 그대로 사용합니다.
- 현재 locale은 `menuitemradio`의 `aria-checked="true"`와 기존 `check` icon으로 표시합니다. 선택 행의 색만으로 상태를 전달하지 않습니다.
- 각 label은 `lang`과 `dir="auto"`를 가져 screen reader 발음과 RTL/LTR 텍스트 방향을 보조합니다.
- locale 선택 뒤 trigger로 focus가 돌아오며, `onChange`가 앱 상태를 갱신하면 checked item과 trigger의 번역된 accessible name이 함께 바뀝니다.

## 외부 기준과 적용 결론

- [USWDS Language selector](https://designsystem.digital.gov/components/language-selector/)와 [Three or more languages](https://designsystem.digital.gov/patterns/select-a-language/three-or-more-languages/) — 언어 선택을 헤더 상단의 독립 utility로 일관되게 배치하고, 각 언어의 native name과 `lang`을 사용하며, 국기·국가 코드를 피합니다. LDS는 제품 TopBar 우측 action slot에 이 원칙을 적용합니다.
- [Federal Website Standards: Language selector](https://standards.digital.gov/standards/language-selector/) — text와 icon 중 하나를 모든 표면의 절대 표준으로 확정하지 않고 맥락과 언어 수를 연구 대상으로 둡니다. LDS는 공개 콘텐츠 사이트가 아니라 아이콘 utility가 이미 모인 제품 TopBar이므로 compact globe trigger를 선택합니다.
- [Carbon Global Header](https://carbondesignsystem.com/patterns/global-header/) — 제품 전역의 system-level utility를 global header의 utility icon 영역에 일관되게 둡니다. LDS는 언어 변경을 navigation link나 segmented control이 아닌 독립 utility menu로 둡니다.
- [Apple Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)와 [Icons](https://developer.apple.com/design/human-interface-guidelines/icons) — 조밀한 toolbar에서 의미가 명확한 기존 symbol을 재사용하고 접근 가능한 설명을 제공합니다. LDS는 새 glyph를 그리지 않고 icon registry의 24px `globe` geometry를 20px로 사용합니다.
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — menu trigger 상태, Enter/Space/Arrow 열기, menu focus 이동과 Escape 복원을 기존 `DropdownMenu` 엔진으로 충족합니다.
- [W3C WCAG Technique H57](https://www.w3.org/WAI/WCAG21/Techniques/html/H57) — 페이지의 실제 언어가 바뀔 때 앱이 `<html lang>`을 갱신해야 합니다. LDS 컴포넌트는 문서 전역을 직접 변경하지 않습니다.
- [DWP Language toggle](https://design-system.dwp.gov.uk/components/language-toggle/how-it-works) — 두 언어 전환의 실제 routing mechanism은 서비스 구현에 남긴다는 경계를 따릅니다. LDS는 TopBar 공간과 다언어 확장성을 위해 두 언어에서도 동일 menu 형태를 유지하는 의도적 차이가 있습니다.

## LDS sibling과 visual delta

- `DropdownMenu`: panel, hover/focus/disabled, viewport flip/shift와 keyboard engine뿐 아니라 공통 default density(panel padding 8px·gap 4px·radius 12px, item 14/20px·최소 높이 40px·padding 10px 16px·radius 10px)도 그대로 재사용합니다. LanguageSwitcher만의 padding override는 두지 않습니다. 언어명은 logical start에 정렬하고 radio glyph 대신 16px `check` 슬롯을 logical end에 항상 예약해 선택 변경이나 서로 다른 label 길이에도 상태 열이 움직이지 않게 하며, 각 item label에 language metadata를 추가합니다.
- menu 폭을 별도로 재정의하지 않고 DropdownMenu의 공통 적응형 기본값을 상속합니다. 짧은 locale
  집합은 176px 최소 폭을 유지하고, 긴 native name은 콘텐츠에 따라 늘어나되 320px 및 viewport
  상한을 넘지 않습니다.
- `IconButton`: 제품 TopBar sibling이 사용하는 borderless `plain` treatment와 focus/hover/disabled 문법을 유지하고, final target은 36px·glyph는 20px로 맞춥니다. dark TopBar에서는 같은 `plain` surface에 inverse foreground만 적용합니다.
- `TopBar`: 우측 `actions` slot에 놓이는 독립 utility이며 product identity나 주 navigation에 합치지 않습니다.
- icon/asset inventory: 기존 registry의 outline `globe`와 `check`만 재사용합니다. 새 SVG, flag, 국가 코드, token, border, radius, shadow, motion은 추가하지 않습니다.
- 일반 `DropdownMenu`의 text+chevron trigger와 달리 visible current label과 chevron을 의도적으로 생략합니다. 조밀한 제품 TopBar의 utility cluster에서는 globe가 category를 식별하고, 현재 locale은 열린 menu의 native-name check와 접근 가능한 이름으로 확인합니다.
- 공개·콘텐츠 사이트에서 더 높은 discoverability가 필요하면 제품이 별도 text-labeled composition을 선택합니다. 이 compact component에 `showLabel`, 국기, locale code axis를 추가하지 않습니다.

## 제품 workflow coverage

2026-07-26 기준 source pin 검토 결과, 세 필수 제품의 고정 frontend에는 locale 상태나 언어 전환 진입점이 없어 현재 adoption은 모두 `not applicable`입니다.

- LK Web Viz — `a984def117c05acd213f494cbb8a42e990595505`, `frontend/src/screens/DashboardScreen.tsx` (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`): product logo와 utility header는 확인되지만 locale state/translation route가 없습니다.
- LK Control Full Daedeok — `93802fc2aa5d29f930380ae58d51dcb68322b5e7`, `frontend/src/layout/MainLayout/index.jsx` (`2436725e49f6364fdb99f2047907f300ca367865`): fixed header와 responsive SideNav는 확인되지만 locale control이 없습니다.
- LK Context Hub — `de124084b7e50049350a46f92c4ea4476269c58c`, `src/components/layout/Sidebar.tsx` (`6f8be361287aada76ff3b2e4f6ca4022706b3b87`)와 `AuthShell.tsx` (`b525cdd54dfbf73eeec9d8867cd23a3d07c1630b`): 제품 identity shell은 확인되지만 locale control이 없습니다.

따라서 제품 route, 번역 readiness, persistence와 mobile relocation은 검증되지 않은 product-owned integration seam으로 남깁니다. 이 컴포넌트는 그 정책을 추측하지 않는 bounded UI contract입니다.
