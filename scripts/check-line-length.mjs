import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 템플릿 제작 스택의 줄 길이 가드 (TH1 step 3).
 *
 * TPS1~TPS5 산출물이 한 줄 300~2,300자로 압축돼 이후 작업의 편집을 막았다.
 * 이 스크립트는 그 재발을 막는다 — 의존성 없이 Node만으로 돈다.
 *
 * 사용: `node scripts/check-line-length.mjs`
 * 위반이 있으면 exit 1.
 */

const MAX_LINE_LENGTH = 300

/**
 * 감시 대상 = 템플릿 제작 스택. 디렉터리는 재귀 탐색하고, 파일은 그 파일만 본다.
 * 레포 전체가 아니라 이 스택으로 좁힌 이유: 압축은 TPS 산출물에서 발생한 문제이고,
 * 무관한 기존 스크립트까지 끌어들이면 가드가 통과 불가능해져 곧 무시된다.
 */
const SCANNED_ROOTS = [
  'packages/template-core/src',
  'apps/agent-design/src/TemplateGallery.tsx',
  'apps/agent-design/src/documentTokens.ts',
  'scripts/verify-template-production-system.mjs',
  'scripts/check-line-length.mjs',
  'scripts/check-text-overflow.mjs',
  'scripts/check-export-artifacts.mjs',
]

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.mjs', '.js'])

const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', '.vite'])

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function collectFiles(absoluteDir) {
  const entries = await readdir(absoluteDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = resolve(absoluteDir, entry.name)
    if (entry.isDirectory()) {
      if (SKIPPED_DIRECTORIES.has(entry.name)) continue
      files.push(...(await collectFiles(entryPath)))
    } else if (SCANNED_EXTENSIONS.has(extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

const violations = []

async function resolveTargets(root) {
  const absolute = resolve(repoRoot, root)
  // 감시 대상이 사라졌으면 조용히 건너뛰지 않는다 — 대상이 없는 가드는 통과를 가장한다.
  const info = await stat(absolute).catch(() => null)
  if (!info) {
    throw new Error(`감시 대상이 없습니다: ${root} — 파일이 이동·삭제됐다면 SCANNED_ROOTS를 갱신하십시오.`)
  }
  return info.isDirectory() ? collectFiles(absolute) : [absolute]
}

for (const root of SCANNED_ROOTS) {
  for (const file of await resolveTargets(root)) {
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/)
    lines.forEach((line, index) => {
      if (line.length > MAX_LINE_LENGTH) {
        violations.push({
          file: relative(repoRoot, file).replaceAll('\\', '/'),
          line: index + 1,
          length: line.length,
        })
      }
    })
  }
}

if (violations.length === 0) {
  console.log(`line-length: PASS (${MAX_LINE_LENGTH}자 초과 라인 없음)`)
  process.exit(0)
}

console.error(`line-length: FAIL — ${MAX_LINE_LENGTH}자를 넘는 라인 ${violations.length}개`)
for (const violation of violations) {
  console.error(`  ${violation.file}:${violation.line} (${violation.length}자)`)
}
process.exit(1)
