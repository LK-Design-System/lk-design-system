import * as React from 'react';
import {
  Button,
  WaypointMarker,
  LaneOverlay,
  RouteOverlay,
  TrajectoryOverlay,
  SpatialRegion,
  FacilityTransition,
  ConversationMessage,
  MessageFeed,
  MessageComposer,
  SourceDisclosure,
  VirtualKeypad,
} from '@lk-robotics/design-system-core';

export const consumerContract: React.ReactElement = <Button variant="primary">확인</Button>;

// Robotics navigation extension — renderer-neutral SVG feature contracts.
export const waypointContract: React.ReactElement = (
  <WaypointMarker
    waypoint={{ id: 'w1', label: '웨이포인트', mapId: 'm1', position: { x: 0, y: 0 }, roles: ['holding'] }}
    onActivate={(id) => id}
  />
);

export const laneContract: React.ReactElement = (
  <LaneOverlay
    lane={{
      id: 'l1',
      mapId: 'm1',
      points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      entry: { waypointId: 'w1', orientation: 'forward' },
      exit: { waypointId: 'w2' },
    }}
    availability="available"
  />
);

export const routeContract: React.ReactElement = (
  <RouteOverlay
    activeMapId="m1"
    route={{
      id: 'r1',
      status: 'active',
      segments: [{ id: 's1', mapId: 'm1', points: [{ x: 0, y: 0 }], phase: 'current' }],
    }}
  />
);

export const trajectoryContract: React.ReactElement = (
  <TrajectoryOverlay
    trajectory={{ id: 't1', mapId: 'm1', status: 'active', samples: [{ position: { x: 0, y: 0 } }] }}
  />
);

export const regionContract: React.ReactElement = (
  <SpatialRegion
    region={{
      id: 'z1',
      mapId: 'm1',
      label: '영역',
      category: 'behavior',
      rule: { kind: 'keep-out' },
      shape: { kind: 'circle', center: { x: 0, y: 0 }, radius: 1 },
    }}
  />
);

export const facilityContract: React.ReactElement = (
  <FacilityTransition
    activeMapId="m1"
    transition={{
      id: 'f1',
      kind: 'door',
      label: '자동문',
      facilityId: 'd1',
      from: { mapId: 'm1', position: { x: 0, y: 0 } },
      availability: 'available',
      doorState: 'closed',
    }}
  />
);

// Communication family — message, feed, composer.
export const messageContract: React.ReactElement = (
  <ConversationMessage
    direction="inbound"
    authorRole="assistant"
    author="LK Assistant"
    lifecycle={{ kind: 'response', state: 'complete' }}
  >
    응답 본문
  </ConversationMessage>
);

export const solidMessageContract: React.ReactElement = (
  <ConversationMessage direction="outbound" authorRole="user" variant="solid" author="김서윤">
    {'첫 줄\n둘째 줄'}
  </ConversationMessage>
);

export const richSoftMessageContract: React.ReactElement = (
  <ConversationMessage direction="inbound" authorRole="assistant" author="LK Assistant">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const compactSourceMessageContract: React.ReactElement = (
  <ConversationMessage
    direction="inbound"
    authorRole="assistant"
    author="LK Assistant"
    sourcePresentation="compact"
    sources={[{ id: 'policy', label: '운영 정책', availability: 'available' }]}
  >
    근거가 있는 응답
  </ConversationMessage>
);

export const embeddedSourceContract: React.ReactElement = (
  <SourceDisclosure
    titleVisuallyHidden
    sources={[{ id: 'policy', label: '운영 정책', availability: 'available' }]}
  />
);

export const invalidRichSolidMessageContract: React.ReactElement = (
  // @ts-expect-error Solid message bodies intentionally reject rich content.
  <ConversationMessage direction="outbound" authorRole="user" variant="solid" author="김서윤">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const feedContract: React.ReactElement = (
  <MessageFeed ariaLabel="대화" following={false} onFollowingChange={(next, reason) => `${next}:${reason}`}>
    {messageContract}
  </MessageFeed>
);

export const composerContract: React.ReactElement = (
  <MessageComposer value="" onValueChange={(value) => value} onSubmit={(value, reason) => `${value}:${reason}`} />
);

// Selection and input — numeric virtual keypad.
export const keypadContract: React.ReactElement = (
  <VirtualKeypad value="" mode="decimal" onChange={(value, meta) => `${value}:${meta.action}`} onConfirm={(value) => value} />
);
