**ViewerToolbar** — 맵/3D 뷰어용 플로팅 툴바(줌·핏·레이어·측정). `ViewerToolbarButton`으로 채우고 뷰포트 모서리에 얹습니다.

```jsx
<ViewerToolbar>
  <ViewerToolbarButton label="확대"><Icon name="plus" size={18} /></ViewerToolbarButton>
  <ViewerToolbarButton label="축소"><Icon name="minus" size={18} /></ViewerToolbarButton>
  <ViewerToolbarButton label="레이어" active><Icon name="filter" size={18} /></ViewerToolbarButton>
</ViewerToolbar>
```

- **orientation** `vertical · horizontal` · 버튼은 **active**로 눌림 표시, **label**로 접근성/툴팁.
