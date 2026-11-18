import { templates } from './editor.mjs';
export async function generate(request) {
  // This local boundary intentionally accepts metadata only. No image/provider calls.
  const reader = request.body?.getReader();
  let total = 0;
  const chunks = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 2048) {
        await reader.cancel();
        return Response.json({ error: 'body_too_large' }, { status: 413 });
      }
      chunks.push(value);
    }
  }
  let body;
  try {
    const data = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    body = JSON.parse(new TextDecoder().decode(data));
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!body || !templates.some((t) => t.id === body.template))
    return Response.json({ error: 'invalid_template' }, { status: 400 });
  return Response.json(
    {
      error: 'provider_unconfigured',
      message: '尚未配置生图服务。未上传或生成照片。',
    },
    { status: 503 },
  );
}
