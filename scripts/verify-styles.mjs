import { readFileSync } from 'fs'
import { glob } from 'glob'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Check globals.css contains Tailwind import
function verifyTailwindImport() {
  const globalsPath = join(projectRoot, 'src/app/globals.css')
  const content = readFileSync(globalsPath, 'utf8')
  
  if (!content.includes('@import "tailwindcss"')) {
    console.error('Error: globals.css must contain @import "tailwindcss"')
    process.exit(1)
  }
}

// Check build output contains CSS assets
async function verifyCSSAssets() {
  const cssFiles = await glob('.next/**/*.css', {
    cwd: projectRoot,
    absolute: true
  })

  if (cssFiles.length === 0) {
    console.error('Error: No CSS assets found in build output')
    process.exit(1)
  }
}

// Run verifications
try {
  verifyTailwindImport()
  await verifyCSSAssets()
  console.log('✓ Style verification passed')
} catch (error) {
  console.error('Style verification failed:', error)
  process.exit(1)
}
