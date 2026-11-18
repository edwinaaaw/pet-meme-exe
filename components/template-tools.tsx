'use client';
import { useEffect } from 'react';
import { templates } from '@/lib/editor.mjs';
type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
};
export function TemplateTools() {
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => unknown;
        };
      }
    ).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: 'list_cat_meme_templates',
            description:
              'List local template metadata and which ones have sample images. Does not generate images or access uploaded photos.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: () => ({
              templates: templates.map((t) => ({
                id: t.id,
                name: t.name,
                hasSample: !!t.example,
              })),
              generationAvailable: false,
            }),
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional proposed API: app works without it. */
    }
    return () => lifecycle.abort();
  }, []);
  return null;
}
