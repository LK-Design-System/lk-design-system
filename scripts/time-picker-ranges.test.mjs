import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseClockSeconds, timePickerRanges} from '../packages/product/src/components/forms/timePickerRanges.js';

test('omitted intervals preserve full-day minute and second ranges', () => {
  assert.deepEqual(timePickerRanges().ranges, [{start: 0, end: 86340}]);
  assert.deepEqual(timePickerRanges({precision: 'second'}).ranges, [{start: 0, end: 86399}]);
  assert.equal(parseClockSeconds('24:00:00'), null);
});
test('gaps disable units and valid changes remain in the requested hour/minute', () => {
  const model = timePickerRanges({precision: 'second', allowedTimeRanges: [{start: '08:30:10', end: '08:30:20'}, {start: '09:00', end: '09:30'}]});
  assert.equal(model.intersects(8 * 3600 + 31 * 60, 8 * 3600 + 31 * 60 + 59), false);
  assert.equal(model.intersects(8 * 3600 + 30 * 60 + 9, 8 * 3600 + 30 * 60 + 9), false);
  assert.equal(model.intersects(8 * 3600 + 30 * 60 + 10, 8 * 3600 + 30 * 60 + 10), true);
  assert.equal(model.intersects(10 * 3600, 11 * 3600 - 1), false);
  assert.equal(model.nearest(8 * 3600 + 30 * 60 + 50, 8 * 3600, 9 * 3600 - 1), 8 * 3600 + 30 * 60 + 20);
});
test('bounds intersect every interval and minute precision never widens seconds', () => {
  const ranges = [{start: '08:30:01', end: '08:31:59'}, {start: '09:00', end: '09:30'}];
  assert.deepEqual(timePickerRanges({allowedTimeRanges: ranges, minTime: '08:30:30', maxTime: '09:15'}).ranges,
    [{start: 8 * 3600 + 31 * 60, end: 8 * 3600 + 31 * 60}, {start: 9 * 3600, end: 9 * 3600 + 15 * 60}]);
  assert.equal(timePickerRanges({allowedTimeRanges: [{start: '08:30:01', end: '08:30:59'}]}).empty, true);
});
test('empty, invalid or reversed input disables the entire range', () => {
  for (const allowedTimeRanges of [[], [{start: 'bad', end: '09:30'}], [{start: '09:30', end: '09:00'}], [{start: '23:59', end: '24:00'}]])
    assert.equal(timePickerRanges({allowedTimeRanges}).empty, true);
  assert.equal(timePickerRanges({minTime: '09:30', maxTime: '09:00'}).empty, true);
});
test('overlap, adjacency and controlled gap values normalize without crossing a gap', () => {
  const model = timePickerRanges({precision: 'second', allowedTimeRanges: [{start: '09:00', end: '09:30'}, {start: '08:30', end: '08:45'}, {start: '08:45:01', end: '08:46'}]});
  assert.deepEqual(model.ranges, [{start: 30600, end: 31560}, {start: 32400, end: 34200}]);
  assert.equal(model.nearest(8 * 3600 + 50 * 60), 31560);
  assert.equal(model.nearest(8 * 3600 + 50 * 60, 8 * 3600 + 50 * 60, 8 * 3600 + 50 * 60), null);
});
