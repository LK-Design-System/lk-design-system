**Drawer** — 네이비 스크림 위로 슬라이드되는 사이드 패널(필터, 상세, 설정).

```jsx
<Drawer open={open} side="right" title="필터" onClose={close}
  footer={<Button variant="signal" full>적용</Button>}>
  …필터 옵션…
</Drawer>
```

- **open / onClose** — 제어형(Esc·스크림으로 닫힘). **side** `left · right`. **width** px. **title / children / footer** — 슬롯. 바텀 시트에는 `Sheet`를 쓰세요.
