import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSamPitch, normalizeSamSpeed } from './samParams.mjs';

test('keeps SAM-style pitch values as-is', () => {
  assert.equal(normalizeSamPitch(64), 64);
  assert.equal(normalizeSamPitch(100), 100);
});

test('keeps SAM-style speed values as-is', () => {
  assert.equal(normalizeSamSpeed(72), 72);
  assert.equal(normalizeSamSpeed(128), 128);
});

test('maps espeak-style defaults to the SAM website defaults', () => {
  assert.equal(normalizeSamPitch(50), 64);
  assert.equal(normalizeSamSpeed(175), 72);
});
