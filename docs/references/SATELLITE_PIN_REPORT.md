# 위성 핀 리포트

릴리스 라인: `0.1.0-rc.69.18` · 위성 4개

`npm run report:satellite-pins`로 생성된다. **격차 자체는 실패가 아니다** —
기록되지 않은 격차만 CI가 막는다 (R4-2, 침묵 불가).

| 위성 | 축 | 자기 버전 | LDS 핀 | 상태 |
| --- | --- | --- | --- | --- |
| `robotics-ui` | domain-pack | 0.1.0-rc.18 | `lds-core` 0.1.0-rc.4 — dependencies<br>`lds-product` 0.1.0-rc.4 — dependencies<br>`lds-theme` 0.1.0-rc.4 — devDependencies | 뒤처짐 |
| `slides-ui` | domain-pack | 0.1.0-alpha.3 | `lds-core` 0.1.0-rc.4 — peerDependencies<br>`lds-core` (vendored tgz) — devDependencies<br>`lds-product` 0.1.0-rc.4 — peerDependencies<br>`lds-product` (vendored tgz) — devDependencies<br>`lds-theme` (vendored tgz) — devDependencies | 뒤처짐 |
| `motion` | capability-layer | 0.1.0-alpha.3 | `lds-core` (vendored tgz) — dependencies<br>`lds-theme` (vendored tgz) — dependencies<br>`lds-product` (vendored tgz) — dependencies | vendored 전용 (버전 주장 없음) |
| `3d` | capability-layer | 0.1.0-alpha.1 | — | LDS 미사용 |

