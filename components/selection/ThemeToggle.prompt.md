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
