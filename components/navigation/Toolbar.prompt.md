**Toolbar** — 그룹화된 컨트롤(아이콘 버튼, 토글)을 위한 가로 컨테이너.

```jsx
<Toolbar>
  <IconButton variant="ghost" label="undo"><Icon name="arrow-left" /></IconButton>
  <Divider vertical />
  <ToggleButton icon={<Icon name="location" size={18} />} />
</Toolbar>
```

- 그룹은 `<Divider vertical />`로 구분하세요. 헤어라인 + 부드러운 엘리베이션.
