**Map2DCanvas** — 2D 맵(occupancy grid / PGM)용 팬·줌 캔버스 셸. 드래그로 팬, 휠로 줌, 격자 배경 + 줌 컨트롤. 실제 맵 이미지·오버레이·konva 스테이지는 `children`으로 넘기면 함께 변환됩니다.

```jsx
<Map2DCanvas style={{ height: 360 }}>
  <img src="/maps/floor1.png" style={{ display: 'block' }} />
  {/* SVG 오버레이: 로봇 포즈, 경로, 존, 웨이포인트 */}
</Map2DCanvas>
```

- **minZoom / maxZoom** · **grid** · **controls**. 무거운 렌더링은 앱(konva/canvas)에서, 이 컴포넌트는 팬·줌·크롬만 담당.
