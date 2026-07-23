**SpecRow** — 제품 스펙 표의 키/값 한 행. 하단 헤어라인, 라벨 34% 컬럼(DescriptionList와 같은 문법), 값은 tabular-nums. 시맨틱 토큰만 사용하므로 라이트 시트에 그대로, 네이비 무대에선 `data-theme="dark"` 래퍼 안에 쌓으세요.

```jsx
// 한 행짜리 — 행 자체가 단일 쌍 dl
<SpecRow label="크기" value="520 × 420 × 490 mm" />

// 여러 행이 한 사양표 — 바깥 dl + grouped
<dl style={{ margin: 0 }}>
  <SpecRow grouped label="크기" value="520 × 420 × 490 mm" />
  <SpecRow grouped label="밀도" value="compact · regular" />
  <SpecRow grouped label="테마" value="light · dark" divider={false} />
</dl>

// 네이비 제품 무대 위:
<div data-theme="dark">
  <SpecRow label="상태" value="active · review · disabled" />
</div>
```

## 계약

- **키/값 시맨틱**: `label`은 `dt`, `value`는 `dd`로 렌더되어 보조기술이 "이름 → 값" 쌍으로 읽습니다(WCAG 1.3.1). 시각 문법(34% 라벨 컬럼)만 DescriptionList와 공유하는 것이 아니라 시맨틱도 같습니다.
- **그룹핑**: 여러 SpecRow가 하나의 사양표를 이루면 바깥에 `<dl style={{ margin: 0 }}>`을 두고 각 행에 `grouped`를 주세요. 그러면 행은 `dl`의 유효한 래퍼(`div`)가 되고 표 전체가 하나의 정의 목록으로 읽힙니다. `grouped` 없이 쌓으면 행마다 별도의 단일 쌍 `dl`이 되며(유효하지만 목록 하나로 묶이지는 않습니다), 한두 행짜리 요약에는 그 편이 간단합니다.
- **divider**: 기본 `true`. 마지막 행에만 `divider={false}`를 주어 목록이 컨테이너 모서리에서 닫히게 하고 헤어라인이 홀로 남지 않게 합니다.
- **labelWidth**: 라벨 컬럼 폭(기본 `"34%"`). 라벨이 길어 두 줄로 접힐 때만 조정하고, 같은 표 안의 행들은 같은 값을 유지해 값 컬럼이 어긋나지 않게 합니다.
- 정렬·필터가 필요한 대규모 데이터는 `Table`, 편집 가능한 값은 Form Field를 쓰세요.
