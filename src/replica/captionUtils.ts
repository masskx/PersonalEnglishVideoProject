import type {ReplicaCaptionCue} from './types';

const splitLongClause = (clause: string, maxChars: number): string[] => {
  if (clause.length <= maxChars) return [clause];
  const parts = clause
    .split(/(?<=[，、；：])/u)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1) {
    const lines: string[] = [];
    let current = '';
    for (const part of parts) {
      if (current && current.length + part.length > maxChars) {
        lines.push(current);
        current = part;
      } else {
        current += part;
      }
    }
    if (current) lines.push(current);
    return lines.flatMap((line) =>
      line.length <= maxChars
        ? [line]
        : Array.from({length: Math.ceil(line.length / maxChars)}, (_, index) =>
            line.slice(index * maxChars, (index + 1) * maxChars),
          ),
    );
  }
  return Array.from({length: Math.ceil(clause.length / maxChars)}, (_, index) =>
    clause.slice(index * maxChars, (index + 1) * maxChars),
  );
};

/** Build readable bottom captions for narration overrides while preserving scene timing. */
export const narrationToCaptions = (
  narration: string,
  duration: number,
  maxChars = 34,
): ReplicaCaptionCue[] => {
  const clauses = narration
    .split(/(?<=[。！？；])/u)
    .map((clause) => clause.trim())
    .filter(Boolean)
    .flatMap((clause) => splitLongClause(clause, maxChars));
  const safeClauses = clauses.length > 0 ? clauses : [narration];
  const weights = safeClauses.map((clause) => Math.max(6, clause.length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const usableDuration = Math.max(0.1, duration - 0.12);
  let cursor = 0;
  return safeClauses.map((text, index) => {
    const from = cursor;
    const to =
      index === safeClauses.length - 1
        ? usableDuration
        : Math.min(usableDuration, cursor + (usableDuration * weights[index]) / totalWeight);
    cursor = to;
    return {from, to, text};
  });
};
