import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildInventory, repoRoot } from './comment-path-utils.mjs'

function readArg(flag) {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : null
}

async function main() {
  const outArg = readArg('--out')
  const outPath = outArg ? path.resolve(repoRoot, outArg) : null
  const inventory = await buildInventory()
  const payload = JSON.stringify(inventory, null, 2)

  if (outPath) {
    await writeFile(outPath, `${payload}\n`, 'utf8')
  } else {
    process.stdout.write(`${payload}\n`)
  }

  process.stderr.write(
    `Generated ${inventory.length} comment inventory entries from markdown sources.\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
