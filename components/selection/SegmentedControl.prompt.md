**SegmentedControl** — 단일 선택 뷰 토글. 옵션이 쿨 그레이 트랙에 놓이고, 활성 옵션은 부드러운 그림자와 함께 화이트 필로 올라갑니다.

## Public surface and ref

- `ref`, `className`, and `style` target the `radiogroup` root.
- Stable parts are `root`, `segment`, `icon`, `label`, and `count`; each segment exposes `data-state="checked|unchecked"` and `data-disabled`.
- Geometry overrides are limited to the documented `--lds-segmented-control-*` variables. Selection state and keyboard semantics stay owned by the component.

## Semantics and keyboard contract

- SegmentedControl is a named `radiogroup`, not a tablist: each segment is a radio with one roving tab stop. Arrow keys wrap across enabled segments; Home and End choose the first and last enabled segment.
- 옵션별 표준 비활성 API는 `disabled`입니다. `disable`과 `interaction="inactive"`는 기존 증거 matrix를 위한 호환 별칭이며, 모두 native `disabled` + `aria-disabled`로 수렴하고 로빙 탐색에서 제외됩니다. 그룹의 `disabled`도 모든 segment에 같은 계약을 적용합니다.
- Use it for a small set of mutually exclusive views or modes. Use Tabs only when each label owns a distinct tab panel.
- Reference basis: [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [Apple Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls).

```jsx
<SegmentedControl options={['KR', 'EN']} defaultValue="KR" onChange={setLang} />
<SegmentedControl full options={[{value:'list',label:'리스트'},{value:'grid',label:'그리드'}]} />
<SegmentedControl aria-label="상태 필터" options={[{value:'all',label:'전체',count:12},{value:'active',label:'진행 중',count:8}]} defaultValue="all" />
```

- **options** — 문자열 또는 `{ value, label, icon, count, disabled }`. `count`는 단일 선택 필터를 고르기 전에 값별 결과 건수를 비교해야 할 때 사용하며 라디오의 접근 가능한 이름과 함께 읽힙니다. **value / defaultValue / onChange** — 제어/비제어.
- **size** `sm|md|lg`는 전체 track 외곽 높이 32/40/48px입니다. Solid의 내부 padding과 Outlined의 border가 이 높이에 더해지지 않습니다. **full**은 컨테이너 폭까지 늘림.
- 상호 배타적인 2–4개의 짧은 뷰에 쓰세요. 옵션이 많거나 길거나 실제 페이지 내비게이션에는 `Tabs`를 쓰세요.

## WDS·형제 비교와 시각 델타

- WDS 내부 `Segmented Control/Segmented Control` component-set(16215:35115)의 직접 축은 `Variant(Solid/Outlined)`, `Size(Small/Medium/Large)`, `Icon(False/True)`뿐입니다. `interaction`은 공용 API 축이 아니라 상태 증거 호환값입니다.
- 단일 선택 의미와 키보드는 native `Radio` 계열과 같습니다. 비활성인데 선택된 값은 선택 정보를 지우지 않되, Radio의 회색 중심 점처럼 primary 색을 제거하고 중립 채움·비활성 전경·semibold만 남깁니다.
- ButtonGroup의 단일 선택 모드는 이 컴포넌트를 조합합니다. 따라서 높이·disabled·roving 규칙을 ButtonGroup에서 별도로 다시 만들지 않습니다.

## Selection continuity and reduced motion

- Solid의 실제 선택은 하나의 장식 surface가 segment의 위치와 너비로 이동해 표시합니다. 이전 색·모서리·그림자 값을 유지하며, 새 public prop이나 stable part를 추가하지 않습니다. Outlined와 강제 interaction matrix의 정적 표시는 기존 시각 문법을 유지합니다.
- 선택된 segment의 paint를 `styles.segment`나 `option.style`로 바꾸거나 `classNames.segment`·선택 option의 `className`을 지정하면 기존 버튼 자체가 선택 paint를 소유합니다. background·border/radius·boxShadow·opacity·filter/mask/clip·visibility·segment-local custom property를 장식면에 복사하지 않아 inline 우선순위, class의 상태 selector와 초점 paint를 보존합니다. 이 경우 위치 이동 대신 기존 fast paint 전환을 유지하며 기본 option으로 돌아오면 공유 선택면을 현재 위치에서 다시 시작합니다. root class, 텍스트·일반 layout style, label/count part와 문서화된 `vars`는 공유 이동을 유지합니다.
- 임의 root/global descendant selector만으로 segment paint를 덮어쓰는 CSS는 런타임에서 판별하지 않습니다. 선택 paint를 직접 바꾸는 CSS에는 공식 `classNames.segment` 또는 `option.className` hook을 함께 지정해야 기본 장식면이 겹치지 않습니다. 단순 root layout class를 이유로 이동을 끄지 않습니다.
- `aria-checked`, 제어형 `value`, `onChange`와 로빙 초점은 즉시 갱신됩니다. surface의 위치·너비만 `--dur-base`와 `--ease-out`으로 연속성을 보여줍니다(default 200ms, ops 160ms). 연속 선택은 CSS transition의 현재 위치에서 최신 선택으로 향하며 callback을 기다리거나 다시 실행하지 않습니다.
- ResizeObserver가 track과 segment 크기를 관찰하므로 좁은 폭, count, font/label 변경 뒤에도 실제 선택 위치에 맞습니다. 긴 label은 시각적으로 말줄임하되 전체 텍스트와 count는 접근 이름에 남습니다. RTL도 물리 좌표로 surface를 측정하며 Left/Right는 미러된 방향, Up/Down과 Home/End는 기존 논리 순서를 따릅니다.
- 실행 중 root·조상의 `dir`, `class`, `style` 속성이 바뀌면 같은 측정 함수를 다시 실행합니다. 따라서 LdsProvider나 DOM/CSS scope가 렌더 없이 방향을 바꾸고 각 segment의 크기가 그대로여도 선택면이 새 위치를 따릅니다. 관찰은 해당 조상 경로의 세 속성에 한정하며 cleanup에서 해제합니다.
- `prefers-reduced-motion: reduce`에서는 scoped guard가 transition 시간·지연만 0으로 만듭니다. 선택 surface의 최종 transform, disabled 선택 표시, 텍스트와 radio 의미를 지우지 않습니다.
- 내부 선례: Switch의 위치 상태 단서와 Disclosure의 base timing을 재사용하며, 새로운 spring·bounce·브랜드 색·모서리 token을 만들지 않습니다. Core interaction 저작이며 제품의 route·filter 실행·권한 정책은 소비자가 소유합니다.
- 외부 근거: [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)의 하나의 선택과 로빙 키보드 의미를 유지합니다. [WCAG 2.2 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)은 비필수 움직임을 끌 수 있도록 요구하므로 reduced-motion에서 보간을 생략합니다. 이동 속도와 shared surface의 형태는 이 두 문서가 정한 값이 아니라 기존 LDS token을 사용한 LDS 결정입니다.
- 검증: 기존 `SegmentedKeyboardContract`가 controlled 값의 즉시 갱신, 빠른 연속 선택, 긴 label/count, resize, RTL, disabled 선택과 reduced-motion endpoint를 함께 확인합니다.
- `check:control-motion`의 authored-browser 회귀는 part/option inline paint와 segment/option class paint의 background·shadow·radius, 일반 root/text/layout hook의 공유 이동, 외부 controlled 값 변경·disabled 전환·callback·초점과 reduced-motion을 확인합니다.
