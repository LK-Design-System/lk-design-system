**LogViewer** — 레벨 색상 로그·콘솔 스트림(필터 + tail 자동 스크롤). `Code`의 정적 코드 블록 보완재인 Content component입니다.

```jsx
<LogViewer lines={[{ time: '10:42', level: 'error', source: 'nav', text: '...' }]} />
<LogViewer lines={lines} aria-label="주행 로그" announceNewLines={false} />
```

- **lines** `{time,level,source,text}[]` (level `debug·info·warn·error`) · **filter/search/tools/copyable** · **autoScroll** · **height** · **density** `compact|comfortable` · **wrap** · **virtualized/overscan** · **initialQuery** · **onClear/onCopyLine**.
- Long-running streams can expose **streamStatus**, **lastUpdatedAt**, **droppedCount**, and **onExport**. These are presentational health/freshness signals; the app still owns reconnection, buffering, retention, and file generation.
- Compare against common log viewer expectations before changing it: level filters, search, tail pause/resume, latest jump, clear visible logs, per-line copy, empty/search-empty states, fixed-height scrolling, and large-list rendering.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Log Viewer component set; align it with content/code/list conventions without claiming WDS variant parity.
- Keep it as a presentational stream viewer. Do not open ROS/websocket connections, own log retention policy, or implement command execution here; feed lines and handlers from the product shell.

## 접근성 계약

- **뷰포트는 읽을 수 있어야 합니다.** 스크롤 영역은 이름 있는 `role="log"` 영역이며 `tabIndex=0`이라 Tab으로 진입해 화살표·PageUp/PageDown·Home/End로 로그를 읽을 수 있습니다(WCAG 2.1.1). `copyable={false}`여도 포커스 가능한 대상이 사라지지 않습니다. 이름은 `aria-label`로 바꿉니다(기본 `"로그 스트림"`).
- **정지 시 조용, 팔로우 중일 때만 알림** — 터미널류 관행입니다. 뷰포트 자체는 live region이 아닙니다(`aria-live="off"`): 가상화가 스크롤마다 행을 삽입·제거하므로 뷰포트를 live로 두면 화면에 들어온 모든 로그가 낭독됩니다. 대신 상시 마운트된 별도 polite status region이 **tail을 따라가는 동안 도착한 새 로그만** 요약 공지합니다(1줄이면 그 줄, 여러 줄이면 "새 로그 N줄, 마지막 …"). 일시정지했거나 위로 스크롤해 두면 공지하지 않고, 밀린 양은 "최신 로그로 이동" 버튼의 이름과 +N 배지로 전달합니다. **announceNewLines**로 이 공지를 끌 수 있습니다.
- 라인 복사 성공·실패도 같은 status region에 텍스트로 공지합니다(아이콘 교체만으로 끝내지 않습니다).
- 스트림 상태 변화(`streamStatus`)도 같은 상시 region이 "스트림 상태: {라벨}"로 공지합니다.
  보이는 메타 행은 표현 전용입니다 — 행이 상태와 함께 삽입되는 첫 전환을 live region으로는
  놓치기 때문입니다.
- 가상화로 포커스를 잃지 않습니다 — 포커스가 있던 복사 버튼의 행이 뷰포트를 벗어나 DOM에서 제거되면 포커스를 `<body>`가 아니라 로그 영역으로 되돌립니다.
- 레벨은 색상 단독이 아니라 `DEBUG`/`INFO`/`WARN`/`ERROR` 텍스트로도 구분되고, 필터 칩은 `aria-pressed`, 도구 그룹과 검색 입력은 각각 이름을 가집니다.
