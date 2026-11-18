import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateFile,
  randomTemplate,
  wrapCaption,
  editorReducer,
} from '../lib/editor.mjs';

test('rejects disguised and oversized files while accepting supported signatures', () => {
  assert.equal(
    validateFile(new Uint8Array([71, 73, 70, 56, 57, 97]), 100).ok,
    false,
  );
  assert.equal(
    validateFile(new Uint8Array([255, 216, 255, 224]), 100).mime,
    'image/jpeg',
  );
  assert.equal(
    validateFile(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), 100).mime,
    'image/png',
  );
  assert.equal(
    validateFile(new Uint8Array([255, 216, 255]), 10 * 1024 * 1024 + 1).ok,
    false,
  );
  assert.equal(validateFile(new Uint8Array(), 0).ok, false);
});
test('random selects only real templates, including both ends', () => {
  assert.equal(
    randomTemplate(() => 0),
    'alien',
  );
  assert.equal(
    randomTemplate(() => 0.9999),
    'bun-dog',
  );
});
test('caption wrapping counts emoji as characters and preserves line breaks', () => {
  assert.deepEqual(wrapCaption('你好世界', 2), ['你好', '世界']);
  assert.deepEqual(wrapCaption('猫😺猫\n下班', 2), ['猫😺', '猫', '下班']);
});
test('a failed remake retains previous result', () => {
  const started = editorReducer(
    { phase: 'result', result: '/old.png', requestId: 1, error: '' },
    { type: 'start', id: 2 },
  );
  const failed = editorReducer(started, {
    type: 'failure',
    id: 2,
    error: 'network',
  });
  assert.equal(failed.result, '/old.png');
  assert.equal(failed.phase, 'result');
  assert.equal(failed.error, 'network');
});
test('late response cannot replace a newer photo selection', () => {
  const next = editorReducer(
    { phase: 'generating', result: null, requestId: 1, error: '' },
    { type: 'reset', id: 2 },
  );
  assert.deepEqual(
    editorReducer(next, { type: 'success', id: 1, result: '/stale.png' }),
    next,
  );
});
