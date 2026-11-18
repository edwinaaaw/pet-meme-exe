export const templates = [
  {
    id: 'alien',
    name: '外星来客',
    file: 'alien.png',
    hint: '接收不到地球信号',
    example: true,
  },
  {
    id: 'kiwi',
    name: '猕猴桃成精',
    file: 'kiwi.png',
    hint: '一颗含猫量很高的水果',
    example: true,
  },
  {
    id: 'work',
    name: '不想上班',
    file: 'work.png',
    hint: '电脑和我都蓝屏了',
    example: true,
  },
  {
    id: 'work-dog',
    name: '刚种完地又要上班',
    file: 'work-dog.png',
    hint: '草帽还没摘，表格已经来了',
    example: true,
  },
  {
    id: 'bun-dog',
    name: '实心小狗馒头',
    file: 'bun-dog.png',
    hint: '按白毛和圆脸匹配，不硬套模板',
    example: true,
  },
];
export function validateFile(bytes, size) {
  if (!size || size > 10 * 1024 * 1024)
    return { ok: false, error: '请选一张不超过 10MB 的照片。' };
  const begins = (a) => a.every((v, i) => bytes[i] === v);
  let mime;
  if (begins([255, 216, 255])) mime = 'image/jpeg';
  if (begins([137, 80, 78, 71, 13, 10, 26, 10])) mime = 'image/png';
  if (
    begins([82, 73, 70, 70]) &&
    [87, 69, 66, 80].every((v, i) => bytes[i + 8] === v)
  )
    mime = 'image/webp';
  return mime
    ? { ok: true, mime }
    : {
        ok: false,
        error: '请选择 JPG、PNG 或 WebP 静态照片；HEIC 和 GIF 请先转换。',
      };
}
export function randomTemplate(random = Math.random) {
  const index = Math.min(
    templates.length - 1,
    Math.max(0, Math.floor(random() * templates.length)),
  );
  return templates[index].id;
}
export function wrapCaption(text, max = 14) {
  const lines = [];
  for (const line of text.split('\n')) {
    const chars = Array.from(line);
    if (!chars.length) lines.push('');
    for (let i = 0; i < chars.length; i += max)
      lines.push(chars.slice(i, i + max).join(''));
  }
  return lines;
}
export function editorReducer(state, event) {
  if (event.type === 'reset')
    return { phase: 'select', result: null, error: '', requestId: event.id };
  if (event.type === 'start')
    return { ...state, phase: 'generating', error: '', requestId: event.id };
  if (event.id !== state.requestId) return state;
  if (event.type === 'success')
    return { ...state, phase: 'result', result: event.result, error: '' };
  if (event.type === 'failure')
    return {
      ...state,
      phase: state.result ? 'result' : 'select',
      error: event.error,
    };
  return state;
}
