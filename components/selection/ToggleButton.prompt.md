**ToggleButton** — "켜짐" 상태를 유지하는 상태 버튼. 아이콘 및/또는 라벨; 눌림 = 시안 워시 + 시그널 잉크, 기본 = 헤어라인. 지도 레이어, 뷰 옵션, 북마크형 토글에 씁니다.

```jsx
<ToggleButton icon={<Icon name="location" size={18} />} onChange={setRoute}>경로 표시</ToggleButton>
<ToggleButton defaultPressed icon={<Icon name="star" size={18} />} />   {/* 아이콘 전용 정사각 */}
```

- **pressed / defaultPressed / onChange(next)** — 제어/비제어. **icon**은 리딩으로 렌더; `children`을 생략하면 정사각 아이콘 전용 토글.
- **size** `sm|md`. 슬라이드 on/off는 `Switch`, 일회성 액션은 `Button`/`IconButton`을 쓰세요.
