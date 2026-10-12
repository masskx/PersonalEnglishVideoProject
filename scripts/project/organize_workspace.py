"""One-time, reversible 2026-09-12 directory organization. Default is a dry run."""
from pathlib import Path
import argparse
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
RECORD = ROOT / 'docs/project-organization/directory-migration.json'
KEEP = {'cover.png', 'cover-landscape.png', 'publish-copy.md', 'douyin-copy.md',
        'release.json', 'content-qa.md', 'README.md', 'render-report.json',
        'cover-report.json', 'cover-landscape-report.json'}


def relative(file):
    return file.relative_to(ROOT).as_posix()


def checked(value):
    file = (ROOT / value).resolve()
    if not file.is_relative_to(ROOT) or file == ROOT:
        raise ValueError(f'Path is outside the workspace: {file}')
    return file


def digest(file):
    sha = hashlib.sha256()
    with file.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            sha.update(block)
    return sha.hexdigest()


def plan():
    moves = []
    for folder in sorted((ROOT / 'outputs').iterdir()):
        if not folder.is_dir():
            continue
        slug = folder.name.removesuffix('发了')
        for item in sorted(folder.iterdir()):
            destination = None
            reason = ''
            if item.name == 'draft.mp4':
                destination = ROOT / 'work/drafts' / slug / item.name
                reason = '草稿与最终视频分开'
            elif item.name in {'wan', 'wan-white'} and item.is_dir():
                destination = ROOT / 'work/experiments/wan-history' / slug / item.name
                reason = '历史生成源片、任务与处理报告归入试验'
            elif item.is_file() and item.suffix.lower() in {'.png', '.jpg', '.jpeg', '.md'} and item.name not in KEEP:
                destination = folder / 'review' / item.name
                reason = '验收图片和分镜说明集中存放'
            elif item.is_dir() and (item.name.startswith(('comparison', 'round2-', 'spot-checks', 'final-', 'reference-analysis')) or item.name == 'review-stills'):
                destination = folder / 'review' / ('stills' if item.name == 'review-stills' else item.name)
                reason = '验收抽帧集中存放'
            if destination:
                moves.append({'from': relative(item), 'to': relative(destination), 'reason': reason})
    for old, new, reason in [
        ('bg', 'assets/music-source/candidates', '背景音乐候选归入素材来源'),
        ('ian-xiaohei-illustrations-main/ian-xiaohei-illustrations-main', 'references/ian-xiaohei', '完整上游风格包归入参考资料，保留来源与许可'),
    ]:
        if (ROOT / old).exists():
            moves.append({'from': old, 'to': new, 'reason': reason})
    for file in sorted((ROOT / 'work').iterdir()):
        if file.is_file() and file.suffix in {'.log', '.pid'}:
            moves.append({'from': relative(file), 'to': 'work/logs/legacy/' + file.name, 'reason': '散落历史日志集中存放'})
    return moves


def apply(moves):
    if RECORD.exists():
        raise ValueError('Migration journal already exists. Inspect it instead of applying twice.')
    for item in moves:
        source, destination = checked(item['from']), checked(item['to'])
        if not source.exists() or destination.exists():
            raise ValueError(f'Missing source or occupied destination: {source} -> {destination}')
    journal = {'date': '2026-09-12', 'status': 'in-progress', 'entries': []}
    RECORD.parent.mkdir(parents=True, exist_ok=True)
    for item in moves:
        source, destination = checked(item['from']), checked(item['to'])
        files = [source] if source.is_file() else sorted(p for p in source.rglob('*') if p.is_file())
        hashes = [{'suffix': '' if source.is_file() else p.relative_to(source).as_posix(),
                   'bytes': p.stat().st_size, 'sha256': digest(p)} for p in files]
        entry = {**item, 'files': hashes, 'status': 'planned'}
        journal['entries'].append(entry)
        RECORD.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        destination.parent.mkdir(parents=True, exist_ok=True)
        source.rename(destination)
        for saved in hashes:
            target = destination / saved['suffix'] if saved['suffix'] else destination
            if digest(target) != saved['sha256']:
                raise ValueError(f'Hash mismatch after move: {target}')
        entry['status'] = 'verified'
        RECORD.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    # Only remove known empty containers, never recursively delete anything.
    for value in ['ian-xiaohei-illustrations-main', 'config/voice', 'config']:
        folder = checked(value)
        if folder.is_dir() and not any(folder.iterdir()):
            folder.rmdir()
    journal['status'] = 'complete'
    RECORD.write_text(json.dumps(journal, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Moved and hash-verified {len(moves)} entries; originals recoverable using {relative(RECORD)}')


if __name__ == '__main__':
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--apply', action='store_true')
    options = args.parse_args()
    moves = plan()
    if options.apply:
        apply(moves)
    else:
        print(json.dumps({'dryRun': True, 'moves': moves}, ensure_ascii=False, indent=2))
