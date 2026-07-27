# NavigationAnnotationLayer

Classification: **LK Robotics Extension**. `NavigationAnnotationLayer`는 한 `<svg>` 안에서 형제로 합성된 내비게이션 오버레이들(`components/robotics/RouteOverlay.jsx`, `components/robotics/TrajectoryOverlay.jsx`, `components/robotics/LaneOverlay.jsx`, `components/robotics/WaypointMarker.jsx`, `components/robotics/SpatialRegion.jsx`, `components/robotics/FacilityTransition.jsx`)의 **장식 라벨 블록 간 화면 충돌**을 조정하는 SVG `<g>` reference renderer입니다. 각 오버레이 prompt.md가 "전체 feature 집합을 아는 owning renderer" 책임으로 위임해 온 cross-layer label collision의 그 renderer 조각을 LDS가 직접 출하하는 것이며, provider 없이 단독 렌더된 오버레이는 오늘과 동일하게 동작합니다.

```jsx
<svg viewBox="0 0 540 360">
  <NavigationAnnotationLayer maxLabelDisplacementPx={56} labelGapPx={4}>
    <SpatialRegion region={dockApron} viewportScale={scale} />
    <LaneOverlay lane={corridor} viewportScale={scale} />
    <RouteOverlay route={delivery17} activeMapId="L1" viewportScale={scale} />
    <TrajectoryOverlay trajectory={robot2Forecast} viewportScale={scale} />
    <WaypointMarker waypoint={pickupP1} viewportScale={scale} />
    <FacilityTransition transition={eastDoor} activeMapId="L1" viewportScale={scale} />
  </NavigationAnnotationLayer>
</svg>
```

## Contract

- `detailMode`는 라벨 밀도를 `overview | standard | detail`의 세 단계로 명시합니다. `overview`는 현재 진행 문맥, `standard`는 주요 point, `detail`은 완료 구간·lane·region까지 포함하며 기본값은 `standard`입니다. 이 prop은 장식 라벨의 등록·표시 우선순위만 바꾸고 marker, accessible name, semantic mirror, hit target, paint order는 바꾸지 않습니다.

- `children`은 조정에 참여할 내비게이션 오버레이 형제들입니다. layer는 SVG `<g>`이므로 반드시 소유 `<svg>` 안에서 합성하며, 자식은 위 오버레이 목록처럼 이 layer의 참여 계약을 구현한 fragment여야 합니다. 참여하지 않는 임의 SVG 노드는 그대로 통과 렌더되며 조정 대상도, 장애물도 되지 않습니다.
- **라벨만 움직입니다.** 마커, 상태 badge, pin, focus/selection ring, hit target, 접근 가능한 이름, semantic mirror는 절대 이동·숨김 대상이 아닙니다. 오버레이가 등록한 마커·badge footprint는 불변 장애물로 참여합니다.
- 충돌한 라벨은 수직으로만 밀리며(최대 `maxLabelDisplacementPx`, 기본 56 CSS px), 그 안에서 빈 슬롯이 없으면 **우선순위 낮은 라벨만** `visibility: hidden`으로 숨깁니다. 라벨은 모든 오버레이에서 `aria-hidden` 장식이므로 숨김은 접근성 트리·이름·24px target을 바꾸지 않습니다. MapLibre가 `text-allow-overlap`·`symbol-sort-key`로 map-wide symbol collision을 layer 정책에 두는 것과 같은 계층입니다.
- 우선순위는 상태 우선입니다: selected(400) > focused(300) > alarm·invalid·unavailable·conflict(200) > active·current(100) > 기본(0). 동률은 페인트 순서 계약(`docs/ROBOTICS_PATTERNS.md`)을 미러한 kind 가중(region < lane < route < trajectory < waypoint < facility), 그다음 annotation id 사전순으로 갈립니다. 같은 입력은 항상 같은 배치를 냅니다.
- 자연 위치가 비어 있는 라벨은 절대 움직이지 않습니다. 라벨 수직 이동 방향은 오버레이별 행 계약을 보존합니다 — route 진행 라벨은 badge row 아래쪽(`'down'`), route 구간·trajectory 라벨은 위쪽(`'up'`)으로만 밀립니다.
- 측정은 실제 DOM rect와 `getScreenCTM()`을 사용합니다. `viewportScale` prop이 잘못 전달돼도 조정은 정확하며, 적용된 변위는 CTM 선형부로 정확히 복원되므로 측정→조정 사이클은 멱등입니다. SSR에서는 무변위로 렌더되고 하이드레이션 후 보정됩니다.
- 각 라벨 블록은 `data-navigation-annotation="label"`, `data-annotation-kind/id/anchor-x/anchor-y/priority`를 방출하고, 변위 시 `data-annotation-displaced`·`data-annotation-dy`, 숨김 시 `data-annotation-suppressed`를 남깁니다. layer 루트는 label/obstacle/displaced/suppressed 개수를 data 속성으로 보고합니다. 오버레이 고유의 anchor evidence(`data-route-anchor-x` 등)는 그대로 보존됩니다.
- provider가 없으면 참여 코드는 완전한 no-op입니다: 라벨 래퍼 `<g>`는 transform·visibility 없이 렌더되고 장애물 등록은 빈 스프레드가 되어 단독 오버레이 출력은 픽셀 동일합니다.
- component는 live region을 만들지 않습니다. 밀집 지도의 대체 탐색 경로(이름 있는 목록·SelectionInspector)는 `docs/ACCESSIBILITY_CONTRACTS.md`의 기존 계약 그대로 제품이 소유합니다.

## Authoritative external basis

- [MapLibre Style Specification — Layers](https://maplibre.org/maplibre-style-spec/layers/): symbol collision·placement·sort key는 개별 feature가 아니라 전체 feature 집합을 아는 map-wide layer 정책이 결정합니다. 이 component가 그 정책 계층의 LDS reference 구현입니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 라벨 숨김은 장식 텍스트에만 적용되며 24×24 CSS px target과 dense map의 equivalent path(목록 선택)는 오버레이·제품 계약에서 그대로 유지됩니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast): 상태를 식별하는 marker·badge·pattern은 숨김 대상이 아니므로 비텍스트 대비 evidence가 라벨 밀도와 무관하게 보존됩니다.

## Intentional exclusions

- leader line·callout connector (새 지도 심벌 = 별도 적합성 검토 대상; 56px 캡이 앵커 연관성을 유지)
- 수평 변위·side-flip (각 오버레이의 textAnchor·outward-anchor 의미 보존)
- quadtree 등 공간 인덱스 (지도당 라벨 수십 개, O(n²)로 충분), 줌 밀도 LOD 컬링, 숨김 히스테리시스·애니메이션
- 공개 등록 훅·오버레이별 우선순위 prop (구체적 제품 수요 전까지 내부 계약)
- `<svg>` 경계를 넘는 전역 조정, map layer paint order 변경, `Map2DCanvas` 변경

이 항목은 owning renderer·Editor/Product pattern의 책임으로 남습니다.
