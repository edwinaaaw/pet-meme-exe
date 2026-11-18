# Cat Meme local prototype implementation plan

**Goal:** Implement the approved mobile retro meme editor locally, with honest unavailable-generation state until a provider is configured.
**Spec:** `../docs/superpowers/specs/2026-09-15-cat-meme-mobile-design.md` (relative to project root).
**Architecture:** Vinext React UI, pure validation/state helpers, local canvas export, same-origin generation boundary. No public deployment or paid calls in this iteration. API provider adapter deliberately disabled until provider and budget are agreed.

## Constraints

Single cat upload, 10MB JPEG/PNG/WebP only; 8 templates plus recommendation/random; one result; optional caption; no account, cloud gallery, or GIF. Gray/deep-blue Windows-style controls, mobile first. Three approved images are examples, never upload-generated results. User references are local preview material only.

## Task 1 — File and editor contracts
- [ ] Write `tests/editor.test.mjs` covering image signatures, size cap, random bounds, caption wrapping, stale result rejection and retention of the prior image on failure.
- [ ] Run `node --test tests/*.test.mjs`; expect failure because `lib/editor.mjs` is absent.
- [ ] Implement `lib/editor.mjs`: `validateFile(bytes,size)`, `randomTemplate(random)`, `wrapCaption(text,max)`, `editorReducer(state,event)`.
- [ ] Rerun tests; require passing, with literal expected outputs.

## Task 2 — Mobile editor
- [ ] Copy supplied references and approved generated examples to `public/media`, record provenance in README.
- [ ] Replace starter route/layout/theme with upload, template browser and single-result editor. Use installed button/radio primitives.
- [ ] Implement normalization (decode, orientation, 1600px cap), bounded file upload, late upload-result protection, local caption canvas and explicit download fallback.
- [ ] Start local server, make one HTTP request, and show meaningful preview.

## Task 3 — Honest generation boundary and verification
- [ ] Write endpoint tests: malformed request rejected; valid input cannot return a prebuilt image or claim success without a configured provider.
- [ ] Implement disabled `/api/generate` contract with JSON errors and a `/api/status` capability response. Expose no secrets. UI never sends uploaded photos without configured generation capability.
- [x] Add WebMCP for read-only template listing. Local selection tool deferred: no agent automation needed for initial trial. Supported-browser contract check not performed; no generation or upload tool.
- [ ] Run tests, type check, production build. Document exact remaining provider/budget integration work; keep local-only.

## Verification commands

`node --test tests/*.test.mjs`

`npx tsc --noEmit`

`npm run build`

No existing small-monster files or remote deployment configuration are changed.

## Execution record — 2026-09-15

Tasks 1 and 2 implemented. Both helper and endpoint test suites were observed failing before their implementation, then passed (8 tests total). Task 3 disabled endpoint and status response implemented; HTTP capability response checked. Type check and production build passed. Local homepage HTTP 200 and preview requested at http://localhost:5180/. Browser/device interactions remain untested. shadcn Button and native toggle buttons used (rather than radio primitives).

Real generation remains blocked on provider, credentials and budget. This handoff completes the local prototype slice only; no public deployment or paid generation occurred. See README for asset restrictions and dependency advisories.
