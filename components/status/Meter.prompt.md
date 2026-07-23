**Meter** — 임계값(옵션)이 있는 라벨 값 바(완료율, 품질 점수).

```jsx
<Meter label="완료율" value={82} thresholds={{ low: 20, high: 50 }} />
<Meter label="냉각수 수위" value={12} max={40} thresholds={{ low: 20, high: 50 }} thresholdLabels={{ negative: '부족' }} />
```

- **value / max** — 레벨. **thresholds** — `{ low, high }` 퍼센트 → 레드 / 앰버 / 스틸그린. **label / showValue**. 작업 진행에는 `ProgressBar`를 쓰세요.
- **접근성 role** — 알려진 범위 안의 측정값이므로 `role="meter"`로 노출됩니다. `role="progressbar"`는 *작업*의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 `ProgressBar`를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다.
- **값 발화** — `aria-valuenow` / `aria-valuemin` / `aria-valuemax`는 caller의 `value`·`max` 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 `aria-valuetext`는 보이는 캡션과 같은 `value/max` 문자열이라 `max !== 100`에서도 표기와 발화가 어긋나지 않습니다. `aria-valuetext`를 직접 넘기면 그대로 우선합니다.
- **thresholdLabels** — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 `aria-valuetext`에도 붙습니다. 기본값은 `{ negative: '위험', cautionary: '주의', positive: '양호' }`이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. `showValue={false}`여도 임계 구간이 있으면 캡션 줄은 유지됩니다.
- **이름** — 문자열이 아닌 `label`(ReactNode)도 보이는 라벨에 `aria-labelledby`로 연결되므로 무명 meter가 생기지 않습니다. `label`도 `aria-label`도 없으면 `측정값`이 기본 이름입니다.
