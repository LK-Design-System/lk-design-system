**Wizard** — 다단계 플로우(Steps 인디케이터 + 콘텐츠 + 뒤로/다음).

Classification: **LK Product Extension**. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 `Breadcrumb`, 진행 표시만 필요할 때는 `Steps`를 사용합니다.

```jsx
<Wizard steps={['문의 정보', '현장 정보', '확인']} onStepChange={setStep}>
  {(step) => <StepForm index={step} />}
</Wizard>
```

- **steps** — 라벨. **current / defaultCurrent / onStepChange** — 제어/비제어. **children** — 노드 또는 `(current) => node`. **footer={null}**은 내장 컨트롤을 숨김. 인디케이터만 필요하면 `Steps`를 쓰세요.
