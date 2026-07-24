# Snackbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Snackbar` |
| Storybook | `LDS Core/Components/Overlay/Snackbar` |
| Source | `../component-content.json#core-components-overlay-snackbar` |

사용자 동작 직후 잠시 나타나 결과를 설명하고 보기·다시 시도 같은 하나의 후속 행동을 제공할 때 적합합니다. 여러 알림을 화면 가장자리에 쌓으려면 Toast를, 계속 남아야 하는 상태나 절차 안내에는 Banner나 Callout을 사용하세요.

## 사용 판단

### 사용

- 사용자 동작 직후 잠시 나타나 결과를 설명하고 보기·다시 시도 같은 하나의 후속 행동을 제공할 때 적합합니다. 여러 알림을 화면 가장자리에 쌓으려면 Toast를, 계속 남아야 하는 상태나 절차 안내에는 Banner나 Callout을 사용하세요.
- Use for short feedback with an optional action. Use Toast for transient status-only messages.
- action도 같은 규칙을 따르세요: action 문구를 주면 반드시 onAction(또는 자체 onClick을 가진 노드)을 함께 제공합니다.
- - Use for short feedback with an optional action. Use Toast for transient status-only messages. - WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기"). - tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·….

### 사용하지 않음

- Snackbar가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Snackbar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action | action 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| On Action | onAction 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Tone | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. |
| Icon | 기본 glyph를 대체합니다. 생략하면 tone에 맞는 registry glyph를 씁니다. |
| Leading Icon | icon axis. @default false |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `heading` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `action` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onAction` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `tone` | `\| "normal" \| "positive" \| "cautionary" \| "negative" \| "info" \| "success" \| "warning" \| "error"` | No | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. |
| `variant` | `"normal" \| "positive" \| "cautionary" \| "negative"` | No | Alias for the tone axis. |
| `icon` | `React.ReactNode` | No | 기본 glyph를 대체합니다. 생략하면 tone에 맞는 registry glyph를 씁니다. |
| `leadingIcon` | `boolean` | No | icon axis. @default false |
| `closeButton` | `boolean` | No | 닫기 버튼 노출 축. 닫기 버튼은 onClose가 있을 때만 렌더링되며(핸들러 없는 죽은 컨트롤 방지), 이 값을 false로 두면 onClose가 있어도 감춥니다. @default true |
| `onClose` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `closeLabel` | `string` | No | 닫기 버튼의 접근성 레이블. @default "닫기" |
| `width` | `number \| string` | No | snackbar width. @default 384 |

## States

| State | Contract |
| --- | --- |
| tone | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. 타입 계약: \| "normal" \| "positive" \| "cautionary" \| "negative" \| "info" \| "success" \| "warning" \| "error" |
| variant | Alias for the tone axis. 타입 계약: "normal" \| "positive" \| "cautionary" \| "negative" |
| 상호작용 · 심각도 낭독과 동작 도달 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·announce 규칙이 같습니다: negative만 role="alert" + aria-live="assertive", 나머지는 role="status" + aria-live="polite". 재시도 같은 오류 복구 메시지가 정중하게 흘러가 묻히지 않도록 하는 것이 이 축의 목적입니다. leadingIcon을 켜면 tone에 맞는 registry glyph가….
- closeButton은 onClose가 있을 때만 닫기 버튼을 렌더링합니다. 핸들러 없이 닫기 아이콘만 두면 눌러도 아무 일도 없는 죽은 컨트롤이 되므로, 축은 "노출 여부"만 결정하고 실제 존재 조건은 onClose 입니다. closeButton={false}로 명시적으로 감출 수 있습니다.
- action도 같은 규칙을 따르세요: action 문구를 주면 반드시 onAction(또는 자체 onClick을 가진 노드)을 함께 제공합니다.
- 화면 배치: Snackbar 자체는 표면만 담당합니다. 띄울 때는 ToastStack으로 감싸 배치하세요(bottom-center 권장). 별도의 Snackbar 전용 배치 프리미티브를 만들지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타이포 단계: heading은 body2, description은 label2, 한 줄 메시지는 Toast의 한 줄과 같은 body2 단계를 씁니다(size·line·spacing 토큰 3짝). |
| 명시 규칙 2 | 내부 간격: 아이콘-콘텐츠 gap 12px, 콘텐츠-액션 32px(gap 12 + margin 20)은 WDS Snackbar 메트릭입니다. Toast의 gap 10px과 다른 것은 표면별 고유 메트릭이며 통일 대상이 아닙니다. |
| 명시 규칙 3 | - Use for short feedback with an optional action. Use Toast for transient status-only messages. - WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기"). - tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·… |
| --body2-line | 22px |
| --body2-size | 15px |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Use for short feedback with an optional action. Use Toast for transient status-only messages.
- WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·announce 규칙이 같습니다: negative만 role="alert" + aria-live="assertive", 나머지는 role="status" + aria-live="polite". 재시도 같은 오류 복구 메시지가 정중하게 흘러가 묻히지 않도록 하는 것이 이 축의 목적입니다. leadingIcon을 켜면 tone에 맞는 registry glyph가….
- action도 같은 규칙을 따르세요: action 문구를 주면 반드시 onAction(또는 자체 onClick을 가진 노드)을 함께 제공합니다.

## Accessibility

- WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·announce 규칙이 같습니다: negative만 role="alert" + aria-live="assertive", 나머지는 role="status" + aria-live="polite". 재시도 같은 오류 복구 메시지가 정중하게 흘러가 묻히지 않도록 하는 것이 이 축의 목적입니다. leadingIcon을 켜면 tone에 맞는 registry glyph가….
- - Use for short feedback with an optional action. Use Toast for transient status-only messages. - WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기"). - tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use for short feedback with an optional action. Use Toast for transient status-only messages. |
| Don't | Snackbar가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | action도 같은 규칙을 따르세요: action 문구를 주면 반드시 onAction(또는 자체 onClick을 가진 노드)을 함께 제공합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Snackbar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Alert` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConfirmDialog` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Dimmer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DropdownMenu` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Modal` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToastStack` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Snackbar heading="Saved" action="Undo" onAction={undo} />
<Snackbar leadingIcon description="Changes were saved." onClose={dismiss} />
<Snackbar tone="negative" leadingIcon description="네트워크 연결이 불안정합니다." action="다시 시도" onAction={retry} />
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--body2-spacing`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-strong-soft`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--component-transient-feedback-bg`
- `--component-transient-feedback-blur`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--radius-lg`
- `--shadow-lg`

### Source contracts

- `components/overlay/Snackbar.jsx`
- `components/overlay/Snackbar.d.ts`
- `components/overlay/Snackbar.prompt.md`
- `stories/OverlaySnackbar.stories.jsx`

## Migration

- tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·announce 규칙이 같습니다: negative만 role="alert" + aria-live="assertive", 나머지는 role="status" + aria-live="polite". 재시도 같은 오류 복구 메시지가 정중하게 흘러가 묻히지 않도록 하는 것이 이 축의 목적입니다. leadingIcon을 켜면 tone에 맞는 registry glyph가….
- - Use for short feedback with an optional action. Use Toast for transient status-only messages. - WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기"). - tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Snackbar prompt contract: `components/overlay/Snackbar.prompt.md`
- Storybook implementation evidence: `stories/OverlaySnackbar.stories.jsx`
- [SEED Snackbar benchmark](https://seed-design.io/components/snackbar)
