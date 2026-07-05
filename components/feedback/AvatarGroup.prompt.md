**AvatarGroup** — 화이트 링을 두른 겹친 아바타; `max`를 넘으면 네이비 "+N"으로 접힙니다.

```jsx
<AvatarGroup max={4} items={[
  { name: '김' }, { name: '이' }, { name: '박' }, { name: '최' }, { name: '정' },
]} />
```

- **items** — `{ src, name }`(사진 또는 이니셜). **max** — "+N" 이전 개수. **size** — px 지름.
