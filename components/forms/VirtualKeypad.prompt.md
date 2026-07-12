# VirtualKeypad

`VirtualKeypad` is an **LK Product Extension** for numeric entry on kiosk and embedded surfaces where the product intentionally renders its own keypad. It is not WDS parity and it is not a replacement for the operating system's general-purpose keyboard or IME.

```jsx
const [value, setValue] = useState('0.');

<Input id="speed" value={value} inputMode="none" onChange={(event) => setValue(event.target.value)} />
<VirtualKeypad
  aria-label="속도 숫자 키패드"
  targetId="speed"
  value={value}
  mode="decimal"
  allowNegative
  min={-2}
  max={2}
  locale="ko-KR"
  onChange={(nextValue) => setValue(nextValue)}
  onConfirm={(confirmedValue) => save(confirmedValue)}
/>
```

## Contract and reading order

- `value` is always a controlled string. Digits, the canonical decimal point `.`, and the optional leading `-` are the only values the component itself inserts. This preserves incomplete editing states such as `-` and `0.`, as well as meaningful leading zeros such as `007`; the keypad never converts the value to a number while editing.
- Visual, DOM, and keyboard order are the same: digits `1–9`, optional sign / `0` / optional decimal, then clear / backspace / confirm. Missing sign or decimal positions are non-interactive, `aria-hidden` grid cells rather than fake disabled keys.
- `onChange(nextValue, { action, key })` reports `digit`, `decimal`, `sign`, `backspace`, or `clear`. The decimal key always reports canonical `key: '.'` even when `locale` renders a comma. `onConfirm(value)` receives that same canonical string.
- `min` and `max` only decide whether confirmation is available. They never clamp, round, pad, or rewrite intermediate input. Empty values, sign-only values, and trailing decimal points are incomplete and therefore cannot be confirmed.
- `maxLength` counts the complete canonical string, including a sign and decimal point. It blocks only mutations that would grow beyond the limit; clear, backspace, and removing an existing sign remain available.
- `disabled` disables all native buttons. `confirmDisabled` disables only confirmation. A consumer should connect any visible reason or range error through `aria-describedby`; the keypad does not invent product validation copy.
- `targetId` is an optional focus-preservation relationship, not a value binding. On pointer down, the keypad prevents the browser from moving focus only when that id resolves to the input that is already focused. It does not focus a target, search the document globally, or retain focus when some other control was active.
- Every key is the existing native `Button size="lg"` (48px), so Enter/Space, focus-visible, pressed, and disabled behavior remain Button-owned. The keypad installs no document/global keyboard listener and no repeat-on-hold behavior.

## Visual-delta inventory

| Closest LDS sibling | Retained constraint | Intentional delta and reason |
| --- | --- | --- |
| `Button` | native button semantics, 48px `lg` height, existing radius, focus, pressed and disabled treatments | The buttons are arranged in a three-column numeric layout; digits use `flat`, edit actions use `ghost`, and confirm uses the existing primary hierarchy. No keypad-only button styling or token is introduced. |
| `NumberField` | numeric purpose and explicit min/max | `NumberField` owns a native numeric field and clamps step changes; `VirtualKeypad` is a separate controlled input method and must preserve partial string values, so it neither renders nor subclasses a spinbutton. |
| `Input` / `InputGroup` | the target field owns its label, helper/error, value display, and field focus ring | The keypad is only the adjacent action group. It does not duplicate a value display, unit, label, or validation message inside a second card. |

The group uses only established surface, line, spacing, radius, label, and Button tokens. Its outer surface groups touch targets without introducing a new elevation, shadow, status color, icon family, or motion language. When a product shell already supplies the single enclosing surface, the keypad may remove its own border/fill through `style` so the composition does not become a card within a card. If `maxLength` disables digit keys, the adjacent product helper must visibly explain the limit while clear/backspace remain available. At the reference width it is 304px wide and remains under 300px tall; it contracts to the parent width while retaining three equal columns.

## Authoritative research and conclusions

- [WHATWG HTML `inputmode`](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute) lets a user agent choose an appropriate input modality independently of input type. LDS therefore keeps native `inputMode`/`enterKeyHint` pass-through as the default path; a product uses `inputmode="none"` only when it has intentionally supplied a complete local input control.
- [W3C VirtualKeyboard API](https://www.w3.org/TR/virtual-keyboard/) is a Working Draft for virtual-keyboard visibility and viewport/layout adaptation. `VirtualKeypad` does not require, call, or emulate that API; products may add it as a progressive viewport enhancement outside this component.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) requires at least a 24-by-24 CSS-pixel target unless an exception applies. LDS deliberately reuses its 48px large Button target for every densely adjacent key, exceeding the minimum without depending on spacing exceptions.
- [WAI-ARIA APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) defines named native button activation with Enter and Space. Individual keypad keys remain native Buttons; the outer `role="group"` only supplies the collective accessible name and does not replace button semantics with a custom keyboard model.

## Intentional exclusions

- general Hangul/Latin keyboard layouts, candidate words, language switching, password entry, or an IME;
- document/global hardware-key capture, roving focus, arrow-key remapping, long-press repeat, or synthesized keyboard events;
- operating-system keyboard visibility control, VisualViewport/VirtualKeyboard inset management, sticky composer layout, or fullscreen kiosk policy;
- target field rendering, selection/caret editing, target discovery, a shared target ref/hook, unit formatting, thousands grouping, parsing, rounding, clamping, or transport/save state;
- `OperatorKeypad` robotics commands. Those require a separate, evidenced Robotics/Control contract.
