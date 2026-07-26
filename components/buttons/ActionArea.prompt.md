## Action order evidence

[Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs) places the confirming action last in horizontal rows and above dismissive actions when stacked. The LDS rule applies the same reading order to reusable bottom action areas.

**ActionArea** is the WDS Action/Action Area primitive for bottom-aligned actions.

```jsx
<ActionArea caption="Changes are saved after confirmation." safeArea>
  <Button full>Confirm</Button>
</ActionArea>
```

- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- **요소 계약** — 기본은 평범한 `div`입니다. 이름 없는 `<section>`은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. `aria-label`(또는 `aria-labelledby`)로 영역 이름을 주면 `<section>`으로 렌더되어 이름 있는 `region` landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습니다.

```jsx
<ActionArea aria-label="주문 확정 액션">…</ActionArea>  // <section> = named region
<ActionArea>…</ActionArea>                              // <div>
```
- Keep the button itself inside `Button`, `TextButton`, or `IconButton`; `ActionArea` owns placement, spacing, divider, caption, and safe-area padding.
- Use `sticky` only when the action must remain attached to the viewport bottom.
- Use `align="end"` to right-align persistent commit actions without rebuilding an action footer.
- In a horizontal pair, place the dismissive or secondary action first and the primary action last. `ActionArea` preserves DOM order when wrapping and does not infer button priority. If a product needs an explicit vertical stack with the primary action first, compose that vertical layout deliberately instead of relying on flex wrapping to reorder controls.
- Operations patterns keep persistent actions in a bottom `ActionArea` at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. Row navigation stays a 28px `TextButton`, view toggles stay 32px icon controls, and modal actions stay in the dialog-owned action area.
