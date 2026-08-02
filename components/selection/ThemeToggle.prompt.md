# ThemeToggle

테마를 구동하는 세그먼트형 **Light / Dark / Auto** 스위치. 대상 요소(기본 `<html>`)에
`[data-theme]`를 설정하고 선택을 localStorage에 저장해, 어떤 페이지든 그 자리에서 테마를
바꿀 수 있습니다; `auto`는 OS를 따릅니다.

```jsx
// 페이지 전체를 구동하고 선택을 기억:
<ThemeToggle defaultValue="light" />

// 한 영역만 테마링, 제어형:
<ThemeToggle target="#preview" value={mode} onChange={setMode} showLabels={false} size="sm" />
```

애플리케이션에서 theme·direction·Portal 정책을 함께 구동할 때는 `LdsProvider`를 runtime의 단일 소유자로 두고 `useLdsRuntime()`의 `colorScheme`/`setColorScheme`를 이 control에 연결합니다. 이 경우 `ThemeToggle target={null} persist={false}`로 중복 DOM mutation과 storage write를 막습니다. CSS-only 소비자는 기존처럼 Provider 없이 사용할 수 있습니다.
