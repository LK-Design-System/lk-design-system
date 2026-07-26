**RangeSlider** — 핸들 사이가 시그널 잉크로 채워지는 두 노브 범위.

```jsx
<RangeSlider label="가격 범위" defaultValue={[20, 80]} showValue onChange={setRange} />
<RangeSlider label="적재량" minLabel="하한" maxLabel="상한" defaultValue={[2, 8]} min={0} max={10} />
<RangeSlider label="가격 범위" defaultValue={[20, 80]} disabled />
```

- **value / defaultValue / onChange** — `[low, high]` 튜플. **min / max / step** — 범위.
- **label / minLabel / maxLabel** — 그룹과 각 노브의 접근 가능한 이름. **disabled** — 형제 `Slider`와 같은 API로 두 노브를 함께 잠급니다.
- 노브는 서로를 넘지 못합니다. 하단 노브는 현재 `high` 값까지만, 상단 노브는 현재 `low` 값까지만 움직입니다.

## 접근성 계약

- **이름은 한국어이며 재정의 가능합니다.** 이전에는 두 노브가 하드코딩된 영문 `aria-label="minimum"` / `"maximum"`을 가졌고 재정의 수단도, 범위 전체의 이름도 없었습니다. 이제 `minLabel`(기본 `최솟값`) / `maxLabel`(기본 `최댓값`)을 쓰고, `label`을 주면 `role="group"`의 이름이 되며 각 노브 이름은 `가격 범위 최솟값`처럼 접두어를 갖습니다.
- **노브는 교차하지 않고 서로에게 막힙니다.** 이전 구현은 값을 사후에 정렬(swap)해서, 사용자가 잡고 있던 노브가 드래그 중에 정체성을 바꾸고 보조기술이 읽는 이름(`최솟값`/`최댓값`)이 실제 조작 대상과 어긋났습니다. 이제 각 노브를 형제 값으로 클램프합니다. 문서의 "핸들은 서로 교차할 수 없습니다"라는 서술과 실제 동작이 이제 일치합니다.
- **겹친 노브도 잡을 수 있습니다.** 두 `input[type=range]`가 겹쳐 있어 뒤에 오는 상단 노브가 항상 포인터를 가져갔습니다. 두 노브가 거의 같은 위치일 때는 아직 움직일 여지가 있는 쪽(트랙 상반부면 하단 노브)을 위로 올립니다.
- **disabled**는 두 native input에 그대로 전달되므로 키보드 포커스와 값 변경이 모두 차단되고, 채움 트랙과 노브 테두리가 비활성 색으로 바뀝니다.
- 근거: [WAI-ARIA APG Slider (Multi-Thumb) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) — 각 노브가 독립적인 이름과 값을 갖고 인접 노브가 범위를 제한합니다. [Material Design — Sliders](https://m3.material.io/components/sliders/guidelines), [Ant Design Slider `range`](https://ant.design/components/slider) — 노브 교차 금지 관례. [WCAG 2.2 4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value).
