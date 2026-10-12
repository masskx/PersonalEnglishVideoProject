"""Verify this organization against its saved hashes without modifying any media."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/project-organization'


def sha(file):
    value = hashlib.sha256()
    with file.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest().lower()


def main():
    protected = json.loads((AUDIT / 'protected-files.before.json').read_text(encoding='utf-8-sig'))
    migration = json.loads((AUDIT / 'directory-migration.json').read_text(encoding='utf-8'))
    errors = []
    for item in protected:
        file = ROOT / item['path']
        if not file.is_file() or sha(file) != item['sha256'].lower():
            errors.append(item['path'])
    moved = 0
    for entry in migration['entries']:
        for item in entry['files']:
            file = ROOT / entry['to'] / item['suffix'] if item['suffix'] else ROOT / entry['to']
            if not file.is_file() or sha(file) != item['sha256'].lower():
                errors.append(file.relative_to(ROOT).as_posix())
            moved += 1
    report = {'protectedFiles': len(protected), 'movedEntries': len(migration['entries']),
              'movedFiles': moved, 'allHashesMatch': not errors, 'errors': errors,
              'scope': 'Original final videos, covers, copies, release and media reports; every directory-migration payload. Prototype has a separate preservation report.'}
    (AUDIT / 'preservation-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
