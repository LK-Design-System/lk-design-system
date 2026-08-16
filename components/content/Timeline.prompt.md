**Timeline** — 세로형 이벤트 타임라인(변경 이력, 활동 로그).

```jsx
<Timeline label="배포 기록" items={[
  { time: '2026.06.30', dateTime: '2026-06-30', title: '검토 완료', tone: 'positive' },
  { time: '2026.07.03', dateTime: '2026-07-03', title: '게시 진행 중', description: '문서 3건 반영', tone: 'signal' },
]} />
```

- **items** — `{ id, time, dateTime, title, description, tone }`. **tone**은 노드 색을 지정(`signal · positive · cautionary · negative · neutral`). **label** — `ol` 의 접근 가능한 이름.
- 타입 스케일 정합: 제목 15.5px → `--body2-size`(15px, −0.5px), 설명 13.5px → `--label2-size`(13px, −0.5px)로 스냅했습니다. time(caption1)과 함께 전 사이트가 토큰 스케일 위에 있으며, 설명 lineHeight 1.6은 유지했습니다.

## 접근성

- 시간순 기록은 `ol > li` 로 렌더링합니다. div 나열은 순서·개수·현재 위치를 보조 기술에 전혀 전달하지 못합니다(WCAG 1.3.1).
- 시각 표기는 `<time dateTime="…">` 로 감쌉니다. `dateTime` 을 주면 그 값이, 없으면 문자열 `time` 이 기계 판독 값이 됩니다 — `"09:12"`, `"2026-07-03"` 처럼 유효한 형식을 쓰고, `"2026.07.03"` 같은 표기를 쓸 때는 `dateTime` 을 따로 주세요.
- 점·레일은 장식이므로 `aria-hidden` 입니다. **tone 색만으로 사건의 의미를 구분하지 말고** `title`·`description` 텍스트에도 담으세요.

## Orientation (`orientation`) — 가로 연대기

- **orientation** `vertical(기본) · horizontal` — 세로는 로그(변경 이력, 활동 기록)의 문법이고, 가로는 단계가 적은 연대기(로드맵, 마일스톤)의 문법입니다. 가로에서 각 사건은 등분 컬럼(`minmax(0, 1fr)`)이라 사건이 적을수록 한 칸이 넓어집니다.
- 레일 세그먼트는 그리드 gap을 건너 다음 노드까지 이어지고, **마지막 노드 앞에서 멈춥니다** — 연대기가 끝나는 지점에서 선이 계속되면 거짓말입니다.
- 표현 축일 뿐입니다: `ol`/`li` 순서, `<time dateTime>`, 톤 어휘는 세로와 동일합니다.
- 유래: 투영 매체(Slides)의 실측 — 고정 캔버스에서 세로 레일은 좌측 뭉침 + 우측 공백을 만듭니다(`docs/TIMELINE_ORIENTATION_PROPOSAL.md`). 채택으로 위성의 자체 가로 레일 복제가 철거 대상이 됩니다.
