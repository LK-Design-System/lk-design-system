**ChoiceCard** — 선택형 프레임 옵션 타일. 선택 시 애저 링 + 틴트로 강조되는 라디오(단일) 또는 체크박스(`multiple`, 다중) 선택 카드. 클릭/Enter/Space로 토글.

```jsx
<ChoiceCard title="순찰" description="정기 경로 자율 순찰" icon={<Icon name="route" />}
  selected={plan === 'patrol'} onSelect={() => setPlan('patrol')} />
<ChoiceCard multiple title="야간 모드" selected={opts.night} onSelect={(v) => setOpt('night', v)} />
```

- **title**/**description**/**icon**은 표준 레이아웃; 완전히 커스텀하려면 그 대신 **children**을 전달. **multiple**이면 인디케이터가 체크박스 사각형으로 바뀜(기본은 원형 라디오). 옵션 그리드/설정 선택에.
