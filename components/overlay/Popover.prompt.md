**Popover** — 임의의 콘텐츠(정보, 미니 폼, 피커)를 담는 **LDS Core** 비모달
앵커드 패널입니다.

```jsx
<Popover
  trigger={<Button variant="ghost">옵션</Button>}
  width={280}
  collisionBoundary={chatPanelRef}
>
  <FormField label="반경"><Slider defaultValue={30} /></FormField>
</Popover>
```

- **trigger**는 focusable한 단일 요소이며 DOM에 `aria-haspopup="dialog"`·`aria-expanded`·
  `aria-controls`를 전달해야 합니다. **children**은 패널 본문, **align**은 `left · right`,
  **width**는 선호 너비입니다. 단순 메뉴에는 `DropdownMenu`, 짧은 힌트에는 `Tooltip`을 쓰세요.
- `open · defaultOpen · onOpenChange` controlled triad를 제공합니다. trigger click으로 열고,
  바깥 pointer press 또는 `Escape`로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달
  Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- 패널은 선호 정렬을 유지하되 collision 경계에서 반대쪽으로 flip하고 좌우를 clamp하며,
  가용 높이를 넘는 본문만 세로 스크롤합니다.

## Public surface, ref, and Portal

- `ref`, `className`, and `style` target the anchor root. Stable parts are `root`, `trigger`, and `panel`; panel geometry is limited to `--lds-popover-width` and `--lds-popover-max-height`.
- The panel defaults to the common owner-document Portal (`withinPortal=true`), inherits the nearest explicit theme and `dir`, and uses the shared flip/clamp/topmost-dismiss stack. Use `portalTarget` or Provider configuration before opting out with `withinPortal=false`.
- `position`, `align`, and `offset` are canonical placement inputs. Products own the arbitrary panel content, while LDS owns trigger ARIA, Portal positioning, outside press, Escape, and focus restoration.
- `collisionBoundary`는 element 또는 ref를 받고, 그 요소와 viewport의 보이는 교집합을 positioning
  경계로 사용합니다. 생략하면 기존 viewport 경계입니다. `collisionPadding` 기본 16px은 모든 경계
  가장자리에 적용됩니다. Portal은 계속 owner-document body/provider target에 남으므로 clipping 탈출과
  chat panel 내부 geometry 제한을 동시에 충족하며, 선호 `width`와 style은 경계의 가용 폭·높이를
  넘을 수 없습니다.

## 시각 차이와 근거

- Popover와 HoverCard는 `anchoredPanelStyle`의 elevated surface, 1px line, WDS Popover r12,
  shadow-md, 16px padding을 공유합니다. Dropdown Menu의 WDS r16·8×20px menu shell과는 역할과
  원본 컴포넌트가 달라 radius/padding을 억지로 합치지 않습니다.
- [WDS component style parity](../../docs/references/wds/COMPONENT_STYLE_PARITY.md)는 Popover r12와
  Dropdown Menu r16을 각각 원본 component-set 값으로 확인합니다.

## 공식 근거

- [Fluent 2 Popover](https://fluent2.microsoft.design/components/web/react/core/popover/usage)는
  비필수 맥락 콘텐츠, Escape dismiss, 관계가 보이는 배치, overflow 접근을 요구합니다.
- [WAI-ARIA APG Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의 named
  dialog 원칙을 따르되, 이 표면은 배경을 inert 처리하지 않는 비모달이라 `aria-modal`과 trap을
  사용하지 않습니다.
- [React Aria Popover](https://react-spectrum.adobe.com/react-aria/Popover.html)는 Portal overlay의
  positioning boundary를 `boundaryElement`로 별도 지정하고 위치를 자동 갱신합니다. LDS의
  `collisionBoundary`도 Portal target과 독립된 constraint라는 같은 책임 분리를 따릅니다.

Popover는 route 상태, 제출 정책, 중첩 overlay orchestration을 소유하지 않습니다.

- **ariaLabel** — 트리거에 보이는 텍스트가 없을 때 팝오버 콘텐츠의 접근성 이름을 지정합니다.

## 열림·닫힘 모션 (2026-10-13)

- HoverCard와 공유하는 surface·radius·padding·shadow를 유지하며 opacity와 anchor 방향의 `space-1` 수직 이동만 `--dur-fast`·`--ease-out`으로 연결합니다. 선택·제출 상태와 콘텐츠 정책은 추가하지 않습니다.
- Core-private visual presence 동안 Portal과 positioning만 유지합니다. 닫히는 즉시 trigger의 expanded/controls 및 light-dismiss stack은 실제 닫힘 상태가 되고, 퇴장 픽셀은 `aria-hidden`·`inert`·`pointer-events:none`으로 상호작용에서 제외합니다. 좌표를 닫힘 초기에 초기화하지 않아 offscreen으로 튀지 않습니다.
- 퇴장은 transition 완료 또는 계산된 최대 시간 + 50ms 뒤 제거하며 재오픈·unmount 시 frame·timer를 취소합니다. `prefers-reduced-motion: reduce`에서는 endpoint를 즉시 표시하고, 퇴장 중 preference 변경도 즉시 반영합니다.
- [Fluent 2 Popover](https://fluent2.microsoft.design/components/web/react/core/popover/usage)의 관계가 보이는 배치와 비모달 맥락 표면 원칙을 유지합니다. [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)의 비필수 이동 비활성화 원칙을 반영하며, 새로운 focus trap이나 배경 차단은 만들지 않습니다.
