**ListCell** — WDS List Cell. 선택 가능한 목록 행, 설정 행, 리소스 행의 기본 단위입니다.

```jsx
<ListCell leading={<Icon name="document" />} title="문서 제목" description="설명" trailing={<ContentBadge>검토</ContentBadge>} divider />
<ListCell title="선택 항목" selected chevron onClick={open} />
<ListCell title="긴 텍스트" textEllipsis={false} verticalAlign="top" />
```

- WDS axes: **verticalPadding** `none · small · medium · large · custom`, **verticalAlign** `top · center`, **fillWidth**, **textEllipsis**, **divider**, **chevron**, **selected**, **disabled**, **interaction** `normal · hovered · focused · pressed`.
- Slot aliases are supported: `leadingContent`/`trailingContent` map to `leading`/`trailing`; `disable` maps to `disabled`.
- `selectedPresentation`은 LDS 확장 축이다. 기본 `accent-check`는 WDS 선택 패턴(액센트 제목 + trailing 체크)으로 "여럿 중 하나 고름"을 말한다. `tint`는 체크·액센트 없이 중립 fill(`--color-semantic-fill-normal`)만 지속시켜 대화 목록·내비게이션처럼 "지금 열려 있는 항목"을 말한다 — 매 행이 여전히 평범한 목적지인 목록에서 체크는 선택 과업으로 오독된다(ChatGPT·Claude 대화 목록 관례). pressed fill은 tint보다 진하고 hover fill은 tint보다 옅어 상태 구분이 유지된다.
- Use `onClick` for keyboard-operable interactive rows. Use `interaction` only to render fixed visual states in Storybook or tests.

## 목록 시맨틱

반복되는 행은 반드시 리스트로 감싸세요. 감싸지 않으면 스크린리더가 "3개 중 2번째"를 읽지 못해 항목 수와 현재 위치가 사라집니다(WCAG 1.3.1).

```jsx
<ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
  <li><ListCell title="디자인 토큰" onClick={open} divider /></li>
  <li><ListCell title="컴포넌트 문서" onClick={open} /></li>
</ul>
```

- 래퍼는 `li`, 인터랙티브 요소는 `ListCell` 루트로 **분리**합니다. `ListCell` 자체를 `li` 로 만들면 `onClick` 이 있을 때 루트가 `role="button"` 이 되어 `listitem` 의미가 사라집니다.
- `list-style: none` 을 주면 일부 브라우저가 리스트 의미를 제거하므로 `role="list"` 를 함께 붙입니다.
- 포커스 링은 `:focus-visible` 일 때만 나타납니다(Material/Fluent 관례). 마우스로 눌렀을 때 링이 남지 않고, 키보드 이동에서는 항상 보입니다. `interaction="focused"` 는 스토리·테스트용 고정 시각 상태이므로 이 규칙과 무관하게 링을 강제합니다.
