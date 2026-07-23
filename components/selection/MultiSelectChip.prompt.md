**MultiSelectChip** — 여러 패싯 선택용 토글 칩(핵심 기술, 적용 산업). 선택되면 리딩 체크가 슬라이드되며 시안 워시로 채워집니다.

```jsx
<MultiSelectChip defaultSelected>자율주행</MultiSelectChip>
<MultiSelectChip selected={sel} onChange={setSel}>비전 AI</MultiSelectChip>
```

- **selected / defaultSelected / onChange(next)** — 제어/비제어.
- 필 모양, 38px. 선택 가능한 세트는 `flex`/`gap` 랩으로 배치하세요.

## 단일 선택 패싯 가이드 (수정됨)

이전 문서는 "단일 선택 패싯에는 `FilterChip`을 쓰세요"라고 안내했지만, 이는 접근성 계약과 맞지 않아 **가이드 쪽을 수정**했습니다.

- `FilterChip`은 독립적으로 켜고 끄는 **개별 토글 버튼**(`aria-pressed`)입니다. 그룹 컨테이너도, roving tabindex도, `aria-checked`도 없기 때문에 여러 칩을 나란히 놓아도 보조기술에는 "서로 배타적인 하나의 선택 집합"이라는 사실이 전달되지 않습니다. 화면에서는 하나만 채워져 있어도 스크린리더에는 그냥 눌리지 않은 토글 버튼 여러 개로 읽힙니다.
- 대안으로 `FilterChip`에 `radiogroup` 모드를 추가하는 방법도 검토했지만, 그렇게 하려면 (1) 그룹 라벨과 roving tabindex를 소유하는 새 상위 컴포넌트, (2) `aria-pressed`↔`aria-checked` 이중 역할, (3) Arrow 키 계약이 함께 들어와야 합니다. 이는 칩 하나의 수정이 아니라 새 컴포넌트 도입이고, LDS에는 이미 같은 의미를 정확히 표현하는 컴포넌트가 있습니다.
- **결론**: 단일 선택(상호 배타) 패싯에는 `FilterChip`이 아니라 라디오 의미를 갖는 컨트롤을 쓰세요.
  - 옵션이 짧고 카드형 비교가 필요하면 `ChoiceCard`(native radio + `role="radiogroup"` 컨테이너).
  - 목록이 길거나 공간이 좁으면 `Select`(APG select-only combobox).
  - 칩 모양이 꼭 필요하면 `Tabs`처럼 이미 단일 선택 계약을 소유한 컴포넌트를 검토하세요.
- `FilterChip`은 서로 독립적인 on/off 패싯 토글, 그리고 `caret`로 메뉴를 여는 disclosure 용도로만 사용합니다.
