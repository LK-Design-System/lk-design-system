# MissingValue

**MissingValue**는 값이 없는 자리를 표시한다. 보이는 자리에는 em dash를 그리고 보조기술에는 "값 없음"을 읽어 준다. 결측은 빈 문자열, 숫자 `0`, loading, error와 다른 데이터이므로 같은 표시로 합치지 않는다.

## 선택 기준

| 상황 | 선택 | 이유 |
| --- | --- | --- |
| 행은 있는데 이 셀·항목의 값만 없음 | `MissingValue` | 값이 없다는 사실 자체가 데이터다 |
| 목록에 행이 하나도 없음 | `EmptyState` | 표를 대신하는 화면 상태다 |
| 아직 불러오는 중이거나 실패함 | `ResourceState` | 결측이 아니라 자원의 상태다 |
| 값이 `0`이거나 빈 문자열임 | 그 값을 그대로 표시 | 결측으로 위장하지 않는다 |

- 셀 단위 표시다. 표·항목값 목록·상세 필드처럼 값 하나가 들어갈 자리에만 쓴다.
- `label`은 `"값 없음"`(기본)과 `"해당 없음"` 두 가지만 사용한다. 값이 없는 *이유*를 문구로 설명하려면 셀이 아니라 그 자리에 맞는 상태 컴포넌트를 쓴다.
- 글리프를 직접 적지 않는다. `—`를 문자열로 넣으면 보조기술에서 문장부호로 읽히거나 건너뛰어져 "값이 없다"는 사실이 전달되지 않는다.

## 사용 예

```jsx
<MissingValue />
<MissingValue label="해당 없음" />
```

표의 column render에서:

```jsx
<Table
  columns={[{ key: 'owner', header: '담당', render: (row) => row.owner ?? <MissingValue /> }]}
  rows={rows}
  tableLabel="장치"
/>
```

- **label**: 보조기술 문구 (기본 `"값 없음"`)

## 접근성

- 글리프는 `aria-hidden`이고 문구는 `VisuallyHidden`으로 전달한다. 화면 낭독기마다 빈 셀과 대시를 읽는 방식이 다르므로, 무엇이 읽힐지를 글리프에 맡기지 않고 문구로 고정한다.
- 색은 `--color-semantic-label-alternative`다. 값보다 조용하되 AA(4.5:1)를 충족하는 label 계열이며, `label-assistive`·`label-disable`은 AA 미달이라 쓰지 않는다.
- 표 안에서는 머리행 연결이 유지되어야 이 문구가 "어떤 항목의 값이 없는지"로 읽힌다. 셀 자체를 비우지 않는 것이 그 전제다.
- 320px 같은 좁은 폭에서도 한 글자라 줄바꿈 대상이 아니다. 인접 값과 붙어 보이지 않도록 셀 padding은 호출부 표가 소유한다.

## 분류와 제품 워크플로 커버리지

- 분류: LDS Core의 콘텐츠 텍스트 프리미티브. WDS 원본의 직접 핀이 아니라 LK 고유 계약이다.
- Web Viz: 해당 없음 — 고정 source에 값-단위 결측을 표시하는 표·항목값 표면이 없다.
- Control Full Daedeok: 해당 없음 — 같은 이유이며, 제어 액션이나 안전 상태를 소유하지 않는다.
- LK Portal: `gap` — 같은 규약을 제품이 27개 파일에서 직접 구현하고 있다. 규약은 LDS가 정의하고 수단은 제품에 맡긴 상태였다.

## 공식 참고 자료

- [Adobe Spectrum — Table](https://spectrum.adobe.com/page/table/): "When there are gaps in the data, use an en dash (–) to represent null or not applicable (N/A) values." 결측을 빈 칸이 아니라 글리프로 표시한다는 근거다. **의도적 차이** — Spectrum은 en dash(–)를, LDS는 em dash(—)를 쓴다. LDS 규약이 `AI_DESIGN_SYSTEM_GUIDE.md`와 표·DataGrid 가이드 세 곳에서 이미 `—`로 고정돼 있고 글리프 폭 차이가 의미를 바꾸지 않으므로 기존 표기를 유지한다.
- [WebAIM — Creating Accessible Tables: Data Tables](https://webaim.org/techniques/tables/data): 화면 낭독기는 머리행과 셀 내용을 이어서 읽는다. 셀에 무엇이 들어 있느냐가 곧 announce되는 내용이므로, 시각 글리프만으로는 "값 없음"이 전달된다고 보장할 수 없다. 이 컴포넌트가 글리프와 문구를 분리하는 근거다.
- [Carbon Design System — Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/): 표의 empty state는 표와 머리행·꼬리행을 **대신한다**. 즉 "행이 없음"은 표면 상태이고 "이 값이 없음"은 셀 데이터로, 서로 다른 계층이다. 위 선택 기준 표가 이 구분을 따른다.
- 한계: 결측 셀의 낭독 동작을 정면으로 규정한 표준 문서(W3C WAI Tables Tutorial 포함)는 찾지 못했다. WAI 자료는 머리행–셀 연결만 다룬다. 따라서 글리프와 문구를 분리한 선택은 표준의 인용이 아니라 위 근거에서 도출한 LDS 결정으로 기록한다.
