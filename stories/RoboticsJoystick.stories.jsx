import { Joystick } from '../src/index.js';
import { JoystickCard as JoystickCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LK Robotics Extension/Robotics/Joystick',
  parameters: {
    docs: {
      description: {
        component: '수동 조작 벡터를 입력하는 Joystick 패턴입니다.',
      },
    },
  },
};

export default meta;

export const JoystickControl = {
  name: '조이스틱',
  render: () => (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
      <Joystick size={180} label="수동 조작" />
    </main>
  ),
};

export const JoystickCard = { ...JoystickCardStory, name: 'Joystick card parity', tags: ['!dev', 'visual-parity'] };

