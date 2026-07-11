import React from 'react';
import { Button, SelectionInspector } from '../src/index.js';
import { EditorStoryFrame, inspectorItem, inspectorSections } from './EditorShell.shared.jsx';

const meta = {
  title: 'LDS Robotics/Editor/Selection Inspector',
  component: SelectionInspector,
  parameters: {
    docs: {
      description: {
        component:
          'SelectionInspector는 선택된 캔버스 객체의 식별 정보, 상태, 속성 그룹과 객체 범위 액션을 표시합니다.',
      },
    },
  },
};

export default meta;

function InspectorFrame({ children }) {
  return (
    <EditorStoryFrame maxWidth={340} height={460}>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        {children}
      </div>
    </EditorStoryFrame>
  );
}

export const SelectedObject = {
  name: '선택 객체 속성',
  render: () => (
    <InspectorFrame>
      <SelectionInspector item={inspectorItem} sections={inspectorSections} onClearSelection={() => {}} />
    </InspectorFrame>
  ),
};

export const EmptySelection = {
  name: '선택 객체 없음',
  render: () => (
    <InspectorFrame>
      <SelectionInspector item={null} emptyLabel="캔버스에서 객체를 선택하세요." />
    </InspectorFrame>
  ),
};

export const ActionFooter = {
  name: '객체 액션 푸터',
  render: () => (
    <InspectorFrame>
      <SelectionInspector
        item={inspectorItem}
        sections={inspectorSections.slice(0, 1)}
        actions={(
          <>
            <Button variant="outlined" color="assistive">삭제</Button>
            <Button>적용</Button>
          </>
        )}
      />
    </InspectorFrame>
  ),
};

export const PrimitiveValues = {
  name: '0·false·빈 값 보존',
  render: () => (
    <InspectorFrame>
      <SelectionInspector
        item={{ label: 'Primitive values', kind: 'Evidence' }}
        sections={[{
          title: 'Values',
          fields: [
            { label: 'Count', value: 0 },
            { label: 'Enabled', value: false },
            { label: 'Optional', value: '' },
            { label: 'Custom zero', valueNode: 0 },
            { label: 'Custom false', valueNode: false },
          ],
        }]}
      />
    </InspectorFrame>
  ),
};

export const MixedSelection = {
  name: '다중 선택 공통 속성',
  render: () => (
    <InspectorFrame>
      <SelectionInspector
        item={{ label: 'Regions', kind: 'Region', status: '3 selected', statusTone: 'signal' }}
        selectionCount={3}
        sections={[
          {
            title: 'Geometry',
            fields: [
              { label: 'Layer', value: 'Regions' },
              { label: 'Vertices', mixed: true },
              { label: 'Area', mixed: true, unit: 'm²' },
            ],
          },
          {
            title: 'Behavior',
            fields: [
              { label: 'Mode', value: 'Restricted' },
              { label: 'Speed', mixed: true, unit: 'm/s' },
            ],
          },
        ]}
        onClearSelection={() => {}}
      />
    </InspectorFrame>
  ),
};
