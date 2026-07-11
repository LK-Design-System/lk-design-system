**Collapsible** — 단일 디스클로저(굵은 헤더가 본문을 토글).

```jsx
<Collapsible title="상세 사양" defaultOpen>…</Collapsible>
```

- **title / children** — 헤더 + 본문. **defaultOpen**. 디스클로저 목록에는 `Accordion`을 쓰세요.
- 타입 스케일 정합: 트리거 15.5px → `--body2-size`(15px), 본문 14.5px → `--label1-size`(14px)로 스냅했습니다(각 −0.5px, 트리거>본문 위계 유지). 본문 lineHeight 1.7은 그대로입니다.
