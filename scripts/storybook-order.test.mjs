import assert from 'node:assert/strict';
import test from 'node:test';

import { assertStorySortRootOrder, extractStorySortRootOrder } from './storybook-order.mjs';

function previewWith(rootOrder, outside = '') {
  return `
    ${outside}
    export const parameters = {
      options: {
        storySort: (a, b) => {
          const groupOrder = { "": [${rootOrder}] };
          return groupOrder[""]?.indexOf(a.title) - groupOrder[""]?.indexOf(b.title);
        },
      },
    };
  `;
}

test('reads the actual storySort root order without matching unrelated strings', () => {
  const source = previewWith('"LDS Core", "LDS Theme", "LDS Product"', "const note = 'LDS Robotics';");
  assert.deepEqual(
    extractStorySortRootOrder(source),
    ['LDS Core', 'LDS Theme', 'LDS Product'],
  );
  assert.doesNotThrow(() => {
    assertStorySortRootOrder(source, ['LDS Core', 'LDS Theme', 'LDS Product']);
  });
});

test('rejects a single-quoted external layer in the storySort root order', () => {
  const source = previewWith("'LDS Core', 'LDS Theme', 'LDS Product', 'LDS Robotics'");
  assert.throws(
    () => assertStorySortRootOrder(source, ['LDS Core', 'LDS Theme', 'LDS Product']),
    /LDS Robotics/,
  );
});

test('rejects a double-quoted external layer in the storySort root order', () => {
  const source = previewWith('"LDS Core", "LDS Theme", "LDS Product", "LDS Robotics"');
  assert.throws(
    () => assertStorySortRootOrder(source, ['LDS Core', 'LDS Theme', 'LDS Product']),
    /LDS Robotics/,
  );
});
