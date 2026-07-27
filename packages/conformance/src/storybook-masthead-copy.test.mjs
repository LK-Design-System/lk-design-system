import assert from 'node:assert/strict';
import test from 'node:test';
import { validateMastheadEntries } from './storybook-masthead-copy.mjs';

const contract = {
  limits: {
    maximumCharacters: 240,
    maximumSentences: 4,
    maximumMeanCharacters: 150,
    maximumMedianCharacters: 140,
    maximumP90Characters: 180,
  },
};

function entry(characters, sentences = 2, file = 'stories/Example.stories.jsx') {
  return { file, line: 10, characters, sentences, description: 'example' };
}

test('main-LDS-like masthead distribution passes', () => {
  const result = validateMastheadEntries(
    [entry(105), entry(118), entry(132), entry(146), entry(176, 3)],
    contract,
  );
  assert.deepEqual(result.findings, []);
  assert.equal(result.metrics.medianCharacters, 132);
});

test('individual length and sentence limits fail', () => {
  const result = validateMastheadEntries([entry(459, 6)], contract);
  assert.deepEqual(
    result.findings.map(({ code }) => code),
    [
      'STORYBOOK_MASTHEAD_COPY_LENGTH',
      'STORYBOOK_MASTHEAD_COPY_SENTENCES',
      'STORYBOOK_MASTHEAD_COPY_DISTRIBUTION',
      'STORYBOOK_MASTHEAD_COPY_DISTRIBUTION',
      'STORYBOOK_MASTHEAD_COPY_DISTRIBUTION',
    ],
  );
});

test('repository distribution catches systematic verbosity', () => {
  const result = validateMastheadEntries(
    [entry(170), entry(175), entry(180), entry(185), entry(190)],
    contract,
  );
  assert.ok(
    result.findings.some(({ code, message }) =>
      code === 'STORYBOOK_MASTHEAD_COPY_DISTRIBUTION' && message.startsWith('mean')),
  );
});
