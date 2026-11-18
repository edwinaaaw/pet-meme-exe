export function GET() {
  return Response.json({
    generation: false,
    recommendation: false,
    mode: 'local-prototype',
    sampleTemplates: ['alien', 'kiwi', 'work', 'work-dog', 'bun-dog'],
  });
}
