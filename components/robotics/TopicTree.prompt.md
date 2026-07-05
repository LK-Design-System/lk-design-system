**TopicTree** — ROS 토픽 / TF 계층 트리. 타입·Hz 메타와 구독 토글을 제공합니다.

```jsx
<TopicTree onToggleSubscribe={(n) => sub(n)} nodes={[
  { name: '/scan', type: 'sensor_msgs/LaserScan', hz: 10, subscribable: true, subscribed: true },
  { name: '/odom', type: 'nav_msgs/Odometry', hz: 50, subscribable: true },
  { name: 'tf', children: [{ name: 'base_link' }, { name: 'odom' }, { name: 'map' }] },
]} />
```

- **nodes** — `{ name, type, hz, subscribable, subscribed, children }`. 헤더 클릭으로 펼치고, 토글로 구독을 켜고 끕니다.
