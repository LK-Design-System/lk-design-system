**Spacer** — 유연하거나 고정된 공간.

```jsx
<Stack direction="row"><Logo /><Spacer /><Button>문의</Button></Stack>   {/* 양쪽으로 밀어냄 */}
<Spacer size={24} />   {/* 고정 세로 간격 */}
```

- **size** 없음 → 채우도록 늘어남(flex:1). **size** 있음 → **axis**(`vertical · horizontal`)로 고정.
