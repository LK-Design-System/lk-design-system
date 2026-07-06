**Callout** — 톤 아이콘, 낮은 톤 배경, 얇은 전체 테두리로 강조하는 노트 블록(안내, 팁, 상시 공지). `Banner`보다 무겁습니다.

```jsx
<Callout tone="signal" title="설치 전 확인">현장 통신 환경(LTE/5G)을 먼저 점검하세요.</Callout>
```

- **tone** 은 `signal · positive · cautionary · negative · navy`.
- **title / children / icon** 으로 콘텐츠를 구성합니다.
- 페이지 안에서 강조가 필요하지만 액션이 주가 아닌 안내에는 `Callout`을, 시스템 상태와 액션이 중요한 알림에는 `Banner`를 사용하세요.
