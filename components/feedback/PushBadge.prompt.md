**PushBadge** — 아이콘/아바타에 붙는 알림 점 / 카운트.

```jsx
<PushBadge count={5}><IconButton variant="ghost" label="alerts"><Icon name="bell" /></IconButton></PushBadge>
<PushBadge dot tone="signal"><Icon name="mail" /></PushBadge>
```

- **count** — 숫자(**max**에서 잘려 "99+"). **dot** — 상태 점만. **tone** `negative · signal · navy`. 화이트 링으로 어떤 서피스에서도 읽힙니다.
