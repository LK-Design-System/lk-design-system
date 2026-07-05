**Bookmark** — 저장 토글. 기본은 아웃라인이고, 저장되면 시그널 잉크로 채워지며 살짝 눌리는 효과가 있습니다.

```jsx
<Bookmark defaultActive />
<Bookmark active={saved} onChange={setSaved} size={20} />
```

- **active / defaultActive / onChange(next)** — 제어/비제어. **size** — 글리프 px.
- `ListCell` / `Card`의 트레일링 어포던스로 잘 어울립니다.
