**Callout** — 톤 아이콘, 낮은 톤 배경, 얇은 전체 테두리로 강조하는 노트 블록(안내, 팁, 상시 공지). `Banner`보다 무겁습니다.

```jsx
<Callout tone="signal" title="설치 전 확인">현장 통신 환경(LTE/5G)을 먼저 점검하세요.</Callout>
```

- **tone** 은 `signal · positive · cautionary · negative · navy`.
- **title / children** 으로 콘텐츠를 구성하며, tone에 맞는 아이콘이 항상 표시됩니다.
- **icon** 은 tone별 기본 아이콘을 다른 아이콘으로 교체할 때만 사용합니다. 생략하거나 `null`을 전달해도 기본 아이콘은 제거되지 않습니다.
- 표면은 tone의 semantic color를 섞은 충분히 구분되는 tint와 같은 계열의 1px hairline을 사용합니다. 그림자나 별도의 왼쪽 강조선은 추가하지 않습니다.
- 상태색은 `--color-semantic-status-*` 계층을 사용하며 `--bw-amber` 같은 primitive를 직접 사용하지 않습니다.
- 페이지 안에서 강조가 필요하지만 액션이 주가 아닌 안내에는 `Callout`을, 시스템 상태와 액션이 중요한 알림에는 `Banner`를 사용하세요.
