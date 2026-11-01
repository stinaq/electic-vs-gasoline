import { describe, expect, it } from 'vitest';
import { TEXT } from '../constants';
import { parseDistance, visibleError } from './parseDistance';

describe('parseDistance', () => {
  it.each([
    ['12', 12],
    ['12,5', 12.5],
    ['12.5', 12.5],
    ['  7,25 ', 7.25],
    ['0,5', 0.5],
    [',5', 0.5],
    ['10.', 10],
    ['+3', 3],
    ['1000', 1000],
  ])('parses %j as %d', (raw, expected) => {
    const result = parseDistance(raw);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBeCloseTo(expected);
  });

  it.each(['', '   '])('requires a value (%j)', (raw) => {
    expect(parseDistance(raw)).toEqual({ ok: false, error: TEXT.errorDistanceRequired });
  });

  it.each(['abc', '12km', '1,2,3', '1.2.3', '1 000', '.', ',', 'Infinity', 'NaN', '1e3', '--3'])(
    'rejects non-numeric %j',
    (raw) => {
      expect(parseDistance(raw)).toEqual({ ok: false, error: TEXT.errorDistanceNotNumber });
    },
  );

  it.each(['0', '0,0', '-3', '-0,5'])('rejects non-positive %j', (raw) => {
    expect(parseDistance(raw)).toEqual({ ok: false, error: TEXT.errorDistanceNotPositive });
  });
});

describe('visibleError', () => {
  const invalid = { ok: false, error: 'bad' } as const;
  const valid = { ok: true, value: 1 } as const;

  it('hides errors until the field is touched', () => {
    expect(visibleError(invalid, false)).toBeNull();
  });

  it('shows errors once touched', () => {
    expect(visibleError(invalid, true)).toBe('bad');
  });

  it('never shows an error for valid input', () => {
    expect(visibleError(valid, true)).toBeNull();
    expect(visibleError(valid, false)).toBeNull();
  });
});
