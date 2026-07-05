**Popover** — 임의의 콘텐츠(정보, 미니 폼, 피커)를 담는 앵커드 플로팅 패널.

```jsx
<Popover trigger={<Button variant="ghost">옵션</Button>} width={280}>
  <FormField label="반경"><Slider defaultValue={30} /></FormField>
</Popover>
```

- **trigger** — 토글 요소. **children** — 패널 본문. **align** `left · right`. **width** px. 단순 메뉴에는 `DropdownMenu`, 호버 힌트에는 `Tooltip`을 쓰세요.
