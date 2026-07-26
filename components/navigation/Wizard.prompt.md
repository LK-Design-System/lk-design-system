**Wizard** — 다단계 플로우(Steps 인디케이터 + 콘텐츠 + 뒤로/다음).

Classification: **LK Product Extension**. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 `Breadcrumb`, 진행 표시만 필요할 때는 `Steps`를 사용합니다.

```jsx
<Wizard steps={['문의 정보', '현장 정보', '확인']} onStepChange={setStep}>
  {(step) => <StepForm index={step} />}
</Wizard>
```

- **steps** — 라벨. **current / defaultCurrent / onStepChange** — 제어/비제어. **children** — 노드 또는 `(current) => node`. 인디케이터만 필요하면 `Steps`를 쓰세요.
- **footer** — `null`: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤.
- **onComplete / completeLabel** — `onComplete`를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(`completeLabel`, 기본 `'완료'`)이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- **접근성** — 인디케이터는 `Steps` 컴포넌트를 재사용해 `<ol>`/`<li>` 구조, `aria-current="step"`, 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 `aria-live="polite"` 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).
