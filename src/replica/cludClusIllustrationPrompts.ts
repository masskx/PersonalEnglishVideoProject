import type {ReplicaIllustrationPrompt} from './projectTypes';
export const cludClusIllustrationPrompts: readonly ReplicaIllustrationPrompt[]=[
  {
    "id": "include-before",
    "filename": "include-before.png",
    "purpose": "小黑把餐盘收进盒子，再合上盖子；餐盘成为整体的一部分。",
    "subject": "One solid-black worker stands left of a small open pale-blue lunch box and holds one orange plate outside it. The lid is upright, box only half the character height.",
    "prompt": "One solid-black worker stands left of a small open pale-blue lunch box and holds one orange plate outside it. The lid is upright, box only half the character height. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "include-change",
    "filename": "include-change.png",
    "purpose": "小黑把餐盘收进盒子，再合上盖子；餐盘成为整体的一部分。",
    "subject": "The same worker lowers the same orange plate halfway into the same open lunch box; lid, box, camera and character scale unchanged.",
    "prompt": "The same worker lowers the same orange plate halfway into the same open lunch box; lid, box, camera and character scale unchanged. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "include-result",
    "filename": "include-result.png",
    "purpose": "小黑把餐盘收进盒子，再合上盖子；餐盘成为整体的一部分。",
    "subject": "The same worker has placed the plate fully inside the same box and closes the lid; one hand rests on the closed lid. No plate remains outside.",
    "prompt": "The same worker has placed the plate fully inside the same box and closes the lid; one hand rests on the closed lid. No plate remains outside. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "exclude-before",
    "filename": "exclude-before.png",
    "purpose": "小黑合上盒子，把橙色餐盘留在外面，表示不纳入整体。",
    "subject": "One solid-black worker stands left of a small open pale-blue box. One orange plate lies clearly outside the box on its right. Worker holds the lid open.",
    "prompt": "One solid-black worker stands left of a small open pale-blue box. One orange plate lies clearly outside the box on its right. Worker holds the lid open. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "exclude-change",
    "filename": "exclude-change.png",
    "purpose": "小黑合上盒子，把橙色餐盘留在外面，表示不纳入整体。",
    "subject": "Same worker starts closing the lid of the same box while the orange plate stays outside, untouched on the right.",
    "prompt": "Same worker starts closing the lid of the same box while the orange plate stays outside, untouched on the right. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "exclude-result",
    "filename": "exclude-result.png",
    "purpose": "小黑合上盒子，把橙色餐盘留在外面，表示不纳入整体。",
    "subject": "Same worker firmly holds the closed lid. The same orange plate is still clearly outside on the right, excluded from the box.",
    "prompt": "Same worker firmly holds the closed lid. The same orange plate is still clearly outside on the right, excluded from the box. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "conclude-before",
    "filename": "conclude-before.png",
    "purpose": "小黑收齐材料并合上文件夹，以讨论收束助记结束和得出结论。",
    "subject": "One solid-black worker faces a small open orange folder on a short pale-blue desk. Two blank cream sheets are beside the folder; worker reaches for them.",
    "prompt": "One solid-black worker faces a small open orange folder on a short pale-blue desk. Two blank cream sheets are beside the folder; worker reaches for them. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "conclude-change",
    "filename": "conclude-change.png",
    "purpose": "小黑收齐材料并合上文件夹，以讨论收束助记结束和得出结论。",
    "subject": "Same worker gathers the two blank sheets inside the same open orange folder on the same desk.",
    "prompt": "Same worker gathers the two blank sheets inside the same open orange folder on the same desk. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "conclude-result",
    "filename": "conclude-result.png",
    "purpose": "小黑收齐材料并合上文件夹，以讨论收束助记结束和得出结论。",
    "subject": "Same worker presses the same orange folder closed on the same desk. The two sheets are inside. Calm resolved posture, no text or symbols.",
    "prompt": "Same worker presses the same orange folder closed on the same desk. The two sheets are inside. Calm resolved posture, no text or symbols. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "preclude-before",
    "filename": "preclude-before.png",
    "purpose": "小黑在球通过之前关上局部小闸门，把通路堵住，助记阻止发生。",
    "subject": "One solid-black worker stands next to a small hand-drawn orange hinged gate on a short blue ground line, gate open. One small orange ball sits well before the gate. Gate lower than the worker shoulders.",
    "prompt": "One solid-black worker stands next to a small hand-drawn orange hinged gate on a short blue ground line, gate open. One small orange ball sits well before the gate. Gate lower than the worker shoulders. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "preclude-change",
    "filename": "preclude-change.png",
    "purpose": "小黑在球通过之前关上局部小闸门，把通路堵住，助记阻止发生。",
    "subject": "Same worker swings the same small gate shut across the local path. Same ball is closer but has not crossed the gate.",
    "prompt": "Same worker swings the same small gate shut across the local path. Same ball is closer but has not crossed the gate. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "preclude-result",
    "filename": "preclude-result.png",
    "purpose": "小黑在球通过之前关上局部小闸门，把通路堵住，助记阻止发生。",
    "subject": "Same worker holds the small gate fully closed. The orange ball is stopped on the near side, path beyond remains empty. Keep the worker dominant and gate subordinate.",
    "prompt": "Same worker holds the small gate fully closed. The orange ball is stopped on the near side, path beyond remains empty. Keep the worker dominant and gate subordinate. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "seclude-before",
    "filename": "seclude-before.png",
    "purpose": "小黑拉起阅读角的帘子，将自己与外界隔开，助记独处、僻静。",
    "subject": "One solid-black worker sits holding a small blank orange book on a low stool. A small pale-blue curtain is gathered on the right of the reading nook; worker holds its cord.",
    "prompt": "One solid-black worker sits holding a small blank orange book on a low stool. A small pale-blue curtain is gathered on the right of the reading nook; worker holds its cord. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "seclude-change",
    "filename": "seclude-change.png",
    "purpose": "小黑拉起阅读角的帘子，将自己与外界隔开，助记独处、僻静。",
    "subject": "Same worker pulls the curtain halfway across the same reading nook. Keep eyes, book, stool and body visible; thin hand-drawn curtain, not a huge panel.",
    "prompt": "Same worker pulls the curtain halfway across the same reading nook. Keep eyes, book, stool and body visible; thin hand-drawn curtain, not a huge panel. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  },
  {
    "id": "seclude-result",
    "filename": "seclude-result.png",
    "purpose": "小黑拉起阅读角的帘子，将自己与外界隔开，助记独处、僻静。",
    "subject": "Same worker sits quietly with the orange book inside a partly enclosed nook, curtain drawn to the side leaving a generous opening with face and body visible. No extra person.",
    "prompt": "Same worker sits quietly with the orange book inside a partly enclosed nook, curtain drawn to the side leaving a generous opening with face and body visible. No extra person. Preserve accepted solid-black worker identity, solid white dot eyes, hand-drawn black contours, sparse orange and pale blue props, transparent background, no text."
  }
];
