import test from 'node:test';
import assert from 'node:assert/strict';
import { generate } from '../lib/generation.mjs';
test('invalid template is rejected', async () => {
  const r = await generate(
    new Request('http://local/api/generate', {
      method: 'POST',
      body: JSON.stringify({ template: 'unknown' }),
    }),
  );
  assert.equal(r.status, 400);
});
test('unconfigured model never returns a fake image', async () => {
  const r = await generate(
    new Request('http://local/api/generate', {
      method: 'POST',
      body: JSON.stringify({ template: 'alien' }),
    }),
  );
  assert.equal(r.status, 503);
  assert.deepEqual(await r.json(), {
    error: 'provider_unconfigured',
    message: '尚未配置生图服务。未上传或生成照片。',
  });
});
test('malformed body is rejected', async () => {
  const r = await generate(
    new Request('http://local/api/generate', { method: 'POST', body: '{' }),
  );
  assert.equal(r.status, 400);
});
