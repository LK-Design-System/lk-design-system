**SourceTag** — 출처 인용 칩: 모노 키커(기본 "SOURCE") + 헤어라인 구분선 + 출처 이름 + (링크면) ↗. 스펙·데이터셋·보도·리서치의 출처를 밝힐 때.

```jsx
<SourceTag href="#">Design System</SourceTag>
<SourceTag label="DATA" tone="onDark">검증 자료</SourceTag>
```

- **href**가 있으면 링크로 렌더(새 탭, 호버 시 ↗ 진하게). **tone="onDark"**로 네이비 서피스에 올릴 때. **label**로 키커 텍스트 변경("SOURCE" · "DATA" 등).
- 타입 스케일 정합: 출처 이름 12.5px → `--caption1-size`(12px, −0.5px), 모노 키커 10.5px → `--caption2-size`(11px, +0.5px)로 스냅했습니다 — 키커<이름 위계는 유지됩니다. 키커의 모노 폰트·fontWeight 700·letterSpacing 1은 그대로입니다.
