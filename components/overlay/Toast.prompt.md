**Toast** - transient WDS feedback message on a dark surface.

```jsx
<Toast tone="positive">Saved.</Toast>
<Toast tone="cautionary" leadingIcon={false}>Check the required fields.</Toast>
```

- Use for short, temporary feedback. Use `Snackbar` when a heading, description, action, or close affordance is needed.
- WDS axes: `variant/tone` (`normal`, `positive`, `cautionary`, `negative`) and `leadingIcon`. 별칭 `info/success/warning/error`도 정규화되어 동작합니다. `closeLabel`은 닫기 접근성 레이블(기본 "닫기").
- 메시지는 `body2` 3짝(size·line·spacing) 토큰을 씁니다. 아이콘-메시지 gap 10px은 Toast 고유 메트릭으로, Snackbar(12px)와 표면별로 구분됩니다.
- severity 글리프는 공통 `Icon` registry(`statusToneStyle` 매핑)에서 옵니다. 다크 표면 위 아이콘 색만 vivid status 색을 유지합니다.
- 화면 배치는 `ToastStack`(bottom-right 등 5개 position)으로 감쌉니다.
