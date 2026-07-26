**PushBadge** — 아이콘/아바타에 붙는 알림 점 / 카운트.

```jsx
<PushBadge count={5}><IconButton variant="ghost" label="알림"><Icon name="bell" /></IconButton></PushBadge>
<PushBadge count={7} label="새 메시지 7개"><IconButton variant="ghost" label="메일"><Icon name="mail" /></IconButton></PushBadge>
<PushBadge dot tone="signal"><Icon name="mail" /></PushBadge>
```

- **count** — 숫자(**max**에서 잘려 "99+"). **dot** — 상태 점만. **tone** `negative · signal · navy`. 화이트 링으로 어떤 서피스에서도 읽힙니다.
- 색·숫자 오버레이는 `aria-hidden="true"` 장식입니다. 카운트는 **label**을 통해 보조기술에 전달됩니다.
  - 감싼 컨트롤이 이미 접근 가능한 이름을 가지면(예: `IconButton label="알림"`) 그 이름 뒤에 붙습니다 → **"알림 읽지 않음 7건"**. Material Badge / Atlassian의 규약과 같습니다.
  - 이름이 없는 자식(예: 순수 `<Icon />`)이면 visually-hidden 텍스트로 자식 옆에 렌더됩니다.
  - 기본 **label**: `count` → `"읽지 않음 N건"`(클램프 시 `"읽지 않음 99건 이상"`), `dot`만 있을 때는 전달할 값이 없으므로 침묵합니다.
  - 옆에 이미 같은 정보를 주는 텍스트가 있으면 `label={false}`로 중복 발화를 끄세요.
