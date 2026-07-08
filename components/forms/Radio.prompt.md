**Radio** — 1.5px 헤어라인 원(20px, `sm` 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 `name`을 공유하세요.

```jsx
<Radio name="type" value="product" checked={t==='product'} onChange={()=>setT('product')} label="제품 문의" />
```
