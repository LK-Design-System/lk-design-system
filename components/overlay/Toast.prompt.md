**Toast** - transient WDS feedback message on a dark surface.

```jsx
<Toast tone="positive">Saved.</Toast>
<Toast tone="cautionary" leadingIcon={false}>Check the required fields.</Toast>
```

- Use for short, temporary feedback. Use `Snackbar` when a heading, description, action, or close affordance is needed.
- WDS axes: `variant/tone` (`normal`, `positive`, `cautionary`, `negative`) and `leadingIcon`.
