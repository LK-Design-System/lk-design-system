**Popover** — 임의의 콘텐츠(정보, 미니 폼, 피커)를 담는 **LK Product Extension** 비모달
앵커드 패널입니다.

```jsx
<Popover trigger={<Button variant="ghost">옵션</Button>} width={280}>
  <FormField label="반경"><Slider defaultValue={30} /></FormField>
</Popover>
```

- **trigger**는 focusable한 단일 요소이며 DOM에 `aria-haspopup="dialog"`·`aria-expanded`·
  `aria-controls`를 전달해야 합니다. **children**은 패널 본문, **align**은 `left · right`,
  **width**는 선호 너비입니다. 단순 메뉴에는 `DropdownMenu`, 짧은 힌트에는 `Tooltip`을 쓰세요.
- `open · defaultOpen · onOpenChange` controlled triad를 제공합니다. trigger click으로 열고,
  바깥 pointer press 또는 `Escape`로 닫습니다. Escape는 trigger로 초점을 복원하지만 비모달
  Popover 자체는 focus trap을 만들지 않아 Tab이 trigger 다음의 패널 입력으로 이동합니다.
- 패널은 선호 정렬을 유지하되 viewport 경계에서 반대쪽으로 flip하고 좌우를 clamp하며,
  가용 높이를 넘는 본문만 세로 스크롤합니다.

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

Popover는 route 상태, 제출 정책, 중첩 overlay orchestration을 소유하지 않습니다.
