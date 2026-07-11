**FeatureCard** — 틴트된 아이콘 타일 + 제목 + 설명(기능 셀). `boxed`는 Card 서피스로 감쌉니다.

```jsx
<FeatureCard tone="signal" icon={compassIcon} title="자율주행">사전 지정 경로와 실시간 장애물 회피로 이동합니다.</FeatureCard>
```

- **tone** — `signal`(틸 타일, 기본) · `steel` · `amber` · `navy`.
- 타입 스케일 정합: 제목 19px → `--headline1-size`(18px, −1px 의도된 변경), 본문 15.5px → `--body2-size`(15px)로 스냅했습니다. NewsCard 제목(headline1)과 같은 카드 제목 단계로 정렬합니다.
