# HazardMarker

`HazardMarker`는 **LK Robotics Extension**입니다. AGV가 *피해야* 하는 지점 위험물(계단 등)을 제품이 분류한 severity 그대로, FacilityTransition과 같은 map-pin 실루엣 위 severity 색 배지로 보여 주는 renderer-neutral SVG fragment입니다. 회피 경로 계획, 명령, 상태 추론은 하지 않습니다.

```jsx
<svg viewBox="0 0 480 320">
  <HazardMarker
    hazard={{
      id: 'stairs-c2',
      kind: 'stairs',
      label: '중앙 계단',
      mapId: 'warehouse-1f',
      position: { x: 220, y: 140 },
      severity: 'danger',
    }}
    onActivate={(id) => inspectHazard(id)}
  />
</svg>
```

## Contract

- `hazard`는 `kind="stairs" | "ramp"`, `severity="caution" | "danger"`로 구분되는 직렬화 가능한 데이터입니다. `id`·`label`·`mapId`·`position`은 필수이며, renderer 핸들을 저장하지 않습니다.
- 같은 물리적 경사로가 fleet 능력(등판 한계·전도 위험)에 따라 어떤 제품에선 통과 설비(`FacilityTransition kind="ramp"`), 다른 제품에선 회피 지점(`HazardMarker kind="ramp"`)입니다. 그 분류는 제품이 소유하고 marker는 추론하지 않으며, 두 컴포넌트는 같은 LDS 경사로 실루엣 글리프를 공유해 어느 층으로 분류돼도 같은 대상으로 읽힙니다.
- 마커는 FacilityTransition과 **같은 map-pin 실루엣**을 공유해 한 지도의 marker가 하나의 패밀리로 읽힙니다. "피해야 한다"는 의미는 형상이 아니라 severity fill(설비의 accent 파랑 대신 cautionary/negative), 위험물 종류 knockout 글리프, 접근성 이름(`… 위험 · 심각도 …`)이 전달합니다 — 색 하나에만 의존하지 않습니다(WCAG 1.4.1). ISO 7010식 caution 삼각형도 검토했으나 지도 위 marker 패밀리 일관성을 위해 pin을 유지했고, 삼각형 badge가 필요한 제품 맥락은 이 컴포넌트 밖에서 조합합니다.
- `severity`는 회피 무게의 **시각 축**이며 availability가 아닙니다. `caution`은 cautionary, `danger`는 negative 색을 씁니다. 제품이 분류하고 marker는 kind나 위치에서 추론하지 않습니다.
- 핀 배지 위 knockout 글리프가 위험물 종류를 나타냅니다. `stairs`는 Material Symbols `stairs_2`(box 없는 계단)를 원본 그대로, `ramp`는 `_FacilityGlyph`의 LDS 경사로 실루엣을 그대로 재사용합니다(`docs/references/ATTRIBUTIONS.md`).
- marker와 label은 `viewportScale`의 역수를 적용하고 stroke는 `vector-effect="non-scaling-stroke"`를 사용합니다. 투명 hit circle은 최종 화면에서 핀보다 넓은 24 CSS px 이상 target을 유지합니다(WCAG 2.2 Target Size).
- `onActivate`는 pointer·Enter·Space로 같은 `onActivate(id, event)`를 호출하는 선택/검사 callback입니다. 회피 경로 생성이나 차단 명령 같은 command API는 의도적으로 없습니다.
- `disabled`는 활성화를 막고 `aria-disabled`를 노출하며 소비자 `tabIndex`도 `-1`로 덮어씁니다. `selected`·`focused` outline은 핀 형상을 그대로 따라가며 별도 원형 ring을 덧그리지 않습니다. `stale`은 opacity로, `invalid`는 `aria-invalid`로만 최소 표기합니다.
- 이름 있는 semantic mirror가 키보드·스크린 리더 탐색을 소유하는 composed map에서는 `aria-hidden`을 pointer-only 모드로 사용합니다. 이 모드는 role/name/state ARIA와 tabindex를 제거하고 pointer 선택 뒤 숨겨진 SVG에 포커스가 남지 않게 합니다.
- 접근성 이름은 `label → 지도 → 종류 위험 → 심각도 → 선택/포커스/비활성` 순서입니다. 개별 marker는 live region을 만들지 않습니다.

## Internal LDS comparison

- `WaypointMarker`: 단일 point 마커의 viewportScale 역스케일, obstacle 등록, focus/selection 표기, 24px hit target 계약을 그대로 계승합니다.
- `FacilityTransition`: map-pin 실루엣(`PIN_PATH`), 그림자, 형상 따라가는 focus/selection outline 기하를 공유해 hazard가 설비 marker와 한 패밀리로 읽힙니다(구분은 severity fill과 글리프 담당). 역할 경계도 유지합니다 — AGV가 실제로 지나는 설비 전이(door/lift/dock/ramp/charging/gate/handoff)는 FacilityTransition 소유이고, hazard는 전이가 아니라 배리어라서 별도 컴포넌트입니다.
- `SpatialRegion`: 넓은 keep-out·감속 **구역**은 region이 소유합니다. Hazard는 계단 같은 **지점** 위험물만 표시합니다.
- `_NavigationFocus` / `_navigationAnnotations`: focus-visible 판정, obstacle 등록, 라벨 배치 우선순위를 다른 nav overlay와 공유합니다.

## Authoritative external basis

- [ISO 7010 W-계열 경고 표지](https://www.iso.org/standard/72424.html)는 위험을 정삼각형으로 표준화합니다. 이 삼각형 badge도 검토했지만, 지도 위에서는 marker 패밀리 일관성(핀 실루엣 공유)이 더 중요하다고 판단해 pin + severity 색을 채택했고 caution/danger 색 위계는 이 표준의 경고 의미를 따릅니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 실제 shape 안에 24×24 CSS px가 들어가야 함을 설명합니다. 그래서 핀보다 넓은 투명 hit circle을 둡니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)는 상태 식별에 필요한 graphical cue가 인접 색과 3:1 이상 대비를 갖도록 요구하고, [WCAG 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)는 색을 유일한 전달 수단으로 쓰지 않도록 요구합니다. severity는 색만이 아니라 위험물 글리프와 접근성 이름(`… 위험 · 심각도 …`)으로도 전달됩니다.

## Intentional exclusions

- 회피 경로 생성, 차단·정지 명령, 권한, 장치 연결, 상태 polling은 제품 runtime 책임입니다.
- 넓은 keep-out/감속 구역은 `SpatialRegion`, AGV가 통과하는 설비는 `FacilityTransition`, 경로/궤적은 route·trajectory overlay가 소유합니다.
- 현재 `kind`는 `stairs`·`ramp` 둘입니다. 단차·낙하(dropoff), 충돌 위험물(obstacle) 등은 같은 severity·핀 배지 체계에 추가할 후속 종류이며, 각 knockout 글리프가 정해질 때 편입합니다.
- SVG marker는 유일한 탐색 경로가 아닙니다. 제품은 같은 identity와 severity를 이름 있는 semantic mirror/선택 inspector에서도 제공해야 합니다.
- WDS `.fig` component-set 근거가 없는 Robotics 확장이므로 LDS Core 또는 WDS parity로 표현하지 않습니다.
