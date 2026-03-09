import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { buildInventory } from './comment-path-utils.mjs'

const repoRoot = process.cwd()
const mapPath = path.join(repoRoot, 'docs/.vitepress/data/discussion-map.json')

async function main() {
  const [mapRaw, inventory] = await Promise.all([
    readFile(mapPath, 'utf8'),
    buildInventory(),
  ])

  const discussionMap = JSON.parse(mapRaw)
  const knownPaths = new Set(inventory.map((entry) => entry.commentPath))
  const errors = []

  for (const [commentPath, discussionNumber] of Object.entries(discussionMap)) {
    if (!knownPaths.has(commentPath)) {
      errors.push(`Unknown comment path in map: ${commentPath}`)
    }

    if (!Number.isInteger(discussionNumber) || discussionNumber <= 0) {
      errors.push(
        `Discussion number must be a positive integer for ${commentPath}: ${discussionNumber}`,
      )
    }
  }

  if (errors.length > 0) {
    process.stderr.write(`${errors.join('\n')}\n`)
    process.exitCode = 1
    return
  }

  process.stdout.write(
    `Validated ${Object.keys(discussionMap).length} discussion mappings against ${inventory.length} inventory entries.\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
