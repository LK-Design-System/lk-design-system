**Category** - WDS navigation chip group for separating content by topic.

```jsx
<Category items={['All', 'Open', 'Done']} defaultValue="All" />
<Category variant="alternative" size="large" padding verticalPadding items={items} />
```

- Use for horizontal topic/category navigation. Use `Tabs` for section switching with an underline.
- WDS axes: `variant`, `size`, `padding`, `verticalPadding`, and horizontal `scroll`.
- 단일 선택 라디오그룹 시맨틱: 컨테이너는 `role="radiogroup"`(`ariaLabel`, 기본값 `카테고리`), 칩은 `role="radio"` + `aria-checked`입니다. 선택된 칩(없으면 첫 활성 칩)만 Tab 스톱이 되고, Arrow Left/Right·Up/Down은 포커스 이동과 동시에 선택하며(APG 라디오 동작), Home/End는 첫·마지막 활성 칩으로 이동합니다. 비활성 칩은 건너뜁니다.
- `item.active`는 비제어 모드의 초기 선택 시드로만 사용됩니다. 렌더 시점에 선택을 강제하지 않으므로 두 칩이 동시에 `aria-checked`가 되는 일이 없습니다.
- 타입 스케일 정합: small/sm 칩 12.5px → `--label2-size`(13px)로 스냅했습니다. md(14)/lg(15)와 함께 13/14/15의 깔끔한 사이즈 프로그레션을 이룹니다.
