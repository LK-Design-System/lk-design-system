**DirectionalPad** — LK Robotics extension for PTZ, gimbal, and discrete jog control. It is a momentary D-pad: tap fires one `onStep(dir)`, press-and-hold repeats at `rate` Hz until release. Use `Joystick` for analog vector control.

```jsx
<DirectionalPad onStep={jog} rate={8} onCenter={home} />
```

## LDS reuse boundary

- Compose every direction and center action with Core `IconButton`. `DirectionalPad` owns only the 3x3 spatial layout, direction mapping, hold-repeat cadence, and release/cancel safety behavior.
- Do not recreate button hover, pressed, focus, disabled, sizing, or accessible-label styling locally.
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/): each action retains native button keyboard activation and an explicit accessible label through `IconButton`.

- Compare against common D-pad expectations before changing it: four directional controls in a 3x3 layout, optional center/home action, visible pressed feedback, disabled/no-handler affordance, pointer hold repeat, keyboard arrow support, accessible group and per-button labels.
- Layer: LK Robotics extension. It is a discrete jog/PTZ control for robotics shells and should stay separate from Core action buttons and Product data panels.
- Keep it at the reusable control layer. Do not add speed sliders, ROS topics, robot connection handling, telemetry, or safety-confirm flows here; compose those around the component in a Product or Robotics screen.
- API: `onStep(dir)` (`up` | `down` | `left` | `right`), `rate`, `size`, `disabled`, `center`, `onCenter`, `label`, `directionLabels`, `centerLabel`.
- If `onStep` is missing, direction buttons are disabled. If `onCenter` is present and `center` is omitted, the center action uses the DS `home` icon.
