# SpatialRegion

`SpatialRegion`은 **LK Robotics Extension**입니다. 행동 규칙, 설비 범위, 지형 통행성을 같은 `zone` 색상 variant로 뭉치지 않고 직렬화 가능한 세 의미군으로 구분합니다. 독립 `<svg>`를 만들지 않는 reference fragment이므로 제품 renderer가 소유한 SVG 또는 `Map2DCanvas`의 transformed content 안에 배치합니다.

```jsx
<svg viewBox="0 0 480 320">
  <SpatialRegion
    region={{
      id: 'slope-a',
      mapId: 'warehouse-1f',
      label: '동측 램프',
      category: 'terrain',
      kind: 'slope',
      traversability: 'restricted',
      grade: { value: 8, unit: 'percent', directionRad: 1.57 },
      shape: { kind: 'polygon', points: [{ x: 40, y: 80 }, { x: 220, y: 80 }, { x: 210, y: 160 }] },
    }}
    onActivate={(id) => inspectRegion(id)}
  />
</svg>
```

## Contract

- `region`은 renderer 명령, React node, 색상 값이 없는 직렬화 가능한 데이터입니다. `category="behavior" | "facility" | "terrain"`과 각 category의 세부 discriminant를 함께 전달합니다.
- behavior는 `rule.kind`로 `keep-out`, `speed-limit`, `preferred`, `operation-area`, `custom`을 구분합니다. 속도 제한은 SI 기준의 `speedLimitMps`, 작업 구역은 선택적 `operation`, custom은 명시적 `label`만 갖습니다.
- facility `kind`는 `lift-cabin`, `lift-lobby`, `door-area`, `dock-area`, `charger-area`, `custom`; terrain `kind`는 `slope`, `rough`, `clearance`, `custom`입니다. shape의 `kind`는 polygon 또는 circle입니다.
- region은 하나의 `mapId`에만 속합니다. active map 필터는 renderer/adapter가 맡고, `SpatialRegion`은 전달받은 region을 그립니다. `hidden`만 DOM과 접근성 트리에서 명시적으로 제거합니다.
- terrain의 `traversability`는 `allowed | restricted | blocked | unknown`이며 선택적입니다. grade도 선택적 `{ value, unit: 'percent' | 'degree', directionRad? }`이고, polygon geometry나 warning tone에서 grade·방향·통행성을 추론하지 않습니다.
- category별 diagonal/grid/contour pattern과 읽을 수 있는 라벨을 항상 함께 제공해 색만으로 의미를 전달하지 않습니다. 지도 안의 시각 라벨은 충돌을 줄이기 위해 짧은 `region.label`만 표시하고, category·규칙·통행성·측정값을 합친 전체 이름은 접근성 이름과 semantic mirror/inspector에 남깁니다. category 자체를 성공/경고 상태로 취급하지 않습니다. 실제 keep-out/blocked는 negative, speed-limit/restricted는 cautionary, unknown은 점선으로 표시하며 facility와 allowed terrain은 viewer의 중립 foreground를 사용합니다.
- 모든 외곽선과 pattern 선은 `vector-effect="non-scaling-stroke"`입니다. 라벨은 `viewportScale`의 역수를 적용해 지도 확대와 무관하게 읽히는 크기를 유지합니다.
- `onActivate`가 있으면 pointer, Enter, Space로 같은 `onActivate(id, event)`를 호출합니다. 이것은 선택/검사 callback이며 경로 계획이나 설비 명령을 실행하지 않습니다. interactive region의 `disabled`는 입력을 막고 `aria-disabled`를 노출하며 소비자가 넘긴 `tabIndex`도 `-1`로 덮어씁니다. passive region에는 불필요한 disabled ARIA를 붙이지 않습니다.
- native `aria-label`은 자동 생성된 category·측정·통행성 이름을 덮어쓸 수 있습니다. SVG 정보가 유일한 탐색 수단이 되지 않도록 제품은 같은 identity/state를 가진 semantic mirror 목록도 제공합니다.

## Internal LDS inspection and visual-delta inventory

- `Map2DCanvas`는 viewport, pan/zoom, appearance와 renderer slot을 소유합니다. `SpatialRegion`은 그 경계를 유지하기 위해 `<g>` 조각만 반환하고 독립 frame, toolbar, grid를 추가하지 않습니다.
- `ViewerFrame`의 `--viewer-surface`, `--viewer-foreground`, `--viewer-muted`, `--viewer-border`와 공용 semantic status/focus token만 사용합니다. light/dark용 별도 palette를 만들지 않습니다.
- `DirectionalPad`에서 pointer와 keyboard activation, handler 부재/disabled 차단 방식을 비교했습니다. region은 momentary control chrome을 복제하지 않고 SVG feature에 동일한 입력 원칙만 적용합니다.
- `EquipmentStatusCard`의 상태 텍스트 우선순위를 확인했지만 region은 카드가 아닙니다. radius, shadow, icon tile, trailing status 영역을 추가하지 않고 geometry → pattern → label → selection/focus 순서만 유지합니다.
- 유지한 시각 차이: category별 pattern은 공간 규칙을 색과 독립적으로 구분하기 위한 기능 차이이고, selection/focus 외곽선은 조작 상태를 보여주기 위한 접근성 차이입니다. 그 외 control size, card border, shadow, 별도 icon language는 도입하지 않았습니다.

## Authoritative external basis

- [Nav2 Navigation Concepts](https://docs.nav2.org/concepts/index.html): keep-out, speed restriction, preferred lane은 서로 다른 공간 행동이고 gradient map은 surface gradient와 traversability를 나타냅니다. 따라서 behavior와 terrain을 하나의 warning zone으로 합치지 않았습니다.
- [Nav2 Vector Objects](https://docs.nav2.org/tutorials/docs/navigation2_with_vector_objects.html): vector object server는 circle과 polygon을 제공하며 keep-out 외 speed restriction, binary behavior, custom polygon application에도 쓰입니다. public shape를 circle/polygon으로 두되 backend service나 costmap 명령은 포함하지 않았습니다.
- [Open-RMF Graph.hpp, pinned `39f09e7`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): lift는 session begin, move, door open, session end가 결합된 lane event이고 dock도 별도 event입니다. lift cabin/lobby와 transition을 같은 region kind로 축약하지 않고 `FacilityTransition`과 분리했습니다.

## Intentional exclusions

- 지도 투영, 좌표 변환, polygon 편집, costmap 적용, speed command, keep-out enforcement, 충돌 판정은 제품/renderer 책임입니다.
- custom metadata가 임의 색상이나 pattern을 생성하지 않습니다. behavior custom은 명시적 `rule.label`, 나머지 custom은 기존 category label/pattern을 사용합니다.
- WDS `.fig` component-set 근거가 없는 Robotics 확장이므로 LDS Core 또는 WDS parity로 표현하지 않습니다.
