**Bookmark** — 저장 토글. 기본은 아웃라인이고, 저장되면 시그널 잉크로 채워지며 살짝 눌리는 효과가 있습니다.

```jsx
<Bookmark label="야간 순찰 경로" defaultActive />
<Bookmark label="점검 보고서" active={saved} onChange={setSaved} size={20} />
```

- **active / defaultActive / onChange(next)** — 제어/비제어. **size** — 글리프 px. **disabled** — 비활성.
- **label** — 저장 대상의 이름. 접근 이름은 `"{label} 북마크"`가 되고, 지정하지 않으면 `북마크`입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. `aria-label`을 직접 주면 그 값이 우선합니다.
- `ListCell` / `Card`의 트레일링 어포던스로 잘 어울립니다.

## 토글 계약

- APG toggle button입니다. **이름은 상태에 따라 바뀌지 않고**(`저장`↔`저장 해제`로 스왑하지 않음), 저장 여부는 `aria-pressed`만 전달합니다. 아이콘은 `aria-hidden`이라 채움은 시각 신호로만 쓰입니다.
- 기본 이름은 한국어입니다. 영어 소문자 `"bookmark"`처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다.
- 눌림 축소(scale 0.86)는 React 상태이며 포인터와 **Enter/Space에 동일하게** 적용됩니다(현재 값은 `data-pressed`). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠지지 않습니다.
