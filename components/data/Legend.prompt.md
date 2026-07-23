**Legend** — 맵·차트·다이어그램용 색상 키(스와치 + 라벨 + 선택적 값). 새 chart primitive가 아니라 데이터 시각화 컴포넌트 옆에 붙는 설명 패턴입니다.

```jsx
<Legend items={[
  { label: '가용', color: 'var(--color-semantic-status-positive)', shape: 'dot' },
  { label: '검증 경로', color: 'var(--color-semantic-primary-normal)', shape: 'line', dashed: true },
]} />
```

- **items** `{id?,label,color,shape,dashed,value,muted,disabled}[]` · **direction** `horizontal|vertical` · **size** `sm|md` · **emptyLabel**.
- Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state.
- Layer: LDS Product Data extension. Use it with charts, maps, and diagrams; do not claim a standalone WDS chart primitive parity surface.
- shape는 `dot`, `line`, `square`만 사용합니다. line은 차트/경로 stroke를 설명할 때 쓰고, `dashed`는 예측값·검증 전 경로·비활성 레이어처럼 선 스타일 의미가 있을 때만 씁니다.
- `value`는 카운트/비율 같은 보조 수치입니다. horizontal에서는 라벨 옆에, vertical에서는 오른쪽 컬럼에 정렬됩니다.
- `muted`는 낮은 강조, `disabled`는 현재 꺼진 레이어나 표시 불가 상태입니다. 둘 다 label과 swatch를 낮은 대비로 처리하되 의미 색상 자체를 임의 색으로 바꾸지 않습니다.
- 두 상태는 **대비 차이만으로 구분하지 않습니다**(WCAG 1.4.1). `disabled`는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(`표시 꺼짐` / `강조 낮음`)를 붙여 보조기술에도 전달합니다. 상태는 `data-legend-state="disabled|muted"`, 라벨 요소는 `data-legend-label`로 노출됩니다.
- 항목은 `role="listitem"`이므로 `aria-disabled`를 붙이지 않습니다. ARIA 1.2에서 `aria-disabled`는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다.
- DS 관행: semantic color token 또는 시각화 팔레트 token을 넘기고, hardcoded hex는 피합니다. 텍스트는 `label2/caption1`, 값은 tabular nums, focus ring이나 interaction state는 만들지 않습니다.
