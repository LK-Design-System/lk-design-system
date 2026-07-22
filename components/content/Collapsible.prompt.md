**Collapsible** — 단일 디스클로저(굵은 헤더가 본문을 토글).

```jsx
<Collapsible title="상세 사양" defaultOpen>…</Collapsible>
```

- **title / children** — 헤더 + 본문. **defaultOpen**. 디스클로저 목록에는 `Accordion`을 쓰세요.
- 타입 스케일 정합: 트리거 15.5px → `--body2-size`(15px), 본문 14.5px → `--label1-size`(14px)로 스냅했습니다(각 −0.5px, 트리거>본문 위계 유지). 본문 lineHeight 1.7은 그대로입니다.
- 접근성: 트리거는 `aria-expanded`와 함께 `aria-controls`로 본문 패널을 가리킵니다. 접힌 본문은 시각만 숨기지 않고 `inert`로 접근성 트리·탭 포커스 순서에서 제거되므로, 접힌 상태에서 스크린리더가 본문을 낭독하거나 포커스가 진입하지 않습니다. grid-rows 리빌 전환은 유지됩니다.
