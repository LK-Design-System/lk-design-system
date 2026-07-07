**MobileSystemBars** renders WDS Layout/Essential status and home bars for mobile previews.

```jsx
<MobileSystemBars platform="ios" />
<MobileSystemBars platform="android" showHome={false} />
```

- Use only in design-system examples, prototypes, and mock mobile frames.
- Keep safe-area spacing separate through `--mobile-safe-area-top` and `--mobile-safe-area-bottom`.
- Do not use this component as production OS chrome.
