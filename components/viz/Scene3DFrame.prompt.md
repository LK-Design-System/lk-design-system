**Scene3DFrame** — 3D 뷰포트(three/fiber) 크롬 셸. 다크 프레임 + 좌상단 HUD(타이틀·배지) + 우상단 툴바 슬롯 + 로딩/빈 상태. 실제 3D 캔버스는 `children`으로.

```jsx
<Scene3DFrame title="POINT CLOUD" badges={<ConnectionBadge status="online" size="sm" />}
  toolbar={<ViewerToolbar orientation="horizontal">…</ViewerToolbar>} style={{ height: 320 }}>
  <Canvas> …three/fiber… </Canvas>
</Scene3DFrame>
```

- **title · badges · toolbar** 슬롯 · **loading** · **empty**. 렌더는 앱, 셸은 DS.
