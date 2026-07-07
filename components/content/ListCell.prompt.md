**ListCell** — WDS List Cell. 선택 가능한 목록 행, 설정 행, 리소스 행의 기본 단위입니다.

```jsx
<ListCell leading={<Icon name="document" />} title="문서 제목" description="설명" trailing={<ContentBadge>검토</ContentBadge>} divider />
<ListCell title="선택 항목" selected chevron onClick={open} />
<ListCell title="긴 텍스트" textEllipsis={false} verticalAlign="top" />
```

- WDS axes: **verticalPadding** `none · small · medium · large · custom`, **verticalAlign** `top · center`, **fillWidth**, **textEllipsis**, **divider**, **chevron**, **selected**, **disabled**, **interaction** `normal · hovered · focused · pressed`.
- Slot aliases are supported: `leadingContent`/`trailingContent` map to `leading`/`trailing`; `disable` maps to `disabled`.
- Use `onClick` for keyboard-operable interactive rows. Use `interaction` only to render fixed visual states in Storybook or tests.
