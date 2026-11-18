# PET_MEME.exe

A mobile-first, Windows 95-inspired pet meme gallery and caption editor.

Pick one of three heroes — an orange cat, a farming dog, or Snow Seal Princess — browse its transformations, add an optional caption, and save the result as a PNG.

## Current version

- Three side-by-side hero cards: `PLAYER 01`, `PLAYER 02`, `PLAYER 03`
- Five finished sample transformations for the cat and dog
- A locked preview state for Snow Seal Princess while her transformations are still in development
- Optional caption rendered into the exported image
- Native share when supported, with PNG download as fallback
- Local guest-pet preview after choosing a photo

This repository is a visual prototype. It does **not** call an image-generation API. Uploading a personal pet photo only adds a temporary local preview; no file is sent to a server or retained after refresh.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5180
```

Open [http://127.0.0.1:5180](http://127.0.0.1:5180).

## Verify

```bash
node --test tests/*.test.mjs
npx tsc --noEmit
npm run build
```

## Stack

Vinext, React, TypeScript, Vite, and Canvas.

## Image-generation boundary

`/api/status` reports the prototype capabilities. `/api/generate` deliberately returns `503 provider_unconfigured`; it never pretends that a sample is a newly generated result. A real public generator would still need a server-side image provider, secrets, usage limits, consent, retention rules, and failure handling.

## Assets

The interface source is shared as a prototype. Sample pet photos and generated transformations in `public/media` are demonstration assets and are not covered by an open-source license. Do not reuse or redistribute them outside this project without permission. Unused third-party meme references are excluded from the repository.
