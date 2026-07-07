**ActionArea** is the WDS Action/Action Area primitive for bottom-aligned actions.

```jsx
<ActionArea caption="Changes are saved after confirmation." safeArea>
  <Button full>Confirm</Button>
</ActionArea>
```

- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- Keep the button itself inside `Button`, `TextButton`, or `IconButton`; `ActionArea` owns placement, spacing, divider, caption, and safe-area padding.
- Use `sticky` only when the action must remain attached to the viewport bottom.
