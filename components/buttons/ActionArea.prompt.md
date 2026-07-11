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
- Operations patterns keep persistent actions in a bottom `ActionArea` at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. Row navigation stays a 28px `TextButton`, view toggles stay 32px icon controls, and modal actions stay in the dialog-owned action area.
