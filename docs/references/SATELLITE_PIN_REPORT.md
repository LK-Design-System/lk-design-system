# 위성 핀 리포트

릴리스 라인: `0.1.0-rc.69.24` · 위성 4개

`npm run report:satellite-pins`로 생성된다. **격차 자체는 실패가 아니다** —
기록되지 않은 격차만 CI가 막는다 (R4-2, 침묵 불가).

| 위성 | 축 | 자기 버전 | LDS 핀 | 상태 |
| --- | --- | --- | --- | --- |
| `robotics-ui` | domain-pack | 0.1.0-rc.25 | `lds-core` >=0.1.0-rc.69.19 <0.2.0 — peerDependencies<br>`lds-product` >=0.1.0-rc.69.19 <0.2.0 — peerDependencies<br>`lds-theme` 0.1.0-rc.69.19 — devDependencies | 현행 |
| `slides-ui` | domain-pack | 0.1.0-alpha.5 | `lds-core` >=0.1.0-rc.69.18 <0.2.0 — peerDependencies<br>`lds-core` (vendored tgz) — devDependencies<br>`lds-product` >=0.1.0-rc.69.18 <0.2.0 — peerDependencies<br>`lds-product` (vendored tgz) — devDependencies<br>`lds-theme` >=0.1.0-rc.69.18 <0.2.0 — peerDependencies<br>`lds-theme` (vendored tgz) — devDependencies | 현행 |
| `motion` | capability-layer | 0.1.0-alpha.5 | `lds-core` (vendored tgz) — dependencies<br>`lds-theme` (vendored tgz) — dependencies<br>`lds-product` (vendored tgz) — dependencies | vendored 앱 (private, 퍼블리시 안 함) |
| `3d` | capability-layer | 0.1.0-alpha.2 | — | LDS 미사용 |

