# LdsProvider

`LdsProvider` is the additive React runtime for theme choice, expression profile, direction,
locale metadata, and the shared Portal layer. Existing CSS-only `[data-theme]`,
`[data-lds-profile]` and `.theme-*` consumers remain supported and do not need a provider.

```jsx
<LdsProvider
  defaultColorScheme="auto"
  profile="ops"
  direction="ltr"
  portalTarget={document.getElementById('overlay-root')}
>
  <App />
</LdsProvider>
```

- `colorScheme` + `onColorSchemeChange` is controlled; `defaultColorScheme` is uncontrolled.
- `profile` + `onProfileChange` is controlled; `defaultProfile` is uncontrolled. The finite
  values are `default` and opt-in `ops`; omitting the profile preserves the baseline expression.
- The profile is Theme-owned token projection only: it may change operational density, motion
  timing and decorative depth, but never public API/DOM anatomy, semantic status meaning,
  contrast requirements, route/permission/freshness/command policy or Robotics truth.
- The Provider projects the selected profile to `data-lds-profile` on the same `target`; CSS-only
  consumers can set that attribute or `.lds-profile-ops` directly when React runtime context is
  not needed.
- The default `storageManager` uses `localStorage`; `storageKey` defaults to `lk-theme`. Pass
  `persist={false}` or a custom `{ get, set, subscribe }` manager for server/cookie/application
  storage ownership. `LdsColorSchemeScript` accepts the same `storageKey` so first paint and the
  hydrated Provider read one preference.
- `target` defaults to `document.documentElement`; `null` updates context without mutating DOM.
- `profile`, `direction` and optional `locale` are inherited by portalled overlays, including
  nested CSS-only profile scopes. Translation resources, date/number formatting and router locale remain
  product responsibilities.
- `portalTarget` and `zIndexBase` configure the common overlay platform; individual overlays can
  still use their explicit limited overrides.
- Render `LdsColorSchemeScript` in the server document head to apply the stored light/dark/auto
  choice before hydration and avoid a first-paint theme flash. Supply `nonce` under a nonce-based CSP.
- `ThemeToggle target={null} value={colorScheme} onChange={setColorScheme}` composes with
  `useLdsRuntime()` when a visible switch is needed; Provider does not render controls.

## Boundaries

- Provider does not fetch locale resources, infer user preference from an account, or own product
  persistence policy.
- Component default props and global compact density are not exposed until repeated cross-product
  evidence identifies a safe finite setting.
- Nested explicit `[data-theme]` scopes remain authoritative for local surfaces; Portal copies the
  nearest trigger scope before falling back to Provider color scheme.
