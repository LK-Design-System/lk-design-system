import * as React from 'react';
import { Button as RootButton } from '@lk-robotics/design-system-core';
import { Button as CompatibilityDeepButton } from '@lk-robotics/design-system-core/components/buttons/Button';
import { Button } from '@lk-robotics/design-system-core/core';
import { ThemeToggle } from '@lk-robotics/design-system-core/theme';
import {
  ConversationMessage,
  MessageFeed,
  MessageComposer,
  SourceDisclosure,
  VirtualKeypad,
  EquipmentStatusCard,
} from '@lk-robotics/design-system-core/product';
import {
  WaypointMarker,
  LaneOverlay,
  RouteOverlay,
  TrajectoryOverlay,
  SpatialRegion,
  FacilityTransition,
} from '@lk-robotics/design-system-core/robotics';
import { Button as CoreDeepButton } from '@lk-robotics/lds-core/components/buttons/Button';
import { ThemeToggle as ThemeDeepToggle } from '@lk-robotics/lds-theme/components/selection/ThemeToggle';
import { Table as ProductDeepTable } from '@lk-robotics/lds-product/components/data/Table';
import { ViewerFrame as ProductDeepViewerFrame } from '@lk-robotics/lds-product/components/viz/ViewerFrame';

// @ts-expect-error Robotics exports must not leak into the Core entrypoint.
import { RobotStatusCard as InvalidCoreRobotStatusCard } from '@lk-robotics/design-system-core/core';

export const consumerContract: React.ReactElement = <Button variant="primary">확인</Button>;

// Robotics navigation extension — renderer-neutral SVG feature contracts.
export const rootCompatibilityContract: React.ReactElement = <RootButton>Root compatibility</RootButton>;
export const deepImportContract: React.ReactElement = (
  <>
    <CompatibilityDeepButton>Compatibility deep import</CompatibilityDeepButton>
    <CoreDeepButton>Core deep import</CoreDeepButton>
    <ThemeDeepToggle target={null} persist={false} />
    <ProductDeepTable columns={[]} rows={[]} />
    <ProductDeepViewerFrame label="Deep viewer" />
  </>
);
export const themeContract: React.ReactElement = <ThemeToggle target={null} persist={false} />;

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

export const equipmentStatusContract: React.ReactElement = (
  <EquipmentStatusCard
    title="화물 엘리베이터 2호기"
    description="물류동 동측"
    status="운행 중"
    statusTone="positive"
    details={[
      { label: '이동', value: '상승 중' },
      { label: '층', value: '3층' },
    ]}
    meta="30초 전에 갱신"
  />
);

// Communication family — message, feed, composer.
export const messageContract: React.ReactElement = (
  <ConversationMessage
    authorRole="assistant"
    author="LK Assistant"
    lifecycle={{ kind: 'response', state: 'complete' }}
  >
    응답 본문
  </ConversationMessage>
);

export const userMessageContract: React.ReactElement = (
  <ConversationMessage authorRole="user" author="김서윤">
    {'첫 줄\n둘째 줄'}
  </ConversationMessage>
);

export const richDocumentMessageContract: React.ReactElement = (
  <ConversationMessage direction="inbound" authorRole="assistant" author="LK Assistant">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const composedSourceMessageContract: React.ReactElement = (
  <ConversationMessage
    direction="inbound"
    authorRole="assistant"
    author="LK Assistant"
    sources={(
      <SourceDisclosure
        sources={[{ id: 'policy', label: '운영 정책', availability: 'available' }]}
      />
    )}
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

export const richUserMessageContract: React.ReactElement = (
  <ConversationMessage authorRole="user" author="김서윤">
    <a href="https://example.com/source">근거 열기</a>
  </ConversationMessage>
);

export const feedContract: React.ReactElement = (
  <MessageFeed ariaLabel="대화" following onFollowingChange={(next, reason) => `${next}:${reason}`}>
    {messageContract}
  </MessageFeed>
);

export const composerContract: React.ReactElement = (
  <MessageComposer
    className="product-composer"
    value=""
    leadingActions={<button type="button">첨부</button>}
    trailingActions={<button type="button">음성</button>}
    onValueChange={(value) => value}
    onSubmit={(value, reason) => `${value}:${reason}`}
  />
);

// Selection and input — numeric virtual keypad.
export const keypadContract: React.ReactElement = (
  <VirtualKeypad value="" mode="decimal" onChange={(value, meta) => `${value}:${meta.action}`} onConfirm={(value) => value} />
);
