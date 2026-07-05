**TopBar** — 상단 앱 바: 좌측 브랜드 슬롯, 가운데 내비(children), 우측 액션 슬롯. 헤어라인 베이스; `sticky`는 프로스티드 블러로 고정, `dark`는 네이비 마스트헤드.

```jsx
<TopBar brand={<Lockup variant="inline" height={22} />} actions={<Button size="sm">도입 문의</Button>}>
  <Link href="/products">제품</Link>
  <Link href="/company">회사</Link>
</TopBar>
<TopBar dark sticky brand={<Lockup variant="inline" tone="white" height={22} />} />
```

- 내비는 `Link`/`TextButton`/`Tabs`로, 액션은 `Button`/`IconButton`/`Avatar`로 구성. **height** 기본 64px. **bordered={false}**로 하단 헤어라인 제거.
