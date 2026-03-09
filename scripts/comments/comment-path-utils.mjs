import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const marker = '<PostComments/>'

export const repoRoot = process.cwd()
export const docsRoot = path.join(repoRoot, 'docs')

export function normalizeCommentPath(commentPath) {
  if (!commentPath) {
    return '/'
  }

  const normalized = commentPath.startsWith('/') ? commentPath : `/${commentPath}`

  try {
    return encodeURI(decodeURI(normalized))
  } catch {
    return encodeURI(normalized)
  }
}

export function toCommentPath(relativeFile) {
  if (relativeFile === 'index.md') {
    return '/'
  }

  if (relativeFile.endsWith('/index.md')) {
    return `/${relativeFile.slice(0, -'/index.md'.length)}/`
  }

  return `/${relativeFile.replace(/\.md$/u, '.html')}`
}

export async function collectMarkdownFiles(directory = docsRoot) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

export async function buildInventory() {
  const markdownFiles = await collectMarkdownFiles()
  const inventory = []

  for (const file of markdownFiles) {
    const content = await readFile(file, 'utf8')

    if (!content.includes(marker)) {
      continue
    }

    const relativeFile = path.relative(docsRoot, file).replaceAll(path.sep, '/')
    const commentPath = normalizeCommentPath(toCommentPath(relativeFile))

    inventory.push({
      sourceFile: relativeFile,
      commentPath,
    })
  }

  return inventory.sort((left, right) => left.commentPath.localeCompare(right.commentPath))
}
