**AvatarGroup** — 화이트 링을 두른 겹친 아바타. WDS Avatar Group은 `trailingContent`를 사용하고, 기존 LDS overflow `+N`은 `trailingContent`가 없을 때의 호환 동작입니다.

```jsx
<AvatarGroup max={4} items={[
  { name: '김' }, { name: '이' }, { name: '박' }, { name: '최' }, { name: '정' },
]} />
<AvatarGroup max={4} trailingContent trailingLabel="외 0명" items={[
  { name: '김' }, { name: '이' }, { name: '박' }, { name: '최' },
]} />
```

- **items** — `{ src, name, variant, placeholder }`(사진, 이니셜, WDS placeholder). **max** — 표시 개수. **size** — px 지름 또는 WDS group size. **trailingContent** — WDS trailing slot.
