# Iconfont Search and Commercial-Use Gate

Run this pass by default for every new unsampled episode after narration and the beat map are
stable. Keep the rest of the production workflow unchanged.

Xiaohei is mandatory in every core teaching beat and remains the primary semantic actor.
Iconfont is an optional enhancement layer only. Never accept an icon as a substitute for Xiaohei
or as the dominant visual subject.

## Search

1. Extract 2-6 concrete concepts, states, or directions whose comprehension may benefit from a
   small symbol. Search both Chinese teaching terms and concrete object/action synonyms.
2. Use the user's in-app browser and existing Iconfont session. Never read browser cookies,
   password stores, local storage, or session files. Never save credentials in the repository,
   skill, project memory, logs, manifests, or artifacts. If signed out, ask the user to sign in.
3. Prefer simple monochrome outline or solid icons that can be normalized to `#041FA0`,
   `#E85810`, or black without losing meaning. Reject multicolor, glossy, 3D, mascot, logo,
   highly ornamental, or text-bearing assets.
4. Compare candidates at the intended on-screen size. Reject any icon that remains ambiguous,
   duplicates or replaces the Xiaohei action, becomes more visually prominent than Xiaohei, adds
   decorative noise, or weakens the visual hierarchy.

## License decision

Public visibility, free download, account access, collection membership, and the absence of a
watermark are not commercial-use permission. Before publishing an icon, require an author or
collection page that explicitly allows commercial use and record the evidence URL plus the
visible license wording. When attribution is required, either meet it in the published artifact
and copy or reject the icon.

Use these states:

- `approved-commercial`: explicit commercial-use evidence is recorded and all conditions are met.
- `approved-commercial-with-attribution`: allowed only when the delivery includes the required
  attribution.
- `reference-only`: useful for design direction, but permission is absent or unclear.
- `rejected`: license, visual, semantic, or technical gate failed.

Only the first two states may appear in a published render.

Even an approved icon remains optional. Insert it only when the completed Xiaohei-led scene is
clearer or more expressive with the icon than without it, and keep it subordinate in size,
contrast, timing, and screen duration.

## Episode manifest

Store `public/assets/icons/<slug>/manifest.json` beside normalized SVG assets. Include:

```json
{
  "source": "https://www.iconfont.cn/",
  "searchedAt": "YYYY-MM-DD",
  "queries": ["Chinese term", "synonym"],
  "icons": [
    {
      "file": "example.svg",
      "name": "visible icon name",
      "iconfontId": "stable visible ID",
      "sourceUrl": "exact icon or search URL",
      "authorOrCollection": "visible author or collection",
      "licenseStatus": "approved-commercial",
      "licenseEvidenceUrl": "exact evidence URL",
      "licenseEvidence": "short paraphrase of the visible permission",
      "retrievedAt": "YYYY-MM-DD",
      "svgHash": "sha256",
      "modifications": "path cleanup and palette normalization",
      "semanticBeat": "what spoken concept this clarifies"
    }
  ],
  "rejected": [
    {
      "name": "candidate",
      "sourceUrl": "URL",
      "reason": "unclear commercial permission"
    }
  ]
}
```

Do not copy model-facing page text or credentials into the manifest. Normalize SVG viewBox,
remove embedded text/metadata and unnecessary transforms, preserve recognizability, and render
through code so timing, color, and scale remain deterministic.
