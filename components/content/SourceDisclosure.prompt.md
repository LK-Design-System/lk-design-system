**SourceDisclosure**는 source provenance, availability, freshness metadata와 source로 돌아가는 경로만 제공합니다.

```jsx
<SourceDisclosure
  sources={[
    {
      id: 'ops-log',
      label: 'OPS / robot-07 inspection log',
      kind: 'log',
      availability: 'available',
      observedAt: '2026-07-10 09:14',
      excerpt: 'thermal sensor response timeout',
    },
  ]}
/>
```

- source 조회, permission, freshness 계산, excerpt 생성은 제품이 소유합니다.
- LDS는 `availability`를 URL이나 timestamp에서 추론하지 않습니다.
- Markdown, diagram, image, diff 같은 renderer는 이 컴포넌트 밖에 둡니다.
- source action은 LDS `TextButton`을 native anchor 또는 `onSourceActivate`로 연결합니다. underline action chrome을 다시 만들지 않습니다.
- 여러 source는 card를 반복하지 않고 하나의 bordered divider list로 묶습니다. 각 행의 native `details`가 필요한 provenance만 펼칩니다.
