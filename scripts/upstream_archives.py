"""Verify pinned upstream ZIPs and prepare separate IDE copies without executing code."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import stat
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVES = ROOT / 'Beispielprojekte/Originale/Archive'
WORKING_COPIES = ROOT / 'Beispielprojekte/Arbeitskopien'


def load_projects():
    manifest = json.loads((ARCHIVES / 'manifest.json').read_text(encoding='utf-8-sig'))
    if manifest.get('schemaVersion') != 1:
        raise ValueError('Unknown archive manifest version')
    projects = manifest['projects']
    identities = set()
    for project in projects:
        identity = project['id']
        if not re.fullmatch(r'[a-z0-9-]+', identity) or identity in identities:
            raise ValueError('Invalid or duplicate archive ID')
        identities.add(identity)
        revision = project['revision']
        if not re.fullmatch(r'[a-f0-9]{40}', revision):
            raise ValueError('Missing pinned revision')
        if not re.fullmatch(r'https://github.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', project['repository']):
            raise ValueError('Invalid upstream repository')
        repository = project['repository'].removeprefix('https://github.com/')
        if project['archiveUrl'] != f'https://codeload.github.com/{repository}/zip/{revision}':
            raise ValueError('Archive source is not pinned')
        if project['license']['spdx'] != 'MIT':
            raise ValueError('Unexpected source license; review separately before import')
        expected_license_url = f"https://raw.githubusercontent.com/{repository}/{revision}/{project['license']['path']}"
        if project['license']['sourceUrl'] != expected_license_url:
            raise ValueError('Unpinned license source')
    return projects


def inspect_members(archive, project):
    """Return regular files relative to the repository root; reject unsafe ZIP layouts."""
    prefix = project['rootDirectory']
    if not prefix or '/' in prefix or '\\' in prefix or ':' in prefix or prefix in ('.', '..'):
        raise ValueError('Invalid archive root')
    files, seen = [], set()
    for member in archive.infolist():
        path = PurePosixPath(member.filename)
        if path.is_absolute() or '\\' in member.filename or any(part in ('.', '..') or ':' in part for part in path.parts):
            raise ValueError('Unsafe archive path')
        if not path.parts or path.parts[0] != prefix:
            raise ValueError('Unexpected repository prefix')
        if stat.S_ISLNK(member.external_attr >> 16):
            raise ValueError('Symlinks require a separate extraction policy')
        if member.is_dir():
            continue
        relative = path.relative_to(prefix).as_posix()
        if relative == '.' or relative.casefold() in seen:
            raise ValueError('Duplicate or empty file path')
        seen.add(relative.casefold())
        files.append((member, relative))
    if sum(member.file_size for member, _ in files) > 250_000_000:
        raise ValueError('Archive exceeds extraction size limit')
    return sorted(files, key=lambda item: item[0].filename)


def archive_path(project):
    ARCHIVES.resolve().relative_to(ROOT.resolve())
    target = (ROOT / project['archivePath']).resolve()
    target.relative_to(ARCHIVES.resolve())
    if target.suffix != '.zip':
        raise ValueError('Expected ZIP archive')
    return target


def verify_archive(project):
    target = archive_path(project)
    if target.stat().st_size != project['archiveBytes']:
        raise ValueError('Changed archive size: ' + project['id'])
    if hashlib.sha256(target.read_bytes()).hexdigest() != project['archiveSha256']:
        raise ValueError('Changed archive bytes: ' + project['id'])
    with zipfile.ZipFile(target) as archive:
        files = inspect_members(archive, project)
        tree_hash = hashlib.sha256()
        for member, relative in files:
            digest = hashlib.sha256(archive.read(member)).hexdigest()
            tree_hash.update(f'{relative}\0{digest}\0{member.file_size}\n'.encode('utf-8'))
        if len(files) != project['fileCount'] or sum(member.file_size for member, _ in files) != project['uncompressedBytes']:
            raise ValueError('Changed source tree size: ' + project['id'])
        if tree_hash.hexdigest() != project['treeSha256']:
            raise ValueError('Changed source tree content: ' + project['id'])
        license_path = project['rootDirectory'] + '/' + project['license']['path']
        if hashlib.sha256(archive.read(license_path)).hexdigest() != project['license']['sha256']:
            raise ValueError('Changed upstream license: ' + project['id'])
        for relative in project.get('readingOrder', []):
            if relative not in {name for _, name in files}:
                raise ValueError('Reading guide points to missing source: ' + relative)


def verify_archives():
    projects = load_projects()
    for project in projects:
        verify_archive(project)
    print(f'Verified {len(projects)} complete upstream archives (ZIP, source-tree and license SHA-256; offline).')
    return projects


def extract_project(project):
    """Create an untouched working copy once. Existing directories always remain intact."""
    WORKING_COPIES.resolve().relative_to(ROOT.resolve())
    WORKING_COPIES.mkdir(parents=True, exist_ok=True)
    destination = (WORKING_COPIES / project['id']).resolve()
    destination.relative_to(WORKING_COPIES.resolve())
    marker = (WORKING_COPIES / ('.' + project['id'] + '.incomplete')).resolve()
    marker.relative_to(WORKING_COPIES.resolve())
    if marker.exists():
        raise ValueError('Previous extraction incomplete. Move the partial folder and marker aside before retrying: ' + project['id'])
    if destination.exists():
        print(f"Preserved existing working copy: {project['id']}")
        return
    with zipfile.ZipFile(archive_path(project)) as archive:
        files = inspect_members(archive, project)
        # Write directly into a new directory: Windows IDE watchers can lock a staged
        # directory against renaming. A sibling marker makes interrupted copies explicit.
        with marker.open('x', encoding='utf-8') as state:
            state.write('Incomplete extraction of ' + project['revision'] + '\n')
        destination.mkdir()
        for member, relative in files:
            target = (destination / relative).resolve()
            target.relative_to(destination)
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open('xb') as output:
                output.write(archive.read(member))
        marker.unlink()
    print('Prepared IDE folder: ' + str(destination.relative_to(ROOT)))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--extract', action='store_true', help='Prepare ignored IDE copies; never overwrite existing work')
    parser.add_argument('--project', help='Select one project ID')
    arguments = parser.parse_args()
    projects = verify_archives()
    if arguments.project:
        projects = [project for project in projects if project['id'] == arguments.project]
        if not projects:
            parser.error('Unknown project ID')
    if arguments.extract:
        for project in projects:
            extract_project(project)


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, TypeError, zipfile.BadZipFile) as error:
        raise SystemExit('Archive preparation failed: ' + str(error)) from None
