**Avatar** — 상태 점(옵션)이 있는 둥근 사진; 이니셜은 쿨 그레이 틴트로 폴백.

```jsx
<Avatar src={url} name="Han Kim" size={48} status="online" />
<Avatar name="LK" size={40} />
<Avatar name="LK" size={40} status="busy" pushBadge={3} aria-label="김한" />
<Avatar name="LK" size={40} status="online" statusLabel={false} />
```

- **status 점과 pushBadge는 색만으로 의미를 전달하지 않습니다**([WCAG 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color) / [1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)). 두 표식 모두 텍스트 대체를 갖습니다.
  - **statusLabel** — 기본값 `online` → "온라인", `busy` → "다른 용무 중", `offline` → "오프라인".
  - **pushBadgeLabel** — 기본값 `pushBadge={true}` → "새 알림 있음", 숫자/숫자 문자열 → "읽지 않음 N건".
  - 옆에 같은 의미의 텍스트가 이미 있으면 `statusLabel={false}` / `pushBadgeLabel={false}`로 중복 발화를 끄세요.
- `aria-label`을 주면 Avatar는 `role="img"`가 되고 하위 노드가 노출되지 않으므로, 대체 텍스트가 그 이름 뒤에 합쳐집니다 → `"김한, 다른 용무 중, 읽지 않음 3건"`. 이름이 없으면 visually-hidden 텍스트로 문서 순서에 렌더됩니다. `aria-labelledby`만 준 경우에는 생성된 hidden 노드 id가 `aria-labelledby`에 자동으로 이어붙습니다.
