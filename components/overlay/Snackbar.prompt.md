**Snackbar** - WDS feedback bar with optional heading, description, icon, action, and close.

```jsx
<Snackbar heading="Saved" action="Undo" />
<Snackbar leadingIcon closeButton description="Changes were saved." />
```

- Use for short feedback with an optional action. Use `Toast` for transient status-only messages.
- WDS axes: `heading`, `description`, `icon`, and `closeButton`. `closeLabel`은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- 타이포 단계: heading은 `body2`, description은 `label2`, 한 줄 메시지는 Toast의 한 줄과 같은 `body2` 단계를 씁니다(size·line·spacing 토큰 3짝).
- 내부 간격: 아이콘-콘텐츠 gap 12px, 콘텐츠-액션 32px(gap 12 + margin 20)은 WDS Snackbar 메트릭입니다. Toast의 gap 10px과 다른 것은 표면별 고유 메트릭이며 통일 대상이 아닙니다.
- 화면 배치: Snackbar 자체는 표면만 담당합니다. 띄울 때는 `ToastStack`으로 감싸 배치하세요(`bottom-center` 권장). 별도의 Snackbar 전용 배치 프리미티브를 만들지 않습니다.
