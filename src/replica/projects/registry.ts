import {cludClusProject} from './cludClus';
import {pressProject} from './press';
import {regProject} from './reg';
import {ferProject} from './fer';
import {boubaKikiProject} from './boubaKiki';
import {jectProject} from './ject';
import {portProject} from './port';
import {spectProject} from './spect';
import {visVidProject} from './visVid';
import {audProject} from './aud';
import {dictProject} from './dict';
import {scriptScribProject} from './scriptScrib';
import {tractProject} from './tract';
import {formProject} from './form';
import {structProject} from './struct';
import {flectFlexProject} from './flectFlex';
import {ruptProject} from './rupt';
import {mitMissProject} from './mitMiss';
import {ducDuctProject} from './ducDuct';
import {credProject} from './cred';
import {tenTainProject} from './tenTain';
import {ponPosProject} from './ponPos';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const replicaProjects: readonly ReplicaProjectDefinition[] = [
  pressProject,
  regProject,
  ferProject,
  boubaKikiProject,
  jectProject,
  portProject,
  spectProject,
  visVidProject,
  audProject,
  dictProject,
  scriptScribProject,
  tractProject,
  formProject,
  structProject,
  flectFlexProject,
  ruptProject,
  mitMissProject,
  ducDuctProject,
  credProject,
  tenTainProject,
  ponPosProject,
  cludClusProject,
];

export const getReplicaProject = (slug: string) => {
  const normalized = slug.trim().toLocaleLowerCase();
  const project = replicaProjects.find(
    (candidate) =>
      candidate.slug.toLocaleLowerCase() === normalized ||
      candidate.compositionId.toLocaleLowerCase() === normalized,
  );
  if (!project) {
    throw new Error(
      `Unknown replica project "${slug}". Available: ${replicaProjects.map((item) => item.slug).join(', ')}.`,
    );
  }
  return project;
};
