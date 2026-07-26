**AspectRatio** is the WDS Basic/Ratio primitive for media, previews, maps, and video frames.

```jsx
<AspectRatio ratio="var(--ratio-16-9)">
  <img src="preview.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</AspectRatio>
```

- Prefer WDS ratio tokens such as `--ratio-1-1`, `--ratio-4-3`, `--ratio-16-9`, and `--ratio-21-9`.
- Use horizontal ratios by constraining width, and vertical ratios by constraining height, matching the WDS Basic/Ratio source.
- Pass a number only for one-off cases; token strings are preferred for design-system examples.
