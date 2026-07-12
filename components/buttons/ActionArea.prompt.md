## Action order evidence

[Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs) places the confirming action last in horizontal rows and above dismissive actions when stacked. The LDS rule applies the same reading order to reusable bottom action areas.

**ActionArea** is the WDS Action/Action Area primitive for bottom-aligned actions.

```jsx
<ActionArea caption="Changes are saved after confirmation." safeArea>
  <Button full>Confirm</Button>
</ActionArea>
```

- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- Keep the button itself inside `Button`, `TextButton`, or `IconButton`; `ActionArea` owns placement, spacing, divider, caption, and safe-area padding.
- Use `sticky` only when the action must remain attached to the viewport bottom.
- Use `align="end"` to right-align persistent commit actions without rebuilding an action footer.
- In a horizontal pair, place the dismissive or secondary action first and the primary action last. `ActionArea` preserves DOM order when wrapping and does not infer button priority. If a product needs an explicit vertical stack with the primary action first, compose that vertical layout deliberately instead of relying on flex wrapping to reorder controls.
- Operations patterns keep persistent actions in a bottom `ActionArea` at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. Row navigation stays a 28px `TextButton`, view toggles stay 32px icon controls, and modal actions stay in the dialog-owned action area.
