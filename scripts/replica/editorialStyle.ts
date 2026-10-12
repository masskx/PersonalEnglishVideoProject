import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';

const cannedPatterns: Array<{name: string; pattern: RegExp}> = [
  {name: '“不是……而是……”模板', pattern: /不是[^。！？\n]{0,36}而是/},
  {name: '“别再……”模板', pattern: /别再[^。！？\n]{0,28}/},
  {name: '“先别……”模板', pattern: /先别[^。！？\n]{0,28}/},
  {name: '“抓住……立刻/马上……”模板', pattern: /抓住[^。！？\n]{0,32}(?:立刻|马上)/},
  {name: '“一个动作串起/记住……”模板', pattern: /一个动作[^。！？\n]{0,24}(?:串起|记住)/},
  {name: '“真正的……是/在于……”模板', pattern: /真正的[^。！？\n]{0,24}(?:是|在于)/},
];

const copyFields = (project: ReplicaProjectDefinition) => {
  const copy = project.publishCopy;
  if (!copy) return [] as Array<{label: string; text: string}>;
  return [
    ...copy.titles.map((text, index) => ({label: `publish title ${index + 1}`, text})),
    {label: 'publish opening', text: copy.opening},
    {label: 'publish takeaway', text: copy.takeaway},
    {label: 'publish prompt', text: copy.prompt},
    {label: 'pinned comment', text: copy.pinnedComment},
  ];
};

export const findEditorialStyleIssues = (project: ReplicaProjectDefinition) => {
  const fields = [
    ...project.storyboard.scenes.map((scene) => ({label: `${scene.id} narration`, text: scene.narration})),
    ...copyFields(project),
  ];
  const issues: string[] = [];
  for (const field of fields) {
    for (const rule of cannedPatterns) {
      const match = field.text.match(rule.pattern)?.[0];
      if (match) issues.push(`${field.label}: ${rule.name}（${match}）`);
    }
  }
  return issues;
};

