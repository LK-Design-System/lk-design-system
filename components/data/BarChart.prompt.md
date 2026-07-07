**BarChart** — `{ label, value, color? }`로 만드는 단순 세로 막대.

```jsx
<BarChart data={[{label:'초안',value:12},{label:'검토',value:7},{label:'게시',value:5}]} />
```

- **data** — 막대. **height / gap / showValue / color**. 추세에는 `Sparkline`, 비율에는 `DonutChart`를 쓰세요.
