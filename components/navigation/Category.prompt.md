**Category** - WDS navigation chip group for separating content by topic.

```jsx
<Category items={['All', 'Open', 'Done']} defaultValue="All" />
<Category variant="alternative" size="large" padding verticalPadding items={items} />
```

- Use for horizontal topic/category navigation. Use `Tabs` for section switching with an underline.
- WDS axes: `variant`, `size`, `padding`, `verticalPadding`, and horizontal `scroll`.
- 타입 스케일 정합: small/sm 칩 12.5px → `--label2-size`(13px)로 스냅했습니다. md(14)/lg(15)와 함께 13/14/15의 깔끔한 사이즈 프로그레션을 이룹니다.
