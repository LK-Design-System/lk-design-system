**Skeleton** - WDS loading placeholder for content that is not ready yet.

```jsx
<Skeleton variant="circle" width={44} />
<Skeleton variant="text" lines={3} width="75%" />
<Skeleton variant="rect" width={280} height={160} />
<Skeleton variant="rect" width={80} height={80} color="#E8EDF5" opacity={0.8} />
```

- **variant**: `rect`, `text`, or `circle`.
- **width / height / radius** map to WDS customize geometry.
- **lines** and **align** cover WDS text skeleton length and alignment examples.
- **color / opacity** cover WDS rectangle/circle customize axes.
- Motion respects `prefers-reduced-motion`.
