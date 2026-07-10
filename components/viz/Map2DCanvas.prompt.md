**Map2DCanvas** — 2D 맵(occupancy grid / PGM)용 팬·줌 캔버스 셸. 드래그로 팬, 휠/키보드로 줌, 격자 배경 + 줌 컨트롤. 실제 맵 이미지·오버레이·konva 스테이지는 `children`으로 넘기면 함께 변환됩니다.

```jsx
<Map2DCanvas style={{ height: 360 }} panEnabled={tool === 'pan'} status="x 12.4 · y -3.8 · 125%">
  <img src="/maps/floor1.png" style={{ display: 'block' }} />
  {/* SVG 오버레이: 로봇 포즈, 경로, 존, 웨이포인트 */}
</Map2DCanvas>
```

- **minZoom / maxZoom** · **grid** · **controls** · **panEnabled** · **keyboard** · **viewport/defaultViewport/onViewportChange** · **overlay/status**.
- 선택/드로잉 툴에서는 `panEnabled={false}`로 두어 앱 캔버스 포인터 이벤트와 충돌하지 않게 한다.
- 무거운 렌더링은 앱(konva/canvas)에서, 이 컴포넌트는 팬·줌·크롬만 담당.
