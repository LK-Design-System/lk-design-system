/** Clock-only range math. Dates, timezone, recording coverage and queries stay with the consumer. */
export function parseClockSeconds(time) {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(time));
  if (!match || +match[1] > 23 || +match[2] > 59 || +(match[3] || 0) > 59) return null;
  return +match[1] * 3600 + +match[2] * 60 + +(match[3] || 0);
}

export function timePickerRanges({minTime, maxTime, allowedTimeRanges, precision = 'minute'} = {}) {
  const quantum = precision === 'second' ? 1 : 60;
  const lower = minTime == null ? 0 : parseClockSeconds(minTime);
  const upper = maxTime == null ? 86399 : parseClockSeconds(maxTime);
  let ranges = [];
  if (lower != null && upper != null && lower <= upper) {
    const input = allowedTimeRanges === undefined ? [{start: '00:00:00', end: '23:59:59'}] : allowedTimeRanges;
    if (Array.isArray(input) && input.every(range => parseClockSeconds(range?.start) != null && parseClockSeconds(range?.end) != null
      && parseClockSeconds(range.start) <= parseClockSeconds(range.end))) {
      for (const range of input) {
        const start = Math.ceil(Math.max(lower, parseClockSeconds(range.start)) / quantum) * quantum;
        const end = Math.floor(Math.min(upper, parseClockSeconds(range.end)) / quantum) * quantum;
        if (end >= start) ranges.push({start, end});
      }
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  ranges = ranges.reduce((all, range) => {
    const previous = all.at(-1);
    if (previous && range.start <= previous.end + quantum) previous.end = Math.max(previous.end, range.end);
    else all.push({...range});
    return all;
  }, []);
  const intersects = (start, end) => {
    const first = Math.ceil(start / quantum) * quantum, last = Math.floor(end / quantum) * quantum;
    return first <= last && ranges.some(range => first <= range.end && last >= range.start);
  };
  const nearest = (value, start = 0, end = 86399) => {
    let selected = null, distance = Infinity;
    for (const range of ranges) {
      const first = Math.ceil(Math.max(range.start, start) / quantum) * quantum;
      const last = Math.floor(Math.min(range.end, end) / quantum) * quantum;
      if (first > last) continue;
      const candidate = Math.max(first, Math.min(last, Math.round(value / quantum) * quantum));
      const nextDistance = Math.abs(candidate - value);
      if (nextDistance < distance || nextDistance === distance && candidate < selected) {selected = candidate; distance = nextDistance;}
    }
    return selected;
  };
  return {ranges, empty: !ranges.length, key: ranges.map(range => `${range.start}:${range.end}`).join(','),
    first: ranges[0]?.start ?? 0, intersects, nearest};
}
