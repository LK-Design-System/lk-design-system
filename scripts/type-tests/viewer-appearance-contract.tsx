import { Map2DCanvas, Scene3DFrame } from '../../src/index.js';

const sceneDefault = <Scene3DFrame />;
const sceneLight = <Scene3DFrame appearance="light" />;
const sceneDark = <Scene3DFrame appearance="dark" />;

const mapDefault = <Map2DCanvas />;
const mapLight = <Map2DCanvas appearance="light" />;
const mapDark = <Map2DCanvas appearance="dark" />;

// @ts-expect-error Viewer appearance is a closed light/dark axis.
const invalidSceneAppearance = <Scene3DFrame appearance="system" />;
// @ts-expect-error Viewer appearance is a closed light/dark axis.
const invalidMapAppearance = <Map2DCanvas appearance="system" />;

void [
  sceneDefault,
  sceneLight,
  sceneDark,
  mapDefault,
  mapLight,
  mapDark,
  invalidSceneAppearance,
  invalidMapAppearance,
];
