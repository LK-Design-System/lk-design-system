**Sheet** — 네이비 스크림 위로 올라오는 바텀 시트(모바일 액션, 피커).

```jsx
<Sheet open={open} title="정렬" onClose={close}>
  …옵션…
</Sheet>
```

- **open / onClose** — 제어형. **title / children / footer** — 슬롯. **height** — 고정 또는 콘텐츠 크기(≤88vh). 그랩 핸들 포함. 사이드 패널에는 `Drawer`를 쓰세요.
