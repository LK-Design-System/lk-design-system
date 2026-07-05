const { useState, useEffect, useMemo } = React;
const { Select, StatusBadge } = window.LKRoboticsDesignSystem_4f14ff;

const TONE = { positive: 'var(--bw-green)', cautionary: 'var(--bw-amber)', negative: 'var(--bw-red)', signal: 'var(--lk-accent-ink)', neutral: 'var(--bw-gray)' };
const mono = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)';

/* ---- icons ---- */
const Lock = (p) => <svg width={p.s || 16} height={p.s || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
const Elevator = (p) => <svg width={p.s || 16} height={p.s || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9.5 10l2.5-2.5 2.5 2.5" /><path d="M9.5 14l2.5 2.5 2.5-2.5" /></svg>;
const Stairs = (p) => <svg width={p.s || 16} height={p.s || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h4v-4h4v-4h4V7h4" /></svg>;
const Chevron = ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s ease' }}><path d="M9 6l6 6-6 6" /></svg>;
const Close = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const Search = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
const ChevronDown = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
const DirArrow = ({ c, dir }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{dir === 'up' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}</svg>;

const TYPES = { door: { label: '자동문', Icon: Lock }, elev: { label: '엘리베이터', Icon: Elevator }, lift: { label: '계단리프트', Icon: Stairs } };
const BUILDINGS = ['본관', '물류동', '별관', '주차장'];

/* ---- data (12 units) ---- */
const ITEMS = [
{ id: 'd1', type: 'door', title: '정문', bld: '본관', loc: '본관 1F', state: '잠김', tone: 'neutral' },
{ id: 'd2', type: 'door', title: '후문', bld: '본관', loc: '본관 1F', state: '열림', tone: 'neutral' },
{ id: 'd3', type: 'door', title: '물류동 출입문', bld: '물류동', loc: '물류동 1F', state: '연결 끊김', tone: 'negative' },
{ id: 'd4', type: 'door', title: '로비 스피드게이트', bld: '본관', loc: '본관 1F', state: '정상', tone: 'positive' },
{ id: 'd5', type: 'door', title: '주차장 차단기', bld: '주차장', loc: '주차장 B1', state: '정상', tone: 'positive' },
{ id: 'e1', type: 'elev', title: '화물 EV 1호기', bld: '물류동', loc: '물류동', state: 'B1', tone: 'signal', direction: 'down', moving: true },
{ id: 'e2', type: 'elev', title: '화물 EV 2호기', bld: '물류동', loc: '물류동', state: '3F', tone: 'signal', direction: 'up', moving: true },
{ id: 'e3', type: 'elev', title: '화물 EV 3호기', bld: '물류동', loc: '물류동', state: '연결 끊김', tone: 'negative' },
{ id: 'e4', type: 'elev', title: '인화 EV', bld: '본관', loc: '본관', state: '정지', tone: 'neutral' },
{ id: 'e5', type: 'elev', title: '비상용 EV', bld: '본관', loc: '본관', state: '점검', tone: 'cautionary' },
{ id: 'l1', type: 'lift', title: '계단리프트 A', bld: '별관', loc: '별관', state: '정지', tone: 'cautionary' },
{ id: 'l2', type: 'lift', title: '계단리프트 B', bld: '별관', loc: '별관', state: '운행', tone: 'positive' }];


const summaryFor = (it) => it.tone === 'negative' ? '통신 끊김 · 응답 없음' : it.tone === 'cautionary' ? '점검중' : it.moving ? it.direction === 'up' ? '상승 중' : '하강 중' : `${it.loc} · 정상`;

function buildDetail(it) {
  const alert = it.tone === 'negative',check = it.tone === 'cautionary';
  const comm = { tone: alert ? 'negative' : 'positive', name: '통신', val: alert ? '끊김' : '정상', time: alert ? '02분 전' : '방금' };
  if (it.type === 'door') return {
    conditions: [{ tone: 'neutral', name: '개폐 상태', val: it.state, time: '' }, comm, { tone: alert ? 'cautionary' : 'positive', name: '센서', val: alert ? '응답 없음' : '정상', time: alert ? '02분 전' : '방금' }],
    telem: [{ label: '금일 개폐', value: '14', unit: '회' }, { label: '마지막 통신', value: alert ? '02분 전' : '방금', unit: '' }],
    events: [{ t: '12:04', d: alert ? '통신 끊김 감지' : '상태 통신 확인' }, { t: '09:12', d: '원격 잠금 · 관리자' }, { t: '08:30', d: '출근 개방' }] };
  if (it.type === 'elev') return {
    conditions: [{ tone: it.moving ? 'signal' : 'neutral', name: '현재 층', val: it.moving ? it.state : alert ? '—' : '대기', time: it.moving ? it.direction === 'up' ? '상승 중' : '하강 중' : '' }, { tone: alert ? 'negative' : 'positive', name: '도어', val: alert ? '미상' : '닫힘', time: '' }, comm],
    telem: alert ? [{ label: '마지막 통신', value: '03분 전', unit: '' }] : [{ label: '속도', value: it.moving ? '0.8' : '0.0', unit: 'm/s' }, { label: '적재율', value: '32', unit: '%' }],
    events: [{ t: '12:03', d: alert ? '통신 끊김 감지' : it.moving ? `${it.state} ${it.direction === 'up' ? '상승' : '하강'} 중` : '대기' }, { t: '12:01', d: '2F 출발' }, { t: '11:58', d: 'B1 적재 완료 320kg' }] };
  return {
    conditions: [{ tone: check ? 'cautionary' : 'positive', name: '운행', val: it.state, time: check ? '점검중' : '' }, { tone: 'neutral', name: '위치', val: '하단', time: '' }, comm],
    telem: check ? [{ label: '점검 경과', value: '24', unit: '분' }] : [{ label: '금일 운행', value: '8', unit: '회' }],
    events: [{ t: '11:40', d: check ? '정기 점검 시작 · 기사' : '정상 운행' }, { t: '11:35', d: '운행 정지 요청' }, { t: '어제 18:20', d: '마지막 정상 운행' }] };
}

const card = { background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', fontFamily: 'var(--font-sans)' };
const sev = (t) => t === 'negative' ? 0 : t === 'cautionary' ? 1 : 2;

/* ---- shared bits ---- */
const BADGE_TONE = { positive: 'positive', cautionary: 'cautionary', negative: 'negative', signal: 'signal', neutral: 'offline' };
function StatePill({ tone, label, dot = true }) {
  // DS StatusBadge — 색은 점(dot), 글자는 잉크(--label-neutral)라 AA 통과. pill 없음.
  // dot=false: 이동 행 — 점 없이 잉크 라벨만(신호는 왼쪽 화살표가 담당).
  if (!dot) return <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', letterSpacing: '-0.1px', color: 'var(--label-neutral)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>;
  return <StatusBadge tone={BADGE_TONE[tone] || 'offline'} style={{ flexShrink: 0, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{label}</StatusBadge>;
}

/* 이동 방향 표시 — pill 밖, 이동 중일 때만. 은은한 dim(투명도) 펄스로 라이브 상태 표시(reduced-motion 시 정지). */
function MovingArrow({ dir, tone = 'signal' }) {
  const c = TONE[tone] || TONE.signal;
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: c }}>
      <svg className={`lk-lift-${dir}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'up' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
      </svg>
    </span>);

}

function SummaryRow({ item, selected, open, showChevron, dense, onClick }) {
  const { Icon } = TYPES[item.type];
  return (
    <div onClick={onClick} style={{ ...card, display: 'flex', alignItems: 'center', gap: 13, padding: dense ? '11px 13px' : '14px 16px', cursor: 'pointer',
      border: `1px solid ${selected ? 'var(--lk-accent-ink)' : 'var(--border-subtle)'}`,
      boxShadow: selected ? '0 0 0 3px var(--focus-ring, rgba(20,120,160,.15))' : 'var(--shadow-sm)', transition: 'border-color .15s, box-shadow .15s' }}>
      <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', flexShrink: 0, background: 'var(--fill-normal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--label-alternative)' }}><Icon /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--label-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
        <div style={{ marginTop: 2, fontSize: 12, fontWeight: 600, color: 'var(--label-alternative)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summaryFor(item)}</div>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {item.moving && item.direction && <MovingArrow dir={item.direction} tone={item.tone} />}
        <StatePill tone={item.tone} label={item.state} dot={!(item.moving && item.direction)} />
      </span>
      {showChevron && <span style={{ color: 'var(--label-assistive)', display: 'inline-flex', flexShrink: 0 }}><Chevron open={open} /></span>}
    </div>);

}

function Kicker({ children }) {
  return <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--label-assistive)', fontFamily: mono, margin: '0 0 10px' }}>{children}</div>;
}
function ConditionRow({ c }) {
  const col = TONE[c.tone] || TONE.neutral;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '9px 0', borderTop: '1px solid var(--line-subtle, #F0EEE9)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0, alignSelf: 'center' }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--label-neutral)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, flexShrink: 0, whiteSpace: 'nowrap' }}>
        {c.time && <span style={{ fontSize: 12, color: 'var(--label-assistive)', fontFamily: mono }}>{c.time}</span>}
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--label-strong)', fontVariantNumeric: 'tabular-nums' }}>{c.val}</span>
      </span>
    </div>);

}
function Telem({ telem }) {
  return (
    <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
      {telem.map((t, i) =>
      <div key={i}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--label-strong)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{t.value}</span>
            {t.unit && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--label-alternative)' }}>{t.unit}</span>}
          </div>
          <div style={{ marginTop: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--label-assistive)' }}>{t.label}</div>
        </div>
      )}
    </div>);

}
function Events({ events }) {
  return (
    <div>
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <div key={i} style={{ display: 'flex', gap: 11 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? 'var(--lk-accent-ink)' : 'var(--line-normal, #CFCBC4)', marginTop: 4 }} />
              {!last && <span style={{ width: 1, flex: 1, background: 'var(--line-subtle, #F0EEE9)', minHeight: 20 }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 14 }}>
              <div style={{ fontSize: 11.5, color: 'var(--label-assistive)', fontFamily: mono, fontVariantNumeric: 'tabular-nums' }}>{e.t}</div>
              <div style={{ marginTop: 2, fontSize: 13, color: 'var(--label-neutral)' }}>{e.d}</div>
            </div>
          </div>);

      })}
    </div>);

}
function DetailBody({ item }) {
  const d = buildDetail(item);
  return (
    <div>
      <div style={{ marginBottom: 20 }}><Kicker>상태 조건</Kicker>
        <div style={{ borderBottom: '1px solid var(--line-subtle, #F0EEE9)' }}>{d.conditions.map((c, i) => <ConditionRow key={i} c={c} />)}</div>
      </div>
      <div style={{ marginBottom: 22 }}><Kicker>텔레메트리</Kicker><Telem telem={d.telem} /></div>
      <div><Kicker>최근 이벤트</Kicker><Events events={d.events} /></div>
    </div>);

}

/* ---- A · inline ---- */
function InlineMode() {
  const [openId, setOpenId] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560 }}>
      {ITEMS.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <SummaryRow item={item} open={open} showChevron onClick={() => setOpenId(open ? null : item.id)} />
            {open && <div style={{ ...card, marginTop: 8, padding: 20, animation: 'lk-slide .22s ease' }}><DetailBody item={item} /></div>}
          </div>);

      })}
    </div>);

}

/* ---- B · drawer (scales) ---- */
const FILTERS = [{ key: 'all', label: '전체' }, { key: 'alert', label: '이상' }, { key: 'check', label: '점검' }, { key: 'ok', label: '정상' }];
const matchStatus = (it, f) => f === 'all' ? true : f === 'alert' ? it.tone === 'negative' : f === 'check' ? it.tone === 'cautionary' : it.tone !== 'negative' && it.tone !== 'cautionary';

function Dropdown({ value, onChange, options, title }) {
  // 시스템 컴포넌트 사용 — 네이티브 <select> 재스타일링이 아니라 디자인 시스템 Select.
  return <Select size="sm" title={title} value={value} onChange={onChange} options={options} style={{ flex: 1, minWidth: 0 }} />;
}

function DrawerMode() {
  const [selId, setSelId] = useState('e2');
  const [filter, setFilter] = useState('all');
  const [loc, setLoc] = useState('all');
  const [q, setQ] = useState('');
  const counts = useMemo(() => ({
    all: ITEMS.length,
    alert: ITEMS.filter((x) => x.tone === 'negative').length,
    check: ITEMS.filter((x) => x.tone === 'cautionary').length,
    ok: ITEMS.filter((x) => x.tone !== 'negative' && x.tone !== 'cautionary').length
  }), []);
  const bldCounts = null;
  const filtered = useMemo(() => ITEMS.filter((x) => matchStatus(x, filter) && (loc === 'all' || x.bld === loc) && (q === '' || (x.title + ' ' + x.loc).toLowerCase().includes(q.toLowerCase()))), [filter, loc, q]);
  const groups = useMemo(() => Object.keys(TYPES).map((type) => ({
    type, label: TYPES[type].label,
    items: filtered.filter((x) => x.type === type).sort((a, b) => sev(a.tone) - sev(b.tone))
  })).filter((g) => g.items.length), [filtered]);
  const sel = ITEMS.find((x) => x.id === selId);

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 430px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 40, background: 'var(--fill-normal)', borderRadius: 'var(--radius-md)', color: 'var(--label-assistive)' }}>
          <Search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="설비명 · 위치 검색" style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--label-strong)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Dropdown title="상태" value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ value: f.key, label: f.label }))} />
          <Dropdown title="위치" value={loc} onChange={setLoc} options={[{ value: 'all', label: '전체 위치' }, ...BUILDINGS.map((b) => ({ value: b, label: b }))]} />
        </div>
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', minHeight: 200, paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 2 }}>
          {groups.map((g) =>
          <div key={g.type}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 2px 9px' }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--label-assistive)', fontFamily: mono }}>{g.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--label-assistive)', fontVariantNumeric: 'tabular-nums' }}>{g.items.length}</span>
                <span style={{ flex: 1, height: 1, background: 'var(--line-subtle, #F0EEE9)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map((item) => <SummaryRow key={item.id} item={item} dense selected={selId === item.id} onClick={() => setSelId(item.id)} />)}
              </div>
            </div>
          )}
          {groups.length === 0 && <div style={{ ...card, padding: '40px 20px', textAlign: 'center', color: 'var(--label-assistive)', fontSize: 13 }}>일치하는 설비가 없습니다.</div>}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'sticky', top: 20 }}>
        {sel ?
        <div key={sel.id} style={{ ...card, boxShadow: 'var(--shadow-lg, 0 6px 28px rgba(8,8,8,.10))', animation: 'lk-drawer .24s ease', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', flexShrink: 0, background: 'var(--fill-normal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--label-alternative)' }}>{React.createElement(TYPES[sel.type].Icon)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--label-strong)', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.title}</div>
                <div style={{ fontSize: 12, color: 'var(--label-alternative)', marginTop: 1 }}>{TYPES[sel.type].label} · {sel.loc}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {sel.moving && sel.direction && <MovingArrow dir={sel.direction} tone={sel.tone} />}
                <StatePill tone={sel.tone} label={sel.state} dot={!(sel.moving && sel.direction)} />
              </span>
              <button onClick={() => setSelId(null)} aria-label="닫기" style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--label-assistive)', display: 'inline-flex', padding: 4, borderRadius: 8 }}><Close /></button>
            </div>
            <div style={{ padding: '20px 20px 24px' }}><DetailBody item={sel} /></div>
          </div> :

        <div style={{ ...card, boxShadow: 'var(--shadow-sm)', padding: '60px 24px', textAlign: 'center', color: 'var(--label-assistive)', fontSize: 13.5 }}>왼쪽에서 설비를 선택하면 세부 상태가 여기 열립니다.</div>
        }
      </div>
    </div>);

}

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('equip-detail-mode') || 'drawer');
  useEffect(() => {localStorage.setItem('equip-detail-mode', mode);}, [mode]);
  return (
    <div className="wrap">
      <div className="kick">EQUIPMENT · DETAIL</div>
      <h1>설비 상태 — 세부 보기 패턴</h1>
      <p className="lede">요약 행은 그대로 두고, 클릭하면 세부가 열립니다. 색·수치·시각 같은 밀도는 펼침 면으로 몰고 리스트는 계속 조용하게.</p>
      <div className="bar">
        <div className="seg" role="group" aria-label="세부 보기 방식">
          <button aria-pressed={mode === 'inline'} onClick={() => setMode('inline')}>A · 인라인 아코디언</button>
          <button aria-pressed={mode === 'drawer'} onClick={() => setMode('drawer')}>B · 드로어 (스케일)</button>
        </div>
        <span className="seg-hint">{mode === 'inline' ? '행을 클릭 → 아래로 세부가 펼쳐집니다. 항목이 적을 때 적합.' : '검색·상태·위치 필터와 타입 그룹으로 많은 설비도 대응 — 리스트만 스크롤, 상세는 고정.'}</span>
      </div>
      {mode === 'inline' ? <InlineMode /> : <DrawerMode />}
    </div>);

}

const style = document.createElement('style');
style.textContent = '@keyframes lk-slide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}@keyframes lk-drawer{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}@keyframes lk-dim{0%,100%{opacity:.4}50%{opacity:1}}@media(prefers-reduced-motion:no-preference){.lk-lift-up,.lk-lift-down{animation:lk-dim 1.5s ease-in-out infinite}}';
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);