**AutoComplete** — 필터링된 제안 목록이 있는 텍스트 입력.

```jsx
<AutoComplete options={['LKR-CP','LKR-T1','LKR-VisionX','LKR-SSAI','LKR-S1']}
  placeholder="모델 검색" onSelect={setModel} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — 텍스트 상태. **onSelect(value)** — 선택된 행. 입력하면 대소문자 구분 없이 필터링됩니다.
- 타입 스케일 정합: 옵션 행 14.5px → `--body2-size`(15px)로 스냅했습니다. 입력 텍스트와 옵션 텍스트가 같은 스케일 단계에 정렬됩니다.
