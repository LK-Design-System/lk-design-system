# Log Viewer

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `LogViewer` |
| Storybook | `LDS Product/Content/Log Viewer` |
| Source | `../component-content.json#product-content-log-viewer` |

실시간 또는 최근 운영 로그를 시간·레벨·출처와 함께 추적할 때 적합합니다. 장기 분석이나 열별 정렬·집계가 필요한 데이터에는 LogViewer 대신 Data Grid 또는 내보내기 도구를 사용하세요.

## 사용 판단

### 사용하지 않음

- Keep it as a presentational stream viewer. Do not open ROS/websocket connections, own log retention policy, or implement command execution here; feed lines and handlers from the product shell.

## Anatomy

| Part | Contract |
| --- | --- |
| streamStatus | Optional transport/freshness state shown above the stream. |
| aria-label | 로그 뷰포트(role="log")의 accessible name. @default "로그 스트림" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `lines` | `LogLine[]` | No |  |
| `filter` | `boolean` | No | Show level filter chips. @default true |
| `search` | `boolean` | No | Show the search field. @default true |
| `tools` | `boolean` | No | Show tail pause, latest, and clear tools. @default true |
| `copyable` | `boolean` | No | Show per-line copy buttons. @default true |
| `autoScroll` | `boolean` | No | Keep the newest line in view as lines append. @default true |
| `height` | `number` | No |  |
| `density` | `'compact' \| 'comfortable'` | No |  |
| `wrap` | `boolean` | No | Wrap log messages. Virtualization is disabled while wrapping is enabled. @default false |
| `virtualized` | `boolean` | No | Render only visible rows for large fixed-height log streams. @default true |
| `overscan` | `number` | No | Extra rows to render above and below the viewport while virtualized. @default 8 |
| `initialQuery` | `string` | No |  |
| `streamStatus` | `'connecting' \| 'online' \| 'reconnecting' \| 'weak' \| 'stale' \| 'error' \| 'offline'` | No | Optional transport/freshness state shown above the stream. |
| `lastUpdatedAt` | `React.ReactNode` | No |  |
| `droppedCount` | `number` | No |  |
| `announceNewLines` | `boolean` | No | tail을 따라가는 동안 도착한 새 로그를 polite status region으로 요약 공지합니다. 일시정지했거나 위로 스크롤해 둔 상태에서는 공지하지 않고 +N 배지로만 알립니다. 디버그 콘솔처럼 공지가 방해되는 맥락에서만 끄세요. |
| `aria-label` | `string` | No | 로그 뷰포트(role="log")의 accessible name. @default "로그 스트림" |
| `onExport` | `(visibleLines: LogLine[]) = void` | No |  |
| `onClear` | `() = void` | No |  |
| `onCopyLine` | `(line: LogLine, text: string) = void` | No |  |

## States

| State | Contract |
| --- | --- |
| streamStatus | Optional transport/freshness state shown above the stream. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 뷰포트는 읽을 수 있어야 합니다. 스크롤 영역은 이름 있는 role="log" 영역이며 tabIndex=0이라 Tab으로 진입해 화살표·PageUp/PageDown·Home/End로 로그를 읽을 수 있습니다(WCAG 2.1.1). copyable={false}여도 포커스 가능한 대상이 사라지지 않습니다. 이름은 aria-label로 바꿉니다(기본 "로그 스트림"). |
| 명시 규칙 2 | 정지 시 조용, 팔로우 중일 때만 알림 — 터미널류 관행입니다. 뷰포트 자체는 live region이 아닙니다(aria-live="off"): 가상화가 스크롤마다 행을 삽입·제거하므로 뷰포트를 live로 두면 화면에 들어온 모든 로그가 낭독됩니다. 대신 상시 마운트된 별도 polite status region이 tail을 따라가는 동안 도착한 새 로그만 요약 공지합니다(1줄이면 그 줄, 여러 줄이면 "새 로그 N줄, 마지막 …"). 일시정지했거나 위로 스크롤해 두면 공지하지 않고, 밀린 양은 "최신 로그로 이동" 버튼의 이름과 +N 배지로 전달합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption2-line | 14px |

## Responsive

- lines {time,level,source,text}[] (level debug·info·warn·error) · filter/search/tools/copyable · autoScroll · height · density compact|comfortable · wrap · virtualized/overscan · initialQuery · onClear/onCopyLine.
- Compare against common log viewer expectations before changing it: level filters, search, tail pause/resume, latest jump, clear visible logs, per-line copy, empty/search-empty states, fixed-height scrolling, and large-list rendering.

## Content and writing

- 라인 복사 성공·실패도 같은 status region에 텍스트로 공지합니다(아이콘 교체만으로 끝내지 않습니다).
- 스트림 상태 변화(streamStatus)도 같은 상시 region이 "스트림 상태: {라벨}"로 공지합니다. 보이는 메타 행은 표현 전용입니다 — 행이 상태와 함께 삽입되는 첫 전환을 live region으로는 놓치기 때문입니다.

## Accessibility

- 레벨은 색상 단독이 아니라 DEBUG/INFO/WARN/ERROR 텍스트로도 구분되고, 필터 칩은 aria-pressed, 도구 그룹과 검색 입력은 각각 이름을 가집니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `ReorderList` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<LogViewer lines={[{ time: '10:42', level: 'error', source: 'nav', text: '...' }]} />
<LogViewer lines={lines} aria-label="주행 로그" announceNewLines={false} />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--caption2-line`
- `--caption2-size`
- `--color-semantic-accent-background-light-blue`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-fill-strong`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-inverse-line-normal`
- `--color-semantic-label-assistive`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--component-icon-button-size-custom`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label2-size`
- `--radius-md`
- `--radius-pill`
- `--radius-sm`
- `--space-1-5`
- `--space-2`
- `--space-2-5`
- `--space-3`

### Source contracts

- `components/content/LogViewer.jsx`
- `components/content/LogViewer.d.ts`
- `components/content/LogViewer.prompt.md`
- `stories/ContentLogViewer.stories.jsx`

## Sources

- LogViewer prompt contract: `components/content/LogViewer.prompt.md`
- Storybook implementation evidence: `stories/ContentLogViewer.stories.jsx`
