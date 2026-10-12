# Delivery workflow

The video master remains 1920x1080 at 30fps.

## Delivery directories

- Draft and approved delivery: `outputs/<slug>/`
- Published delivery: `outputs/<slug>发了/`
- Experiments, previews, source generations: `work/`
- Recoverable superseded generated assets: `archive/`

Use the release command to update `release.json` and rename the folder together:

```powershell
npm run replica:release -- --project=<slug> --status=draft
npm run replica:release -- --project=<slug> --status=approved
npm run replica:release -- --project=<slug> --status=published --platform=douyin
```

`published` renames `<slug>` to `<slug>发了`; changing it back to `draft` or `approved`
renames the folder back to `<slug>`. Never keep both forms for the same project.

## Shared publishing package

```powershell
npm run replica:copy -- --project=<slug>
```

The canonical result is `publish-copy.md`, shared by Douyin and Xiaohongshu. It includes three
title angles, one paste-ready body, hashtags, and a pinned-comment review challenge.
`douyin-copy.md` is a compatibility mirror.

## Required checks

```powershell
npm run replica:content:qa -- --project=<slug>
npm run replica:stills -- --project=<slug> --mode=mobile
npm run replica:assets:audit
```

`content-qa.md` separates modern meaning, historical etymology, and mnemonic explanation.
Mobile stills render the landscape master at 360px width to expose text that is unreadable in a
phone feed.

Do not archive an asset solely because the generic audit marks it unreferenced. Search specialized
renderers before moving it.

## 2026-09-11 current inventory

Use [the current inventory](project-audit/INVENTORY.md) for actual paths and status conflicts.
The folder suffix and release.json currently disagree for flect-flex, struct, tract, and rupt.
This audit did not infer platform publication or change those records.
Some production commands still resolve the canonical output path after the release command
has renamed the folder; address that path handling before rerendering published episodes.
The interrupt vertical prototype currently uses output/interrupt/ under its own scripts.
Do not manually move it to outputs/ without updating those callers and asset/config paths.

Content QA generation creates a pending checklist. Fill it with checked meanings, examples,
etymology evidence, and mnemonic boundaries before treating it as content approval.
Refresh the non-mutating delivery inventory with npm run project:inventory.
