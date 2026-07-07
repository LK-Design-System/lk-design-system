**CanvasEditorShell** — 맵/지오메트리 에디터 레이아웃 셸. 타이틀 · 좌측 툴 레일(`tools`) · 중앙 캔버스(`children`) · 우측 속성 패널(`panel`) · 하단 상태 바(`status`) 슬롯. 실제 편집 캔버스는 `children`으로.

```jsx
<CanvasEditorShell title="편집기" style={{ height: 420 }}
  tools={<EditorToolbar items={tools} value={tool} onChange={setTool} />}
  panel={<ZoneProperties … />}
  status={<><span>1200 × 800 px</span><HistoryToolbar canUndo … style={{ marginLeft: 'auto' }} /></>}>
  <Map2DCanvas>…</Map2DCanvas>
</CanvasEditorShell>
```

- 슬롯은 모두 선택적 — 넘긴 영역만 렌더. **panelWidth**로 패널 폭 조정.
