**HoverCard** — 링크나 focusable 항목의 비필수 미리보기를 hover와 keyboard focus에서 보여 주는
**LK Product Extension**입니다.

```jsx
<HoverCard trigger={<Link>문서 A</Link>}>
  <b>문서 A</b> · 검토 중 · 오늘 업데이트됨.
</HoverCard>
```

- **trigger**는 focusable한 단일 요소이며, **children**은 읽기 전용 미리보기입니다. 카드 안에
  링크·버튼·입력을 넣지 않습니다. 조작이 필요하면 `Popover`, 짧은 한 줄 힌트면 `Tooltip`을 씁니다.
- hover는 `openDelay` 뒤 열리고 `closeDelay` 뒤 닫히지만 keyboard focus는 즉시 엽니다.
  `Escape`는 포인터나 초점을 옮기지 않고 닫습니다. trigger는 `aria-describedby`로 preview를 참조합니다.
- `open · defaultOpen · onOpenChange` triad와 `align · width`를 지원합니다. viewport 경계에서는
  위/아래를 flip하고 좌우를 clamp하며, trigger와 카드 사이를 포인터가 이동해도 유지됩니다.

## 시각 차이와 근거

- WDS에 별도 HoverCard component-set은 없으므로 새 chrome을 만들지 않고 Popover의 r12,
  elevated surface, line, shadow-md, 16px padding을 상속합니다. 상호작용만 hover/focus preview로 제한합니다.
- [WCAG 2.2 SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)은
  hover/focus 추가 콘텐츠가 dismissible·hoverable·persistent해야 한다고 규정합니다.
- [React Spectrum Tooltip](https://react-spectrum.adobe.com/Tooltip)은 pointer와 keyboard가 같은
  정보를 열 수 있도록 focusable trigger를 요구합니다. LDS는 더 풍부하지만 비상호작용인 preview에
  같은 입력 동등성 원칙을 적용합니다.

HoverCard의 정보는 비필수여야 하며 touch-only 사용자가 반드시 알아야 할 내용을 숨기지 않습니다.
