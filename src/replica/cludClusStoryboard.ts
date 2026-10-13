import storyboardJson from './cludClusStoryboardData.json';
import type {ReplicaStoryboard} from './types';

// 配音实测后冻结的分镜；内容、字幕、三态切点均在同名 JSON 中显式维护。
export const cludClusStoryboard = storyboardJson as ReplicaStoryboard;
