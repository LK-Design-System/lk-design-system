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
- `aria-label`(또는 `aria-labelledby`)로 그룹 요약 이름을 주면 루트가 `role="group"`이 되어 그 이름이 보조기술에 노출됩니다. 이름이 없으면 role을 붙이지 않아 빈 컨테이너가 발화되지 않습니다. `role` prop으로 직접 덮어쓸 수 있습니다(예: `role="list"` 조합).
- `+N` 오버플로 카운터는 시각적으로 남은 인원을 알려 주며, 정확한 인원 요약이 필요하면 `trailingContent`/`trailingLabel`이나 그룹 `aria-label`에 함께 적으세요.
