**VideoStreamTile** — 라이브 영상 스트림(RTSP/WebRTC) 셸: 코너 라벨 칩(RGB/IR/EO) · 로딩/연결끊김 오버레이. 실제 iframe/video는 children으로 주입 — Scene3DFrame·Map2DCanvas와 같은 경계 계약. `lkrobotics-control-full` 감사에서 화면 3곳이 중복 구현하던 패턴을 흡수한 컴포넌트.

```jsx
<VideoStreamTile label="RGB" status="live">
  <iframe src={rtspUrl} style={{ width: '100%', height: '100%', border: 0 }} />
</VideoStreamTile>
<VideoStreamTile label="IR" status="disconnected" />
<VideoStreamTile label="EO-1" status="loading" aspectRatio="4 / 3" />
```

- **status="loading"/"disconnected"**면 children 위에 반투명 오버레이가 덮임. **aspectRatio**로 비율 조정(기본 16:9) — RGB/IR/EO를 나란히 그리드로 배치할 때 유용. 스트림 연결·재생 로직은 앱의 몫.
