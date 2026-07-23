**Collapsible** — 단일 디스클로저(굵은 헤더가 본문을 토글).

```jsx
<Collapsible title="상세 사양" defaultOpen>…</Collapsible>
```

- **title / children** — 헤더 + 본문. **defaultOpen**. 디스클로저 목록에는 `Accordion`을 쓰세요.
- 타입 스케일 정합: 트리거 15.5px → `--body2-size`(15px), 본문 14.5px → `--label1-size`(14px)로 스냅했습니다(각 −0.5px, 트리거>본문 위계 유지). 본문 lineHeight 1.7은 그대로입니다.
- 접근성: 트리거는 `aria-expanded`와 함께 `aria-controls`로 본문 패널을 가리킵니다. 접힌 본문은 시각만 숨기지 않고 `inert`로 접근성 트리·탭 포커스 순서에서 제거되므로, 접힌 상태에서 스크린리더가 본문을 낭독하거나 포커스가 진입하지 않습니다. grid-rows 리빌 전환은 유지됩니다.
- 접근성: 본문 패널은 `role="region"` + `aria-labelledby`(트리거)로 노출됩니다. APG 에서는 선택 사항이지만 `Accordion` 이 이미 같은 계약을 쓰고 있어, 두 디스클로저가 보조 기술에 서로 다르게 들리지 않도록 맞췄습니다. 단, 한 화면에 disclosure 가 아주 많으면 landmark 가 과다해지므로 그때는 `Accordion` 하나로 묶으세요.
