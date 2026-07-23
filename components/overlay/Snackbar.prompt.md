**Snackbar** - WDS feedback bar with optional heading, description, icon, action, and close.

```jsx
<Snackbar heading="Saved" action="Undo" onAction={undo} />
<Snackbar leadingIcon description="Changes were saved." onClose={dismiss} />
<Snackbar tone="negative" leadingIcon description="네트워크 연결이 불안정합니다." action="다시 시도" onAction={retry} />
```

- Use for short feedback with an optional action. Use `Toast` for transient status-only messages.
- WDS axes: `heading`, `description`, `icon`, `tone`, and `closeButton`. `closeLabel`은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- **tone / variant (severity 축)** — `normal · positive · cautionary · negative`(별칭 `info/success/warning/error`).
  Toast와 이름·정규화·announce 규칙이 같습니다: `negative`만 `role="alert"` + `aria-live="assertive"`,
  나머지는 `role="status"` + `aria-live="polite"`. 재시도 같은 오류 복구 메시지가 정중하게 흘러가
  묻히지 않도록 하는 것이 이 축의 목적입니다. `leadingIcon`을 켜면 tone에 맞는 registry glyph가
  자동으로 선택되고(`icon`으로 대체 가능), 다크 표면 위에서 vivid status 색만 유지합니다.
- **closeButton은 `onClose`가 있을 때만 닫기 버튼을 렌더링합니다.** 핸들러 없이 닫기 아이콘만 두면
  눌러도 아무 일도 없는 죽은 컨트롤이 되므로, 축은 "노출 여부"만 결정하고 실제 존재 조건은 `onClose`
  입니다. `closeButton={false}`로 명시적으로 감출 수 있습니다.
- `action`도 같은 규칙을 따르세요: `action` 문구를 주면 반드시 `onAction`(또는 자체 `onClick`을 가진
  노드)을 함께 제공합니다.
- 타이포 단계: heading은 `body2`, description은 `label2`, 한 줄 메시지는 Toast의 한 줄과 같은 `body2` 단계를 씁니다(size·line·spacing 토큰 3짝).
- 내부 간격: 아이콘-콘텐츠 gap 12px, 콘텐츠-액션 32px(gap 12 + margin 20)은 WDS Snackbar 메트릭입니다. Toast의 gap 10px과 다른 것은 표면별 고유 메트릭이며 통일 대상이 아닙니다.
- 화면 배치: Snackbar 자체는 표면만 담당합니다. 띄울 때는 `ToastStack`으로 감싸 배치하세요(`bottom-center` 권장). 별도의 Snackbar 전용 배치 프리미티브를 만들지 않습니다.
